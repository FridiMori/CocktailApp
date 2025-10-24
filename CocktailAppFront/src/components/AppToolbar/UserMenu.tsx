import { type FC, useState, type MouseEvent } from 'react';
import { Avatar, Button, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { useAppDispatch } from '../../app/hooks';
import { logout } from '../../features/User/usersThunk';
import { useNavigate } from 'react-router-dom';
import type { User } from '../../types';

interface Props {
    user: User;
}

const UserMenu: FC<Props> = ({ user }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleLogout = async () => {
        await dispatch(logout());
        handleClose();
        navigate('/');
    };

    const handleMyAccount = () => {
        handleClose();
        navigate('/my-cocktails');
    };

    const avatarSrc = user.avatar ? `http://localhost:8000/${user.avatar}` : undefined;
    const avatarLetter = (user.displayName || user.username).charAt(0).toUpperCase();

    return (
        <>
            <Button
                onClick={handleClick}
                color="inherit"
                startIcon={
                    <Avatar
                        src={avatarSrc}
                        alt={user.displayName || user.username}
                        sx={{ width: 32, height: 32 }}
                    >
                        {!avatarSrc && avatarLetter}
                    </Avatar>
                }
            >
                {user.displayName || user.username}
            </Button>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Stack spacing={1} sx={{ px: 2, pt: 1, pb: 1 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                            src={avatarSrc}
                            alt={user.displayName || user.username}
                            sx={{ width: 40, height: 40 }}
                        >
                            {!avatarSrc && avatarLetter}
                        </Avatar>
                        <Stack>
                            <Typography variant="subtitle1" fontWeight={600}>
                                {user.displayName || user.username}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {user.email}
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>

                <MenuItem onClick={handleMyAccount}>My cocktails</MenuItem>
                {user.role === 'admin' && (
                    <MenuItem onClick={() => { handleClose(); navigate('/admin/moderation'); }}>
                        Moderation
                    </MenuItem>
                )}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </>
    );
};

export default UserMenu;