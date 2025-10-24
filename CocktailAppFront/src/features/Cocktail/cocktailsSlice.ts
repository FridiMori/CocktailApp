import { createSlice } from '@reduxjs/toolkit';
import { createCocktail, deleteCocktail, fetchCocktails, fetchUserCocktails, togglePublic } from './cocktailsThunk.ts';
import type { ApiCocktail } from '../../types';

interface CocktailsState {
    items: ApiCocktail[];
    userItems: ApiCocktail[];
    loading: boolean;
    creating: boolean;
}

const initialState: CocktailsState = {
    items: [],
    userItems: [],
    loading: false,
    creating: false,
};

const cocktailsSlice = createSlice({
    name: 'cocktails',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCocktails.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCocktails.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.items = payload;
            })
            .addCase(fetchCocktails.rejected, (state) => {
                state.loading = false;
            })
            .addCase(fetchUserCocktails.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserCocktails.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.userItems = payload;
            })
            .addCase(fetchUserCocktails.rejected, (state) => {
                state.loading = false;
            })
            .addCase(createCocktail.pending, (state) => {
                state.creating = true;
            })
            .addCase(createCocktail.fulfilled, (state) => {
                state.creating = false;
            })
            .addCase(createCocktail.rejected, (state) => {
                state.creating = false;
            });
    },
    selectors: {
        selectCocktails: (state) => state.items,
        selectUserCocktails: (state) => state.userItems,
        selectCocktailsLoading: (state) => state.loading,
        selectCocktailCreating: (state) => state.creating,
    },
});

export const cocktailsReducer = cocktailsSlice.reducer;
export const {
    selectCocktails,
    selectUserCocktails,
    selectCocktailsLoading,
    selectCocktailCreating,
} = cocktailsSlice.selectors;
