import { useState } from 'react';
import {
    Box,
    Button,
    Container,
    Alert,
    CircularProgress,
    Paper,
    Tabs,
    Tab,
    Slider,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
} from '@mui/material';
import { RefreshRounded, VpnKey, TextFields, Speed, ExpandMore } from '@mui/icons-material';
import type { PasswordOptions, PasswordResponse, PassphraseOptions } from '../types';
import { generatePassword, generateBatch, generatePassphrase } from '../services/api';
import PasswordDisplay from './PasswordDisplay';
import OptionsPanel from './OptionsPanel';
import StrengthMeter from './StrengthMeter';
import HistoryPanel from './HistoryPanel';
import PassphrasePanel from './PassphrasePanel';
import StrengthTester from './StrengthTester';
import BatchResultDisplay from './BatchResultDisplay';

/**
 * Main password generator component
 */
export default function PasswordGenerator() {
    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<PasswordResponse[]>([]);

    // Password Generator State
    const [options, setOptions] = useState<PasswordOptions>({
        length: 16,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true,
        excludeSimilar: false,
        excludeAmbiguous: false,
    });
    const [count, setCount] = useState(1);
    const [result, setResult] = useState<PasswordResponse | PasswordResponse[] | null>(null);

    // Passphrase Generator State
    const [passphraseOptions, setPassphraseOptions] = useState<PassphraseOptions>({
        wordCount: 4,
        separator: '-',
        capitalize: true,
        includeNumber: true,
    });

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
        setError(null);
        setResult(null);
    };

    const addToHistory = (newResults: PasswordResponse | PasswordResponse[]) => {
        const items = Array.isArray(newResults) ? newResults : [newResults];
        setHistory(prev => [...items, ...prev].slice(0, 20));
    };

    const handleGeneratePassword = async () => {
        setLoading(true);
        setError(null);

        try {
            let response;
            if (count > 1) {
                response = await generateBatch({ count, options });
            } else {
                response = await generatePassword(options);
            }
            setResult(response);
            addToHistory(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    const handleGeneratePassphrase = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await generatePassphrase(passphraseOptions);
            setResult(response);
            addToHistory(response);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Tabs
                    value={tab}
                    onChange={handleTabChange}
                    centered
                    variant="fullWidth"
                    sx={{
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        '& .MuiTab-root': { py: 2 }
                    }}
                >
                    <Tab icon={<VpnKey />} label="Password" />
                    <Tab icon={<TextFields />} label="Passphrase" />
                    <Tab icon={<Speed />} label="Strength Test" />
                </Tabs>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Error Alert */}
                {error && (
                    <Alert severity="error" onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {/* Tab 0: Password Generator */}
                {tab === 0 && (
                    <>
                        {/* Result Display */}
                        {result && (
                            Array.isArray(result) ? (
                                <BatchResultDisplay results={result} />
                            ) : (
                                <>
                                    <PasswordDisplay password={result.password} />
                                    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                                        <StrengthMeter
                                            strength={result.strength}
                                            strengthLabel={result.strengthLabel}
                                            estimatedCrackTime={result.estimatedCrackTime}
                                            entropy={result.entropy}
                                        />
                                    </Paper>
                                </>
                            )
                        )}

                        <OptionsPanel options={options} onOptionsChange={setOptions} />

                        <Accordion sx={{ mt: 2, mb: 2, borderRadius: 1, '&:before': { display: 'none' } }} elevation={2}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography fontWeight="medium">Advanced Options</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <TextField
                                        label="Custom Character Set"
                                        value={options.customCharacterSet || ''}
                                        onChange={(e) => setOptions({ ...options, customCharacterSet: e.target.value })}
                                        helperText="Enter specific characters to use (overrides standard options)"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                    />
                                    <TextField
                                        label="Pattern"
                                        value={options.pattern || ''}
                                        onChange={(e) => setOptions({ ...options, pattern: e.target.value })}
                                        helperText="Template: A (Upper), a (Lower), d (Digit), s (Symbol), ? (Any)"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                    />
                                </Box>
                            </AccordionDetails>
                        </Accordion>

                        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Quantity: {count}
                            </Typography>
                            <Slider
                                value={count}
                                onChange={(_, v) => setCount(v as number)}
                                min={1}
                                max={50}
                                valueLabelDisplay="auto"
                                marks={[
                                    { value: 1, label: '1' },
                                    { value: 10, label: '10' },
                                    { value: 50, label: '50' },
                                ]}
                            />
                        </Paper>

                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleGeneratePassword}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : <RefreshRounded />}
                            sx={{
                                py: 1.5,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                                },
                            }}
                        >
                            {loading ? 'Generating...' : count > 1 ? `Generate ${count} Passwords` : 'Generate Password'}
                        </Button>
                    </>
                )}

                {/* Tab 1: Passphrase Generator */}
                {tab === 1 && (
                    <>
                        {result && !Array.isArray(result) && (
                            <>
                                <PasswordDisplay password={result.password} />
                                <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                                    <StrengthMeter
                                        strength={result.strength}
                                        strengthLabel={result.strengthLabel}
                                        estimatedCrackTime={result.estimatedCrackTime}
                                        entropy={result.entropy}
                                    />
                                </Paper>
                            </>
                        )}

                        <PassphrasePanel options={passphraseOptions} onOptionsChange={setPassphraseOptions} />

                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleGeneratePassphrase}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : <RefreshRounded />}
                            sx={{
                                py: 1.5,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)',
                                boxShadow: '0 4px 15px rgba(0, 176, 155, 0.4)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #96c93d 0%, #00b09b 100%)',
                                    boxShadow: '0 6px 20px rgba(0, 176, 155, 0.6)',
                                },
                            }}
                        >
                            {loading ? 'Generating...' : 'Generate Passphrase'}
                        </Button>
                    </>
                )}

                {/* Tab 2: Strength Tester */}
                {tab === 2 && (
                    <StrengthTester />
                )}

                {/* History Panel (Always visible except in Strength Test) */}
                {tab !== 2 && (
                    <HistoryPanel history={history} onClear={() => setHistory([])} />
                )}
            </Box>
        </Container>
    );
}
