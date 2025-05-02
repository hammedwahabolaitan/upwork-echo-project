
export interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  accountType?: string;
  bio?: string;
  skills?: string;
  hourlyRate?: number;
  avatarUrl?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  accountType: "client" | "freelancer";
}
