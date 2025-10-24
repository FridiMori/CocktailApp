import { AppBar, styled, Toolbar, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks.ts';
import { selectUser } from '../../features/User/usersSlice.ts';
import AnonymousMenu from './AnonymousMenu.tsx';
import UserMenu from './UserMenu.tsx';

const AppToolbar = () => {
    const user = useAppSelector(selectUser);

    const StyledLink = styled(Link)({
        color: 'inherit',
        textDecoration: 'none',
        '&:hover': {
            color: 'inherit',
        },
    });

    return (
        <AppBar position="sticky" sx={{ mb: 2 }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Typography variant="h6" component="div">
                    <StyledLink to={'/'}>Bar</StyledLink>
                </Typography>
                <Box>{user ? <UserMenu user={user} /> : <AnonymousMenu />}</Box>
            </Toolbar>
        </AppBar>
    );
};

export default AppToolbar;