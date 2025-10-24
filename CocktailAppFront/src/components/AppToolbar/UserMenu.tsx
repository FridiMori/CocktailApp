import {type FC, useState, type MouseEvent } from 'react';
import { Avatar, Button, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { useAppDispatch } from '../../app/hooks.ts';
import { logout } from '../../features/User/usersThunk.ts';
import type { User } from '../../types';

interface Props {
    user: User;
}

const UserMenu: FC<Props> = ({ user }) => {
    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleLogout = async () => {
        await dispatch(logout());
        handleClose();
    };

    const avatarUrl = user.avatar || '/defaultAvatar.jpg';

    return (
        <>
            <Button
                onClick={handleClick}
                color="inherit"
                startIcon={<Avatar src={avatarUrl} alt={user.username} />}
            >
                {user.displayName || user.username}
            </Button>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <Stack spacing={1} sx={{ px: 2, pt: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                        {user.displayName || user.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {user.email}
                    </Typography>
                </Stack>

                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </>
    );
};

export default UserMenu;
