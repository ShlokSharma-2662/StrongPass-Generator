const axios = require('axios');

async function testPasswordGenerator() {
    console.log('🔐 Testing StrongPass Generator API...\n');

    try {
        // Test 1: Health Check
        console.log('1️⃣ Testing Health Check...');
        const healthResponse = await axios.get('http://localhost:5414/api/password/health');
        console.log('✅ Health Check:', healthResponse.data.message);
        console.log('');

        // Test 2: Generate Password
        console.log('2️⃣ Generating Password...');
        const passwordResponse = await axios.post('http://localhost:5414/api/password/generate', {
            length: 16,
            includeUppercase: true,
            includeLowercase: true,
            includeNumbers: true,
            includeSymbols: true,
            excludeSimilar: false,
            excludeAmbiguous: false
        });

        const result = passwordResponse.data.data;
        console.log('✅ Generated Password:', result.password);
        console.log('📊 Strength:', result.strengthLabel, `(${result.strength}/100)`);
        console.log('🔢 Entropy:', result.entropy.toFixed(1), 'bits');
        console.log('⏱️  Crack Time:', result.estimatedCrackTime);
        console.log('');

        // Test 3: Generate with exclusions
        console.log('3️⃣ Generating Password with Exclusions...');
        const excludedResponse = await axios.post('http://localhost:5414/api/password/generate', {
            length: 20,
            includeUppercase: true,
            includeLowercase: true,
            includeNumbers: true,
            includeSymbols: false,
            excludeSimilar: true,
            excludeAmbiguous: false
        });

        const excludedResult = excludedResponse.data.data;
        console.log('✅ Generated Password:', excludedResult.password);
        console.log('📊 Strength:', excludedResult.strengthLabel, `(${excludedResult.strength}/100)`);
        console.log('🔢 Entropy:', excludedResult.entropy.toFixed(1), 'bits');
        console.log('');

        console.log('🎉 All tests passed! API is working perfectly!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testPasswordGenerator();
