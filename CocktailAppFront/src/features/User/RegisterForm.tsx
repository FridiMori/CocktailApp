import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Avatar, Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import {type ChangeEvent, type FormEvent, useState} from "react";
import type {RegisterMutation} from "../../types";
import LockOutlineIcon from '@mui/icons-material/LockOutline';
import {selectRegisterError, selectRegisterLoading} from "./usersSlice.ts";
import {register} from "./usersThunk.ts";
import FileInput from "../../components/FileInput/FileInput.tsx"

const RegisterForm = () => {
    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectRegisterLoading);
    const error = useAppSelector(selectRegisterError);
    const navigate = useNavigate();

    const [state, setState] = useState<RegisterMutation>({
        username: '',
        password: '',
        email: '',
        displayName: '',
        avatar: null,
    });

    const getFieldError = (fieldName: string) => {
        return error?.errors[fieldName]?.message;
    };

    const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    const fileInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files) {
            setState((prevState) => ({
                ...prevState,
                [name]: files[0] || null,
            }));
        }
    };

    const submitFormHandler = async (e: FormEvent) => {
        e.preventDefault();

        try {
            await dispatch(register(state)).unwrap();
            navigate('/');
        } catch (e) {
            // error happened
        }
    };

    return (
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlineIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={submitFormHandler} sx={{ my: 3, maxWidth: '400px', width: '100%' }}>
                <Stack spacing={2}>
                    <TextField
                        required
                        label="Username"
                        name="username"
                        value={state.username}
                        onChange={inputChangeHandler}
                        autoComplete="new-username"
                        error={Boolean(getFieldError('username'))}
                        helperText={getFieldError('username')}
                    />
                    <TextField
                        type="email"
                        required
                        label="Email"
                        name="email"
                        value={state.email}
                        onChange={inputChangeHandler}
                        autoComplete="new-email"
                        error={Boolean(getFieldError('email'))}
                        helperText={getFieldError('email')}
                    />
                    <TextField
                        type="password"
                        required
                        label="Password"
                        name="password"
                        value={state.password}
                        onChange={inputChangeHandler}
                        autoComplete="new-password"
                        error={Boolean(getFieldError('password'))}
                        helperText={getFieldError('password')}
                    />
                    <TextField
                        label="Display Name"
                        name="displayName"
                        value={state.displayName}
                        onChange={inputChangeHandler}
                        helperText="Optional: How you want to be displayed"
                    />
                    <FileInput
                        label="Avatar"
                        name="avatar"
                        onChange={fileInputChangeHandler}
                    />
                    <Typography variant="caption" color="text.secondary">
                        If you don't upload an avatar, a default one will be assigned
                    </Typography>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </Button>
                </Stack>
            </Box>
            <Link component={RouterLink} to="/login">
                Already have an account? Sign in
            </Link>
        </Box>
    );
};

export default RegisterForm;