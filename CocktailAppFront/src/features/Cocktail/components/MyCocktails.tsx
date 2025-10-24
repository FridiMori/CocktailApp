import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { fetchUserCocktails } from '../cocktailsThunk.ts';
import { selectUserCocktails, selectCocktailsLoading } from '../cocktailsSlice.ts';
import { CircularProgress, Stack, Typography } from '@mui/material';
import CocktailItem from './CocktailItem.tsx';

const MyCocktails = () => {
    const dispatch = useAppDispatch();
    const cocktails = useAppSelector(selectUserCocktails);
    const loading = useAppSelector(selectCocktailsLoading);

    useEffect(() => {
        dispatch(fetchUserCocktails());
    }, [dispatch]);

    return (
        <Stack spacing={2}>
            <Typography variant="h4">My cocktails</Typography>
            {loading ? (
                <CircularProgress />
            ) : (
                cocktails.map((cocktail) => <CocktailItem key={cocktail._id} cocktail={cocktail} />)
            )}
        </Stack>
    );
};

export default MyCocktails;
