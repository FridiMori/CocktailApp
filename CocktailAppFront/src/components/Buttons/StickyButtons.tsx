import type {FC} from 'react';
import { Fab, Box, Tooltip } from '@mui/material';
import { Add, Settings } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/User/usersSlice.ts';

const StickyButtons: FC = () => {
    const navigate = useNavigate();
    const user = useAppSelector(selectUser);

    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                zIndex: 1300,
            }}
        >
            {user && (
                <Tooltip title="Создать коктейль" arrow>
                    <Fab
                        color="primary"
                        onClick={() => navigate('/cocktails/new')}
                        size="medium"
                    >
                        <Add />
                    </Fab>
                </Tooltip>
            )}

            {user?.role === 'admin' && (
                <Tooltip title="Under moderation" arrow>
                    <Fab
                        color="secondary"
                        onClick={() => navigate('/admin/moderation')}
                        size="medium"
                    >
                        <Settings />
                    </Fab>
                </Tooltip>
            )}
        </Box>
    );
};

export default StickyButtons;
