declare const ERROR_MESSAGES: {
    readonly [key: string]: string;
};

declare const SUCCESS_MESSAGES: {
    readonly [key: string]: string;
};

interface JwtPayload {
    userId: number;
    type: "access" | "refresh";
    iat?: number;
    exp?: number;
}

interface UserSelect {
    id: number;
    nome: string;
    email: string;
    senhaHash?: string;
}

interface AuthenticatedRequest {
    user: {
        userId: number;
        type: string;
    };
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface LoadingContextType {
    isLoading: boolean;
    setLoading: (value: boolean) => void;
}
interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    setUser: (user: User | null) => void;
    setAccessToken: (token: string | null) => void;
}

export { AuthContextType, AuthenticatedRequest, ERROR_MESSAGES, JwtPayload, LoadingContextType, SUCCESS_MESSAGES, User, UserSelect };
