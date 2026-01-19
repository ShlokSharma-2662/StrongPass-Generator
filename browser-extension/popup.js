document.addEventListener('DOMContentLoaded', () => {
    const lengthSlider = document.getElementById('lengthSlider');
    const lengthValue = document.getElementById('lengthValue');
    const uppercaseCb = document.getElementById('uppercase');
    const lowercaseCb = document.getElementById('lowercase');
    const numbersCb = document.getElementById('numbers');
    const symbolsCb = document.getElementById('symbols');
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const passwordDisplay = document.getElementById('passwordDisplay');
    const openAppBtn = document.getElementById('openAppBtn');

    // Constants
    const CHARS = {
        upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lower: 'abcdefghijklmnopqrstuvwxyz',
        number: '0123456789',
        symbol: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    // State
    let options = {
        length: 16,
        upper: true,
        lower: true,
        number: true,
        symbol: true
    };

    // Initialize
    updateLengthDisplay();
    generatePassword();

    // Event Listeners
    lengthSlider.addEventListener('input', (e) => {
        options.length = parseInt(e.target.value);
        updateLengthDisplay();
        generatePassword();
    });

    [uppercaseCb, lowercaseCb, numbersCb, symbolsCb].forEach(cb => {
        cb.addEventListener('change', () => {
            updateOptions();
            // Ensure at least one is selected
            if (!options.upper && !options.lower && !options.number && !options.symbol) {
                cb.checked = true;
                updateOptions();
            }
            generatePassword();
        });
    });

    generateBtn.addEventListener('click', generatePassword);

    copyBtn.addEventListener('click', () => {
        const password = passwordDisplay.textContent;
        navigator.clipboard.writeText(password).then(() => {
            const originalIcon = copyBtn.innerHTML;
            copyBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4caf50" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
            setTimeout(() => {
                copyBtn.innerHTML = originalIcon;
            }, 1500);
        });
    });

    openAppBtn.addEventListener('click', (e) => {
        e.preventDefault();
        chrome.tabs.create({ url: 'http://localhost:3000' });
    });

    // Functions
    function updateLengthDisplay() {
        lengthValue.textContent = options.length;
    }

    function updateOptions() {
        options.upper = uppercaseCb.checked;
        options.lower = lowercaseCb.checked;
        options.number = numbersCb.checked;
        options.symbol = symbolsCb.checked;
    }

    function generatePassword() {
        let charSet = '';
        if (options.upper) charSet += CHARS.upper;
        if (options.lower) charSet += CHARS.lower;
        if (options.number) charSet += CHARS.number;
        if (options.symbol) charSet += CHARS.symbol;

        if (charSet === '') return;

        let password = '';
        const array = new Uint32Array(options.length);
        crypto.getRandomValues(array);

        for (let i = 0; i < options.length; i++) {
            password += charSet[array[i] % charSet.length];
        }

        passwordDisplay.textContent = password;
    }
});
