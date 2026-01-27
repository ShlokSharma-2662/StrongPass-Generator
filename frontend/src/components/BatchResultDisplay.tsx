import {
    Box,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Tooltip,
    Alert,
    Snackbar,
    Button,
} from '@mui/material';
import { ContentCopy, CheckCircle } from '@mui/icons-material';
import type { PasswordResponse } from '../types';
import { useState, useMemo } from 'react';

interface BatchResultDisplayProps {
    results: PasswordResponse[];
}

export default function BatchResultDisplay({ results }: BatchResultDisplayProps) {
    const resultsWithIds = useMemo(() => {
        return results.map(item => ({
            ...item,
            id: crypto.randomUUID()
        }));
    }, [results]);

    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (password: string, id: string) => {
        navigator.clipboard.writeText(password);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleCopyAll = () => {
        const allPasswords = results.map(r => r.password).join('\n');
        navigator.clipboard.writeText(allPasswords);
        setCopiedId('ALL');
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                    Generated Passwords ({results.length})
                </Typography>
                <Button variant="outlined" size="small" startIcon={<ContentCopy />} onClick={handleCopyAll}>
                    Copy All
                </Button>
            </Box>

            <List dense sx={{ maxHeight: 400, overflow: 'auto' }}>
                {resultsWithIds.map((item) => (
                    <ListItem
                        key={item.id}
                        secondaryAction={
                            <Tooltip title="Copy">
                                <IconButton edge="end" size="small" onClick={() => handleCopy(item.password, item.id)}>
                                    {copiedId === item.id ? <CheckCircle color="success" fontSize="small" /> : <ContentCopy fontSize="small" />}
                                </IconButton>
                            </Tooltip>
                        }
                        sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            mb: 1,
                            borderRadius: 1,
                            borderLeft: `4px solid ${item.strength > 75 ? '#4caf50' :
                                item.strength > 50 ? '#2196f3' :
                                    item.strength > 25 ? '#ff9800' : '#f44336'
                                }`
                        }}
                    >
                        <ListItemText
                            primary={
                                <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                                    {item.password}
                                </Typography>
                            }
                            secondary={
                                <Typography variant="caption" color="text.secondary">
                                    {item.strengthLabel} • {item.entropy.toFixed(0)} bits
                                </Typography>
                            }
                        />
                    </ListItem>
                ))}
            </List>

            <Snackbar
                open={copiedId !== null}
                autoHideDuration={2000}
                onClose={() => setCopiedId(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" variant="filled">
                    {copiedId === 'ALL' ? 'All passwords copied!' : 'Password copied!'}
                </Alert>
            </Snackbar>
        </Paper>
    );
}
