export interface LoginMutation {
    username: string;
    password: string;
    email: string;
}

export interface RegisterMutation {
    username: string;
    password: string;
    email: string;
    displayName?: string;
    avatar?: File | null;
}

export interface User {
    _id: string;
    email: string;
    password: string;
    username: string;
    avatar: string;
    token: string;
    displayName: string;
    role: string;
}

export interface Ingredient{
    _id: string;
    name: string;
    amount: string;
}

export interface ApiCocktail {
    _id: string;
    user: string;
    title: string;
    recipe: string;
    isPublic: boolean;
    ingredients: Ingredient[];
}

export interface CocktailMutation {
    title: string;
    recipe: string;
    isPublic?: boolean;
    ingredients: Ingredient[];
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