// Internal service-layer interface (no validation decorators)
export interface CreateUserData {
    fullName: string;
    email: string;
    password: string; // Should be HASHED before passing to service
}

export interface UserResponse {
    _id: string;
    fullName: string;
    email: string;
    isActive: boolean;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}