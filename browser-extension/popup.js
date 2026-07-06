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
        chrome.tabs.create({ url: 'https://strongpass-generator.onrender.com/' });
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

    // Unbiased random integer in [0, max) via rejection sampling
    function secureRandomInt(max) {
        const limit = Math.floor(0x100000000 / max) * max;
        const array = new Uint32Array(1);
        do {
            crypto.getRandomValues(array);
        } while (array[0] >= limit);
        return array[0] % max;
    }

    function generatePassword() {
        const pools = [];
        if (options.upper) pools.push(CHARS.upper);
        if (options.lower) pools.push(CHARS.lower);
        if (options.number) pools.push(CHARS.number);
        if (options.symbol) pools.push(CHARS.symbol);

        if (pools.length === 0) return;

        const charSet = pools.join('');
        const password = [];

        // Guarantee at least one character from each selected class
        for (const pool of pools) {
            if (password.length >= options.length) break;
            password.push(pool[secureRandomInt(pool.length)]);
        }
        while (password.length < options.length) {
            password.push(charSet[secureRandomInt(charSet.length)]);
        }

        // Fisher-Yates shuffle so guaranteed characters aren't at predictable positions
        for (let i = password.length - 1; i > 0; i--) {
            const j = secureRandomInt(i + 1);
            [password[i], password[j]] = [password[j], password[i]];
        }

        passwordDisplay.textContent = password.join('');
    }
});
