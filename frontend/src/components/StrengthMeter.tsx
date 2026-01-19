import { Box, LinearProgress, Typography } from '@mui/material';

interface StrengthMeterProps {
    strength: number;
    strengthLabel: string;
    estimatedCrackTime: string;
    entropy: number;
}

/**
 * Visual password strength indicator component
 */
export default function StrengthMeter({
    strength,
    strengthLabel,
    estimatedCrackTime,
    entropy,
}: StrengthMeterProps) {
    // Determine color based on strength
    const getColor = () => {
        if (strength < 25) return 'error';
        if (strength < 50) return 'warning';
        if (strength < 75) return 'info';
        return 'success';
    };

    return (
        <Box sx={{ width: '100%', mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                    Password Strength
                </Typography>
                <Typography
                    variant="body2"
                    fontWeight="bold"
                    color={`${getColor()}.main`}
                >
                    {strengthLabel}
                </Typography>
            </Box>

            <LinearProgress
                variant="determinate"
                value={strength}
                color={getColor()}
                sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                    Entropy: {entropy.toFixed(1)} bits
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Time to crack: {estimatedCrackTime}
                </Typography>
            </Box>
        </Box>
    );
}
