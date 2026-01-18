import { UserDocument } from '../user/schema/user.schema';

// Response types for auth endpoints
export interface AuthRegisterResponse {
    message: string;
}

export interface UserResponse{
    id:string,
    email:string,
    role:string
}

export interface AuthLoginResponse {
    message:string,
    user:UserResponse,
    accessToken:string
    
}

export interface TokenPayload {
    sub: string;  // user id
    role: string;
}

export interface LoginResponse {
    user:UserResponse,
  tokens:{accessToken: string;
  refreshToken: {
    jti: string;
    refreshToken: string;
  }}
}