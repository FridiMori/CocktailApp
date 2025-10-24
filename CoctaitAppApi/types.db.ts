import {Request} from "express";
import {HydratedDocument, Types} from "mongoose";

export interface UserFields {
    username: string;
    password: string;
    email: string;
    token: string;
    role: string;
    avatar?: string;
    displayName?: string;
    googleId?: string;
}
export interface Rating {
    user: Types.ObjectId;
    rating: number;
}

export interface RequestWithUser extends Request {
    user: HydratedDocument<UserFields>
}

export interface ingredient {
    _id: string;
    name: string;
    amount: string;
}

export interface Cocktails {
    _id: string;
    user: Types.ObjectId;
    title: string;
    recipe: string;
    image: string;
    ingredients: ingredient[];
    isPublished: boolean;
    ratings: Rating[];
}
