// @/interfaces/slices/user.ts
export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    phone?: string;
    address?: string;
    created_at?: string;
    updated_at?: string;
    // Add other relevant user fields
  }
  
  export interface UserState {
    users: User[];
    currentUser: User | null;
    loading: boolean;
    error: string | null;
    userDetails: User | null;
  }
  
  export interface UserResponse {
    success: boolean;
    result?: User[] | User;
    error?: string;
  }