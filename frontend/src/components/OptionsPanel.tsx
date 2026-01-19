import {
    Box,
    Paper,
    Typography,
    Slider,
    FormControlLabel,
    Switch,
    Divider,
} from '@mui/material';
import type { PasswordOptions } from '../types';

interface OptionsPanelProps {
    options: PasswordOptions;
    onOptionsChange: (options: PasswordOptions) => void;
}

/**
 * Password customization options panel
 */
export default function OptionsPanel({
    options,
    onOptionsChange,
}: OptionsPanelProps) {
    const handleLengthChange = (_event: Event, value: number | number[]) => {
        onOptionsChange({ ...options, length: value as number });
    };

    const handleToggle = (key: keyof PasswordOptions) => {
        const newOptions = { ...options, [key]: !options[key] };

        // Ensure at least one character type is selected
        const hasCharType =
            newOptions.includeUppercase ||
            newOptions.includeLowercase ||
            newOptions.includeNumbers ||
            newOptions.includeSymbols;

        if (hasCharType) {
            onOptionsChange(newOptions);
        }
    };

    return (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
                Customize Your Password
            </Typography>

            {/* Length Slider */}
            <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Password Length: {options.length}
                </Typography>
                <Slider
                    value={options.length}
                    onChange={handleLengthChange}
                    min={4}
                    max={128}
                    marks={[
                        { value: 4, label: '4' },
                        { value: 32, label: '32' },
                        { value: 64, label: '64' },
                        { value: 128, label: '128' },
                    ]}
                    sx={{
                        '& .MuiSlider-markLabel': {
                            fontSize: '0.75rem',
                        },
                    }}
                />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Character Types */}
            <Typography variant="body2" fontWeight={600} gutterBottom>
                Character Types
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={options.includeUppercase}
                            onChange={() => handleToggle('includeUppercase')}
                            color="primary"
                        />
                    }
                    label="Uppercase (A-Z)"
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={options.includeLowercase}
                            onChange={() => handleToggle('includeLowercase')}
                            color="primary"
                        />
                    }
                    label="Lowercase (a-z)"
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={options.includeNumbers}
                            onChange={() => handleToggle('includeNumbers')}
                            color="primary"
                        />
                    }
                    label="Numbers (0-9)"
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={options.includeSymbols}
                            onChange={() => handleToggle('includeSymbols')}
                            color="primary"
                        />
                    }
                    label="Symbols (!@#$%^&*)"
                />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Exclusion Options */}
            <Typography variant="body2" fontWeight={600} gutterBottom>
                Exclusion Options
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={options.excludeSimilar}
                            onChange={() => handleToggle('excludeSimilar')}
                            color="secondary"
                        />
                    }
                    label="Exclude similar characters (l, 1, I, O, 0)"
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={options.excludeAmbiguous}
                            onChange={() => handleToggle('excludeAmbiguous')}
                            color="secondary"
                        />
                    }
                    label="Exclude ambiguous symbols ({, }, [, ], (, ))"
                />
            </Box>
        </Paper>
    );
}
