import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import type { ApiCocktail, CocktailMutation } from '../../types';

export const fetchCocktails = createAsyncThunk<ApiCocktail[]>(
    'cocktails/fetchAll',
    async () => {
        const { data } = await axiosApi.get<ApiCocktail[]>('/cocktails');
        return data;
    },
);

export const fetchUserCocktails = createAsyncThunk<ApiCocktail[]>(
    'cocktails/fetchUserCocktails',
    async () => {
        const { data } = await axiosApi.get<ApiCocktail[]>('/cocktails/my');
        return data;
    },
);

export const fetchCocktail = createAsyncThunk<ApiCocktail, string>(
    'cocktails/fetchOne',
    async (id) => {
        const { data } = await axiosApi.get<ApiCocktail>(`/cocktails/${id}`);
        return data;
    },
);

export const createCocktail = createAsyncThunk<void, CocktailMutation>(
    'cocktails/create',
    async (cocktail) => {
        const formData = new FormData();
        formData.append('title', cocktail.title);
        formData.append('recipe', cocktail.recipe);
        formData.append('ingredients', JSON.stringify(cocktail.ingredients)); // Исправлено
        if ((cocktail as any).image) {
            formData.append('image', (cocktail as any).image);
        }
        await axiosApi.post('/cocktails', formData);
    },
);

export const updateCocktail = createAsyncThunk<void, { id: string; cocktail: CocktailMutation }>(
    'cocktails/update',
    async ({ id, cocktail }) => {
        const formData = new FormData();
        formData.append('title', cocktail.title);
        formData.append('recipe', cocktail.recipe);
        formData.append('ingredients', JSON.stringify(cocktail.ingredients));
        if ((cocktail as any).image) {
            formData.append('image', (cocktail as any).image);
        }
        await axiosApi.put(`/cocktails/${id}`, formData);
    },
);

export const deleteCocktail = createAsyncThunk<void, string>(
    'cocktails/delete',
    async (id) => {
        await axiosApi.delete(`/cocktails/${id}`);
    },
);

export const publishCocktail = createAsyncThunk<void, string>(
    'cocktails/publish',
    async (id) => {
        await axiosApi.patch(`/cocktails/${id}/publish`);
    },
);

export const rateCocktail = createAsyncThunk<ApiCocktail, { id: string; rating: number }>(
    'cocktails/rate',
    async ({ id, rating }) => {
        const { data } = await axiosApi.post<ApiCocktail>(`/cocktails/${id}/rate`, { rating });
        return data;
    },
);

export const fetchUnpublishedCocktails = createAsyncThunk<ApiCocktail[]>(
    'cocktails/fetchUnpublished',
    async () => {
        const { data } = await axiosApi.get<ApiCocktail[]>('/cocktails/unpublished');
        return data;
    },
);