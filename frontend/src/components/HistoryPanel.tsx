import {
    Box,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Tooltip,
    Divider,
} from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import type { PasswordResponse } from '../types';

interface HistoryPanelProps {
    history: PasswordResponse[];
    onClear: () => void;
}

export default function HistoryPanel({ history, onClear }: HistoryPanelProps) {
    const handleCopy = (password: string) => {
        navigator.clipboard.writeText(password);
    };

    if (history.length === 0) {
        return null;
    }

    return (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                    History
                </Typography>
                <Typography
                    variant="caption"
                    sx={{ cursor: 'pointer', color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                    onClick={onClear}
                >
                    Clear History
                </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                {history.map((item, index) => (
                    <ListItem
                        key={index}
                        secondaryAction={
                            <Tooltip title="Copy">
                                <IconButton edge="end" size="small" onClick={() => handleCopy(item.password)}>
                                    <ContentCopy fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        }
                        sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            mb: 1,
                            borderRadius: 1,
                        }}
                    >
                        <ListItemText
                            primary={
                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                    {item.password}
                                </Typography>
                            }
                            secondary={
                                <Typography variant="caption" color={
                                    item.strength > 75 ? 'success.main' :
                                        item.strength > 50 ? 'info.main' :
                                            item.strength > 25 ? 'warning.main' : 'error.main'
                                }>
                                    {item.strengthLabel}
                                </Typography>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
}
