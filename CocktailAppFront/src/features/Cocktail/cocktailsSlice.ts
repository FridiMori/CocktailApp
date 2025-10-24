import { createSlice } from '@reduxjs/toolkit';
import {
    fetchCocktails,
    fetchUserCocktails,
    fetchCocktail,
    createCocktail,
    updateCocktail,
    deleteCocktail,
    publishCocktail,
    rateCocktail,
    fetchUnpublishedCocktails,
} from './cocktailsThunk';
import type { ApiCocktail } from '../../types';

interface CocktailsState {
    items: ApiCocktail[];
    userCocktails: ApiCocktail[];
    unpublishedCocktails: ApiCocktail[];
    current: ApiCocktail | null;
    loading: boolean;
    createLoading: boolean;
    updateLoading: boolean;
    deleteLoading: boolean;
    publishLoading: boolean;
    rateLoading: boolean;
}

const initialState: CocktailsState = {
    items: [],
    userCocktails: [],
    unpublishedCocktails: [],
    current: null,
    loading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
    publishLoading: false,
    rateLoading: false,
};

const cocktailsSlice = createSlice({
    name: 'cocktails',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchCocktails.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchCocktails.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.items = payload;
        });
        builder.addCase(fetchCocktails.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(fetchUserCocktails.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchUserCocktails.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.userCocktails = payload;
        });
        builder.addCase(fetchUserCocktails.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(fetchCocktail.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchCocktail.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.current = payload;
        });
        builder.addCase(fetchCocktail.rejected, (state) => {
            state.loading = false;
        });

        builder.addCase(createCocktail.pending, (state) => {
            state.createLoading = true;
        });
        builder.addCase(createCocktail.fulfilled, (state) => {
            state.createLoading = false;
        });
        builder.addCase(createCocktail.rejected, (state) => {
            state.createLoading = false;
        });

        builder.addCase(updateCocktail.pending, (state) => {
            state.updateLoading = true;
        });
        builder.addCase(updateCocktail.fulfilled, (state) => {
            state.updateLoading = false;
        });
        builder.addCase(updateCocktail.rejected, (state) => {
            state.updateLoading = false;
        });

        builder.addCase(deleteCocktail.pending, (state) => {
            state.deleteLoading = true;
        });
        builder.addCase(deleteCocktail.fulfilled, (state, { meta }) => {
            state.deleteLoading = false;
            state.items = state.items.filter(c => c._id !== meta.arg);
            state.userCocktails = state.userCocktails.filter(c => c._id !== meta.arg);
            state.unpublishedCocktails = state.unpublishedCocktails.filter(c => c._id !== meta.arg);
        });
        builder.addCase(deleteCocktail.rejected, (state) => {
            state.deleteLoading = false;
        });

        builder.addCase(publishCocktail.pending, (state) => {
            state.publishLoading = true;
        });
        builder.addCase(publishCocktail.fulfilled, (state) => {
            state.publishLoading = false;
        });
        builder.addCase(publishCocktail.rejected, (state) => {
            state.publishLoading = false;
        });

        builder.addCase(rateCocktail.pending, (state) => {
            state.rateLoading = true;
        });
        builder.addCase(rateCocktail.fulfilled, (state, { payload }) => {
            state.rateLoading = false;
            state.current = payload;
        });
        builder.addCase(rateCocktail.rejected, (state) => {
            state.rateLoading = false;
        });

        builder.addCase(fetchUnpublishedCocktails.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchUnpublishedCocktails.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.unpublishedCocktails = payload;
        });
        builder.addCase(fetchUnpublishedCocktails.rejected, (state) => {
            state.loading = false;
        });
    },
});

export const selectCocktails = (state: { cocktails: CocktailsState }) => state.cocktails.items;
export const selectUserCocktails = (state: { cocktails: CocktailsState }) => state.cocktails.userCocktails;
export const selectUnpublishedCocktails = (state: { cocktails: CocktailsState }) => state.cocktails.unpublishedCocktails; // Добавлен селектор
export const selectCurrentCocktail = (state: { cocktails: CocktailsState }) => state.cocktails.current;
export const selectCocktailsLoading = (state: { cocktails: CocktailsState }) => state.cocktails.loading;
export const selectCreateLoading = (state: { cocktails: CocktailsState }) => state.cocktails.createLoading;
export const selectUpdateLoading = (state: { cocktails: CocktailsState }) => state.cocktails.updateLoading;
export const selectDeleteLoading = (state: { cocktails: CocktailsState }) => state.cocktails.deleteLoading;
export const selectPublishLoading = (state: { cocktails: CocktailsState }) => state.cocktails.publishLoading;
export const selectRateLoading = (state: { cocktails: CocktailsState }) => state.cocktails.rateLoading;

export const cocktailsReducer = cocktailsSlice.reducer;