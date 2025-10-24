import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchCocktails } from '../cocktailsThunk';
import { selectCocktails, selectCocktailsLoading } from '../cocktailsSlice';
import { Grid, CircularProgress, Box, Typography } from '@mui/material';
import CocktailItem from './CocktailItem';

const CocktailsList = () => {
    const dispatch = useAppDispatch();
    const cocktails = useAppSelector(selectCocktails);
    const loading = useAppSelector(selectCocktailsLoading);

    useEffect(() => {
        dispatch(fetchCocktails());
    }, [dispatch]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (cocktails.length === 0) {
        return (
            <Box textAlign="center" py={8}>
                <Typography variant="h5" color="text.secondary">
                    Cocktails not found
                </Typography>
                <Typography variant="body1" color="text.secondary" mt={2}>
                    Be the first to add a cocktail!
                </Typography>
            </Box>
        );
    }

    return (
        <Box py={3}>
            <Typography variant="h4" mb={3}>
                Cocktails
            </Typography>
            <Grid container spacing={3}>
                {cocktails.map(cocktail => (
                    <Grid item xs={12} sm={6} md={4} key={cocktail._id} {...({} as any)}>
                        <CocktailItem cocktail={cocktail} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default CocktailsList;
