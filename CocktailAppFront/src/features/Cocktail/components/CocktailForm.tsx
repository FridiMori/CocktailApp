import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { createCocktail, updateCocktail, fetchCocktail } from '../cocktailsThunk';
import { selectCreateLoading, selectUpdateLoading, selectCurrentCocktail, selectCocktailsLoading } from '../cocktailsSlice';
import {
    Box,
    TextField,
    Button,
    Stack,
    Typography,
    IconButton,
    Card,
    CardContent,
    CircularProgress,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

interface Ingredient {
    name: string;
    amount: string;
}

const CocktailForm = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const createLoading = useAppSelector(selectCreateLoading);
    const updateLoading = useAppSelector(selectUpdateLoading);
    const currentCocktail = useAppSelector(selectCurrentCocktail);
    const loadingCocktail = useAppSelector(selectCocktailsLoading);

    const isEditMode = Boolean(id);
    const loading = isEditMode ? updateLoading : createLoading;

    const [title, setTitle] = useState('');
    const [recipe, setRecipe] = useState('');
    const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: '', amount: '' }]);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    useEffect(() => {
        if (isEditMode && id) {
            dispatch(fetchCocktail(id));
        }
    }, [dispatch, id, isEditMode]);

    useEffect(() => {
        if (isEditMode && currentCocktail && currentCocktail._id === id) {
            setTitle(currentCocktail.title);
            setRecipe(currentCocktail.recipe);
            setIngredients(currentCocktail.ingredients.length > 0
                ? currentCocktail.ingredients.map(ing => ({ ...ing }))
                : [{ name: '', amount: '' }]
            );
            if (currentCocktail.image) {
                setImagePreview(`http://localhost:8000/${currentCocktail.image}`);
            }
        }
    }, [currentCocktail, id, isEditMode]);

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { name: '', amount: '' }]);
    };

    const handleRemoveIngredient = (index: number) => {
        if (ingredients.length > 1) {
            setIngredients(ingredients.filter((_, i) => i !== index));
        }
    };

    const handleIngredientChange = (index: number, field: 'name' | 'amount', value: string) => {
        const updated = [...ingredients];
        updated[index][field] = value;
        setIngredients(updated);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const cocktailData: any = {
            title,
            recipe,
            ingredients: ingredients.filter(ing => ing.name && ing.amount),
        };

        if (image) {
            cocktailData.image = image;
        }

        try {
            if (isEditMode && id) {
                await dispatch(updateCocktail({ id, cocktail: cocktailData })).unwrap();
            } else {
                await dispatch(createCocktail(cocktailData)).unwrap();
            }
            navigate(isEditMode ? '/my-cocktails' : '/');
        } catch (error) {
            console.error('Failed to save cocktail:', error);
        }
    };

    if (isEditMode && loadingCocktail) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Box maxWidth={800} mx="auto" py={3}>
            <Card>
                <CardContent>
                    <Typography variant="h4" mb={3}>
                        {isEditMode ? 'Edit cocktail' : 'Create new cocktail'}
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <TextField
                                label="Cocktail name"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                fullWidth
                            />

                            <Box>
                                <Typography variant="h6" mb={2}>
                                    Ingredients
                                </Typography>
                                {ingredients.map((ing, index) => (
                                    <Stack key={index} direction="row" spacing={2} mb={2}>
                                        <TextField
                                            label="Name"
                                            value={ing.name}
                                            onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                            required
                                            fullWidth
                                        />
                                        <TextField
                                            label="Amount"
                                            value={ing.amount}
                                            onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                                            required
                                            fullWidth
                                        />
                                        <IconButton
                                            onClick={() => handleRemoveIngredient(index)}
                                            color="error"
                                            disabled={ingredients.length === 1}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Stack>
                                ))}
                                <Button
                                    startIcon={<Add />}
                                    onClick={handleAddIngredient}
                                    variant="outlined"
                                >
                                    Add ingredient
                                </Button>
                            </Box>

                            <TextField
                                label="Recipe"
                                value={recipe}
                                onChange={(e) => setRecipe(e.target.value)}
                                required
                                multiline
                                rows={6}
                                fullWidth
                            />

                            <Box>
                                <Button variant="outlined" component="label">
                                    {isEditMode ? 'Change image' : 'Upload image'}
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </Button>
                                {imagePreview && (
                                    <Box mt={2}>
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }}
                                        />
                                    </Box>
                                )}
                            </Box>

                            <Stack direction="row" spacing={2}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    fullWidth
                                >
                                    {loading ? <CircularProgress size={24} /> : (isEditMode ? 'Update' : 'Create')}
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/my-cocktails')}
                                    disabled={loading}
                                    fullWidth
                                >
                                    Cancel
                                </Button>
                            </Stack>
                        </Stack>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default CocktailForm;