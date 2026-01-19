import { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { analyzePassword } from '../services/api';
import type { PasswordResponse } from '../types';
import StrengthMeter from './StrengthMeter';

export default function StrengthTester() {
    const [password, setPassword] = useState('');
    const [result, setResult] = useState<PasswordResponse | null>(null);
    const [showPassword, setShowPassword] = useState(true);

    useEffect(() => {
        const analyze = async () => {
            if (!password) {
                setResult(null);
                return;
            }
            try {
                const data = await analyzePassword(password);
                setResult(data);
            } catch (error) {
                console.error('Failed to analyze password', error);
            }
        };

        const timeoutId = setTimeout(analyze, 300); // Debounce
        return () => clearTimeout(timeoutId);
    }, [password]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                    Test Password Strength
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Type a password to see how strong it is.
                </Typography>

                <TextField
                    fullWidth
                    label="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>

            {result && (
                <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                    <StrengthMeter
                        strength={result.strength}
                        strengthLabel={result.strengthLabel}
                        estimatedCrackTime={result.estimatedCrackTime}
                        entropy={result.entropy}
                    />
                </Paper>
            )}
        </Box>
    );
}
