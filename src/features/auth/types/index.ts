export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
  has_connected_account: boolean;
}

export interface LoginData {
  email: string;
  password?: string;
}
