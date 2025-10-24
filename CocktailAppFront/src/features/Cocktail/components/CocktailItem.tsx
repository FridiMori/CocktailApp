import { Card, CardMedia, CardContent, Typography, Stack, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { ApiCocktail } from '../../../types';

interface Props {
    cocktail: ApiCocktail;
}

const CocktailItem = ({ cocktail }: Props) => {
    const navigate = useNavigate();

    return (
        <Card
            onClick={() => navigate(`/cocktails/${cocktail._id}`)}
            sx={{ cursor: 'pointer', display: 'flex', '&:hover': { boxShadow: 4 } }}
        >
            {cocktail.image && (
                <CardMedia
                    component="img"
                    sx={{ width: 200, objectFit: 'cover' }}
                    image={`http://localhost:8000/${cocktail.image}`}
                    alt={cocktail.title}
                />
            )}
            <CardContent sx={{ flex: 1 }}>
                <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">{cocktail.title}</Typography>
                        {!cocktail.isPublished && (
                            <Chip label="Under moderation" color="warning" size="small" />
                        )}
                    </Stack>

                    <Typography variant="body2" color="text.secondary">
                        Rating: {(cocktail.rating || 0).toFixed(1)} ⭐
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Ingredients: {cocktail.ingredients.length}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                        Create: {new Date(cocktail.createdAt).toLocaleDateString()}
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default CocktailItem;