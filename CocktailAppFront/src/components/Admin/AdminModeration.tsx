import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchUnpublishedCocktails, publishCocktail, deleteCocktail } from '../../features/Cocktail/cocktailsThunk';
import { selectUnpublishedCocktails, selectCocktailsLoading, selectPublishLoading, selectDeleteLoading } from '../../features/Cocktail/cocktailsSlice';
import {
    CircularProgress,
    Stack,
    Typography,
    Box,
    Alert,
    Card,
    CardMedia,
    CardContent,
    Button,
    Chip
} from '@mui/material';
import { Check, Delete } from '@mui/icons-material';
import type { ApiCocktail } from '../../types';

const AdminModeration = () => {
    const dispatch = useAppDispatch();
    const unpublishedCocktails = useAppSelector(selectUnpublishedCocktails);
    const loading = useAppSelector(selectCocktailsLoading);
    const publishLoading = useAppSelector(selectPublishLoading);
    const deleteLoading = useAppSelector(selectDeleteLoading);

    useEffect(() => {
        dispatch(fetchUnpublishedCocktails());
    }, [dispatch]);

    const handlePublish = async (id: string) => {
        try {
            await dispatch(publishCocktail(id)).unwrap();
            dispatch(fetchUnpublishedCocktails());
        } catch (error) {
            console.error('Failed to publish:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this cocktail?')) {
            try {
                await dispatch(deleteCocktail(id)).unwrap();
                dispatch(fetchUnpublishedCocktails());
            } catch (error) {
                console.error('Failed to delete:', error);
            }
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Box py={3}>
            <Typography variant="h4" mb={3}>
                Cocktail moderation
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
                Review and moderate cocktails waiting for approval
            </Alert>

            {unpublishedCocktails.length === 0 ? (
                <Box textAlign="center" py={8}>
                    <Typography variant="h6" color="text.secondary">
                        There are no cocktails under moderation
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mt={2}>
                        All cocktails are checked and published!
                    </Typography>
                </Box>
            ) : (
                <Stack spacing={3}>
                    {unpublishedCocktails.map((cocktail: ApiCocktail) => (
                        <Card key={cocktail._id} sx={{ display: 'flex', position: 'relative' }}>
                            <Chip
                                label="Pending"
                                color="warning"
                                size="small"
                                sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}
                            />

                            {cocktail.image && (
                                <CardMedia
                                    component="img"
                                    sx={{ width: 200, objectFit: 'cover' }}
                                    image={`http://localhost:8000/${cocktail.image}`}
                                    alt={cocktail.title}
                                />
                            )}

                            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <Box flex={1}>
                                    <Typography variant="h5" mb={1}>
                                        {cocktail.title}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" mb={2}>
                                        Author: {cocktail.user.username}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" mb={1}>
                                        <strong>Ingredients ({cocktail.ingredients.length}):</strong>
                                    </Typography>
                                    <Stack spacing={0.5} mb={2}>
                                        {cocktail.ingredients.slice(0, 3).map((ing, i) => (
                                            <Typography key={i} variant="body2" color="text.secondary">
                                                • {ing.name} — {ing.amount}
                                            </Typography>
                                        ))}
                                        {cocktail.ingredients.length > 3 && (
                                            <Typography variant="body2" color="text.secondary">
                                                ... and {cocktail.ingredients.length - 3} more
                                            </Typography>
                                        )}
                                    </Stack>

                                    <Typography variant="body2" color="text.secondary" mb={1}>
                                        <strong>Recipe:</strong>
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {cocktail.recipe}
                                    </Typography>
                                </Box>

                                <Stack direction="row" spacing={2} mt={3}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        startIcon={publishLoading ? <CircularProgress size={20} /> : <Check />}
                                        onClick={() => handlePublish(cocktail._id)}
                                        disabled={publishLoading || deleteLoading}
                                        fullWidth
                                    >
                                        Approve & Publish
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={deleteLoading ? <CircularProgress size={20} /> : <Delete />}
                                        onClick={() => handleDelete(cocktail._id)}
                                        disabled={publishLoading || deleteLoading}
                                        fullWidth
                                    >
                                        Reject & Delete
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            )}
        </Box>
    );
};

export default AdminModeration;