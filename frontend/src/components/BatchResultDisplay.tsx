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
} from '@mui/material';
import { ContentCopy, CheckCircle } from '@mui/icons-material';
import type { PasswordResponse } from '../types';
import { useState } from 'react';

interface BatchResultDisplayProps {
    results: PasswordResponse[];
}

export default function BatchResultDisplay({ results }: BatchResultDisplayProps) {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleCopy = (password: string, index: number) => {
        navigator.clipboard.writeText(password);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleCopyAll = () => {
        const allPasswords = results.map(r => r.password).join('\n');
        navigator.clipboard.writeText(allPasswords);
        setCopiedIndex(-1); // -1 for all
        setTimeout(() => setCopiedIndex(null), 2000);
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
                {results.map((item, index) => (
                    <ListItem
                        key={index}
                        secondaryAction={
                            <Tooltip title="Copy">
                                <IconButton edge="end" size="small" onClick={() => handleCopy(item.password, index)}>
                                    {copiedIndex === index ? <CheckCircle color="success" fontSize="small" /> : <ContentCopy fontSize="small" />}
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
                open={copiedIndex !== null}
                autoHideDuration={2000}
                onClose={() => setCopiedIndex(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" variant="filled">
                    {copiedIndex === -1 ? 'All passwords copied!' : 'Password copied!'}
                </Alert>
            </Snackbar>
        </Paper>
    );
}

import { Button } from '@mui/material';
