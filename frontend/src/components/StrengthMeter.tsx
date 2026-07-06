import { Box, Typography } from '@mui/material';

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

            <Box sx={{ display: 'flex', gap: 1, height: 8, mt: 1, mb: 2 }}>
                {[1, 2, 3, 4].map((step) => {
                    let bg = 'rgba(255, 255, 255, 0.1)';
                    const colorMap: Record<string, string> = {
                        error: '#f44336',
                        warning: '#ff9800',
                        info: '#00bcd4',
                        success: '#4caf50'
                    };
                    
                    const isActive = strength > (step - 1) * 25 || (step === 1 && strength > 0);
                    if (isActive) {
                        bg = colorMap[getColor()];
                    }

                    return (
                        <Box
                            key={step}
                            sx={{
                                flex: 1,
                                borderRadius: 4,
                                backgroundColor: bg,
                                transition: 'all 0.4s ease',
                                transitionDelay: isActive ? `${step * 0.08}s` : '0s',
                                boxShadow: isActive ? `0 0 10px ${bg}80` : 'none',
                            }}
                        />
                    );
                })}
            </Box>

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
