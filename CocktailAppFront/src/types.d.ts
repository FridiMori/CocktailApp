export interface LoginMutation {
    username: string;
    password: string;
}

export interface User {
    _id: string;
    username: string;
    token: string;
    role: string;
}

export interface ValidationError {
    errors: {
        [key: string]: {
            message: string;
            name: string;
        };
        message: string;
        name: string;
        _message: string;
    };
}

export interface GlobalError {
    error: string;
}