import axios from 'axios';

// Você pode ajustar a URL base depois para apontar para sua API local ou de produção
export const api = axios.create({
  baseURL: 'http://192.168.3.22:3333', // IP da sua máquina para testar no celular físico
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
