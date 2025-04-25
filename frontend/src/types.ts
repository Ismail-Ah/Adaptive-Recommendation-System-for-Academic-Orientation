
export interface User {
  email: string;
  name: string;
  year: string;
  filiere: string;
  interests: string[];
  subjects: string[];
  careerAspirations:string[];
  duree:number;
  montionBac:string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  token?:any;
}

export interface AuthContextType extends AuthState {
  login: (studentId: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile : (data: any) => Promise<void>;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  year?: string;
  filiere? : string;
  interests?: string[];
  subjects?: string[];
  careerAspirations:string[];
  duree:number;
  montionBac:string;
}

export interface Subject {
  name: string;
  grade: number;
}

export interface Recommendation {
  programs: string[];
  careers: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  isCheckingAuth: boolean;
  error: string | null;
  token?:any;
}

export interface AuthContextType extends AuthState {
  login: (studentId: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

