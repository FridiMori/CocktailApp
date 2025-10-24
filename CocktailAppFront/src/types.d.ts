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
    name: string;
    amount: string;
}

export interface Rating {
    user: User;
    rating: number;
}

export interface ApiCocktail {
    _id: string;
    user: {
        _id: string;
        username: string;
    };
    title: string;
    recipe: string;
    image: string | null;
    ingredients: Ingredient[];
    isPublished: boolean;
    rating: number;
    createdAt: string;
}

export interface CocktailMutation {
    title: string;
    recipe: string;
    image: File | null;
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