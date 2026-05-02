import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Necessário para que o fluxo de autenticação via web retorne ao app
WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  const { loginWithGoogle } = useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Configuração dos Client IDs (que você vai preencher no .env depois)
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });

  useEffect(() => {
    async function handleSignInWithGoogle() {
      if (response?.type === 'success') {
        setIsGoogleLoading(true);
        try {
          const token = response.authentication?.idToken || response.authentication?.accessToken;
          
          if (token) {
            await loginWithGoogle(token);
          }
        } catch (error) {
          console.error("Falha no login com Google da API Solaryz", error);
        } finally {
          setIsGoogleLoading(false);
        }
      }
    }

    handleSignInWithGoogle();
  }, [response]);

  return {
    isGoogleLoading,
    isGoogleReady: !!request,
    signInWithGoogle: () => promptAsync(),
  };
}
