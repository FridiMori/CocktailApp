import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
    fetchCocktail,
    deleteCocktail,
    publishCocktail,
    rateCocktail,
} from '../cocktailsThunk';
import {
    selectCurrentCocktail,
    selectCocktailsLoading,
    selectDeleteLoading,
    selectPublishLoading,
    selectRateLoading,
} from '../cocktailsSlice';
import {
    Box,
    Typography,
    Stack,
    Button,
    CircularProgress,
    Rating,
    Card,
    CardMedia,
    CardContent,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
    Alert,
} from '@mui/material';
import { selectUser } from '../../User/usersSlice.ts';

const CocktailDetails = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const cocktail = useAppSelector(selectCurrentCocktail);
    const loading = useAppSelector(selectCocktailsLoading);
    const deleteLoading = useAppSelector(selectDeleteLoading);
    const publishLoading = useAppSelector(selectPublishLoading);
    const rateLoading = useAppSelector(selectRateLoading);
    const user = useAppSelector(selectUser);

    useEffect(() => {
        if (id) dispatch(fetchCocktail(id));
    }, [dispatch, id]);

    if (loading || !cocktail) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress size={60} />
            </Box>
        );
    }

    const isAuthor = user && cocktail.user._id === user._id;
    const isAdmin = user && user.role === 'admin';

    const handleDelete = async () => {
        if (id && (isAuthor || isAdmin)) {
            if (confirm('Вы уверены, что хотите удалить этот коктейль?')) {
                try {
                    await dispatch(deleteCocktail(id)).unwrap();
                    navigate('/');
                } catch (error) {
                    console.error('Failed to delete:', error);
                }
            }
        }
    };

    const handlePublish = async () => {
        if (id && isAdmin) {
            try {
                await dispatch(publishCocktail(id)).unwrap();
                dispatch(fetchCocktail(id));
            } catch (error) {
                console.error('Failed to publish:', error);
            }
        }
    };

    const handleRate = async (_: any, newValue: number | null) => {
        if (!user) {
            alert('Please log in to rate the cocktails.!');
            return;
        }
        if (id && newValue !== null) {
            try {
                await dispatch(rateCocktail({ id, rating: newValue })).unwrap();
            } catch (error) {
                console.error('Failed to rate:', error);
            }
        }
    };

    const handleEdit = () => {
        navigate(`/cocktails/${id}/edit`);
    };

    return (
        <Box maxWidth={800} mx="auto" py={3}>
            <Card>
                {cocktail.image && (
                    <CardMedia
                        component="img"
                        height="400"
                        image={`http://localhost:8000/${cocktail.image}`}
                        alt={cocktail.title}
                        sx={{ objectFit: 'cover' }}
                    />
                )}
                <CardContent>
                    <Stack spacing={3}>
                        <Box>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                <Typography variant="h4">
                                    {cocktail.title}
                                </Typography>
                                {!cocktail.isPublished && (
                                    <Chip label="Under moderation" color="warning" />
                                )}
                            </Stack>

                            <Typography variant="body2" color="text.secondary">
                                Author: {cocktail.user.username} • {new Date(cocktail.createdAt).toLocaleString('ru-RU')}
                            </Typography>
                        </Box>

                        <Divider />

                        <Box>
                            <Typography variant="h6" mb={2} fontWeight="bold">
                                Ingredients:
                            </Typography>
                            <List>
                                {cocktail.ingredients.map((ing, i) => (
                                    <ListItem key={i} sx={{ py: 0.5 }}>
                                        <ListItemText
                                            primary={`${ing.name} — ${ing.amount}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>

                        <Divider />

                        <Box>
                            <Typography variant="h6" mb={2} fontWeight="bold">
                                Cooking recipe:
                            </Typography>
                            <Typography whiteSpace="pre-wrap" sx={{ pl: 2 }}>
                                {cocktail.recipe}
                            </Typography>
                        </Box>

                        <Divider />

                        <Box>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography variant="h6">Рейтинг:</Typography>
                                {rateLoading ? (
                                    <CircularProgress size={24} />
                                ) : (
                                    <>
                                        <Rating
                                            name="cocktail-rating"
                                            value={cocktail.rating}
                                            onChange={handleRate}
                                            precision={0.5}
                                            disabled={!user}
                                        />
                                        <Typography variant="body1" fontWeight="bold">
                                            ({cocktail.rating.toFixed(1)})
                                        </Typography>
                                    </>
                                )}
                            </Stack>
                            {!user && (
                                <Alert severity="info" sx={{ mt: 2 }}>
                                    Log in to rate the cocktail
                                </Alert>
                            )}
                        </Box>

                        {(isAuthor || isAdmin) && (
                            <>
                                <Divider />
                                <Stack direction="row" spacing={2} flexWrap="wrap">
                                    {isAuthor && (
                                        <Button
                                            variant="outlined"
                                            onClick={handleEdit}
                                            disabled={deleteLoading || publishLoading}
                                        >
                                            Edit
                                        </Button>
                                    )}
                                    {(isAuthor || isAdmin) && (
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={handleDelete}
                                            disabled={deleteLoading || publishLoading}
                                        >
                                            {deleteLoading ? <CircularProgress size={24} /> : 'Delete'}
                                        </Button>
                                    )}
                                    {isAdmin && !cocktail.isPublished && (
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={handlePublish}
                                            disabled={deleteLoading || publishLoading}
                                        >
                                            {publishLoading ? <CircularProgress size={24} /> : 'Public'}
                                        </Button>
                                    )}
                                </Stack>
                            </>
                        )}
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};

export default CocktailDetails;