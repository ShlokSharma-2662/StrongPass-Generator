import {
    Box,
    Paper,
    Typography,
    Slider,
    FormControlLabel,
    Switch,
    TextField,
    Divider,
} from '@mui/material';
import type { PassphraseOptions } from '../types';

interface PassphrasePanelProps {
    options: PassphraseOptions;
    onOptionsChange: (options: PassphraseOptions) => void;
}

export default function PassphrasePanel({
    options,
    onOptionsChange,
}: PassphrasePanelProps) {
    const handleWordCountChange = (_event: Event, value: number | number[]) => {
        onOptionsChange({ ...options, wordCount: value as number });
    };

    const handleToggle = (key: keyof PassphraseOptions) => {
        onOptionsChange({ ...options, [key]: !options[key] });
    };

    const handleSeparatorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onOptionsChange({ ...options, separator: event.target.value });
    };

    return (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
                Passphrase Options
            </Typography>

            <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Word Count: {options.wordCount}
                </Typography>
                <Slider
                    value={options.wordCount}
                    onChange={handleWordCountChange}
                    min={3}
                    max={20}
                    marks={[
                        { value: 3, label: '3' },
                        { value: 6, label: '6' },
                        { value: 12, label: '12' },
                        { value: 20, label: '20' },
                    ]}
                />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="Separator"
                    value={options.separator}
                    onChange={handleSeparatorChange}
                    size="small"
                    helperText="Character between words (e.g. - or space)"
                />

                <FormControlLabel
                    control={
                        <Switch
                            checked={options.capitalize}
                            onChange={() => handleToggle('capitalize')}
                            color="primary"
                        />
                    }
                    label="Capitalize Words"
                />

                <FormControlLabel
                    control={
                        <Switch
                            checked={options.includeNumber}
                            onChange={() => handleToggle('includeNumber')}
                            color="primary"
                        />
                    }
                    label="Include Number"
                />
            </Box>
        </Paper>
    );
}
