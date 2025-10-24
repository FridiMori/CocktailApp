import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi.ts';
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
        const { data } = await axiosApi.get<ApiCocktail[]>('/cocktails/user');
        return data;
    },
);

export const createCocktail = createAsyncThunk<void, CocktailMutation>(
    'cocktails/create',
    async (cocktail) => {
        const formData = new FormData();
        formData.append('title', cocktail.title);
        formData.append('recipe', cocktail.recipe);

        cocktail.ingredients.forEach((ing, i) => {
            formData.append(`ingredients[${i}][name]`, ing.name);
            formData.append(`ingredients[${i}][amount]`, ing.amount);
        });

        await axiosApi.post('/cocktails', formData);
    },
);

export const deleteCocktail = createAsyncThunk<void, string>(
    'cocktails/delete',
    async (id) => {
        await axiosApi.delete('/cocktails/' + id);
    },
);

export const togglePublic = createAsyncThunk<void, string>(
    'cocktails/togglePublic',
    async (id) => {
        await axiosApi.patch(`/cocktails/${id}/toggle`);
    },
);
