export const AUTH_TOKEN_KEY = "auth-token";

interface TokenPayload {
    exp?: number;
    iat?: number;
    user_id?: string;
}


export function setAuthToken(token: string): void {
    if (typeof window === "undefined") return;

    // Validate token format before storing
    if (isValidJWT(token)) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
        throw new Error("Invalid token format");
    }
}


export function getAuthToken(): string | null {
    if (typeof window === "undefined") return null;

    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return null;

    if (isValidJWT(token) && !isTokenExpired(token)) {
        return token;
    } else {
        removeAuthToken();
        return null;
    }
}

export function removeAuthToken(): void {
    if (typeof window === "undefined") return;

    localStorage.removeItem(AUTH_TOKEN_KEY);
}


function isValidJWT(token: string): boolean {
    try {
        const parts = token.split(".");
        return parts.length === 3;
    } catch {
        return false;
    }
}


function isTokenExpired(token: string): boolean {
    try {
        const payload: TokenPayload = JSON.parse(atob(token.split(".")[1]));
        if (!payload.exp) return false;

        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp < currentTime;
    } catch {
        return true;
    }
}

export function getTokenExpiry(token: string): Date | null {
    try {
        const payload: TokenPayload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp ? new Date(payload.exp * 1000) : null;
    } catch {
        return null;
    }
}


export function isSecureContext(): boolean {
    if (typeof window === "undefined") return true;
    return (
        window.location.protocol === "https:" ||
        window.location.hostname === "localhost"
    );
}

export function checkSecurityContext(): void {
    if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
        if (!isSecureContext()) {
            console.warn(
                "⚠️ Security Warning: Not using HTTPS in production. Tokens may be vulnerable.",
            );
        }
    }
}
