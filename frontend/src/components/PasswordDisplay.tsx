import { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    IconButton,
    Tooltip,
    Snackbar,
    Alert,
} from '@mui/material';
import {
    ContentCopy,
    Visibility,
    VisibilityOff,
    CheckCircle,
} from '@mui/icons-material';

interface PasswordDisplayProps {
    password: string;
}

/**
 * Password display component with copy and visibility toggle
 */
export default function PasswordDisplay({ password }: PasswordDisplayProps) {
    const [showPassword, setShowPassword] = useState(true);
    const [copied, setCopied] = useState(false);
    const [displayPassword, setDisplayPassword] = useState(password);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (!password) {
            setDisplayPassword('');
            return;
        }

        setIsAnimating(true);
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
        let iterations = 0;
        
        const interval = setInterval(() => {
            setDisplayPassword(
                Array.from({ length: password.length })
                    .map(() => chars[Math.floor(Math.random() * chars.length)])
                    .join('')
            );
            
            iterations++;
            if (iterations > 10) {
                clearInterval(interval);
                setDisplayPassword(password);
                setIsAnimating(false);
            }
        }, 30);

        return () => clearInterval(interval);
    }, [password]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(password);
            setCopied(true);
        } catch (error) {
            console.error('Failed to copy password:', error);
        }
    };

    const handleCloseCopied = () => {
        setCopied(false);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <Paper
                className={copied ? 'copy-success' : ''}
                elevation={3}
                sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: 2,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                }}
            >
                <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mb: 1 }}>
                    Your Generated Password
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        minHeight: 48,
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            flex: 1,
                            fontFamily: 'monospace',
                            fontWeight: 600,
                            wordBreak: 'break-all',
                            letterSpacing: showPassword ? 1 : 0,
                            fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                            opacity: isAnimating ? 0.7 : 1,
                            transition: 'opacity 0.2s ease',
                        }}
                    >
                        {password ? (showPassword ? displayPassword : '•'.repeat(password.length)) : 'Click Generate to create a password'}
                    </Typography>

                    {password && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title={showPassword ? 'Hide password' : 'Show password'}>
                                <IconButton
                                    onClick={togglePasswordVisibility}
                                    sx={{
                                        color: 'white',
                                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                                    }}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Copy to clipboard">
                                <IconButton
                                    onClick={handleCopy}
                                    sx={{
                                        color: 'white',
                                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                                    }}
                                >
                                    {copied ? <CheckCircle /> : <ContentCopy />}
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                </Box>
            </Paper>

            <Snackbar
                open={copied}
                autoHideDuration={2000}
                onClose={handleCloseCopied}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseCopied}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Password copied to clipboard!
                </Alert>
            </Snackbar>
        </>
    );
}
