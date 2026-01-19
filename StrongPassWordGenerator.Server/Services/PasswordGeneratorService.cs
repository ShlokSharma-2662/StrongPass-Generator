using System.Security.Cryptography;
using System.Text;
using StrongPassWordGenerator.Server.Models;

namespace StrongPassWordGenerator.Server.Services;

/// <summary>
/// Service for generating secure, customizable passwords
/// </summary>
public class PasswordGeneratorService : IPasswordGeneratorService
{
    private const string UppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private const string LowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    private const string NumberChars = "0123456789";
    private const string SymbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    private const string SimilarChars = "lI1O0";
    private const string AmbiguousChars = "{}[]()/'\"~,.<>";
    
    private readonly string[] _wordList;

    public PasswordGeneratorService()
    {
        try
        {
            var path = Path.Combine(AppContext.BaseDirectory, "Resources", "wordlist.txt");
            if (File.Exists(path))
            {
                _wordList = File.ReadAllLines(path);
            }
            else
            {
                // Fallback if file not found
                _wordList = ["correct", "horse", "battery", "staple", "security", "privacy", "strong", "password"];
            }
        }
        catch
        {
             _wordList = ["correct", "horse", "battery", "staple"];
        }
    }

    /// <summary>
    /// Generates a password based on the provided options
    /// </summary>
    public PasswordGenerationResponse GeneratePassword(PasswordGenerationRequest request)
    {
        if (!request.IsValid())
        {
            throw new ArgumentException("At least one character type must be selected");
        }

        string password;
        string charSet;
        double entropy;

        if (!string.IsNullOrEmpty(request.Pattern))
        {
            password = GenerateFromPattern(request.Pattern);
            entropy = CalculatePatternEntropy(request.Pattern);
            charSet = "Pattern"; // Placeholder
        }
        else if (!string.IsNullOrEmpty(request.CustomCharacterSet))
        {
            charSet = request.CustomCharacterSet;
            if (string.IsNullOrEmpty(charSet))
            {
                throw new ArgumentException("Custom character set cannot be empty");
            }
            password = GenerateSecurePassword(charSet, request.Length);
            entropy = CalculateEntropy(request.Length, charSet.Length);
        }
        else
        {
            // Build character set based on options
            charSet = BuildCharacterSet(request);

            if (string.IsNullOrEmpty(charSet))
            {
                throw new ArgumentException("Character set is empty after applying exclusions");
            }

            // Generate password using cryptographically secure random
            password = GenerateSecurePassword(charSet, request.Length);
            entropy = CalculateEntropy(request.Length, charSet.Length);
        }

        // Calculate strength metrics
        // For pattern, we use estimated entropy. For custom/standard, we use calculated entropy.
        // We still calculate strength score based on entropy.
        
        int strength = (int)Math.Min(100, (entropy / 128.0) * 100);
        string strengthLabel = GetStrengthLabel(strength);
        string crackTime = EstimateCrackTime(entropy);

        return new PasswordGenerationResponse
        {
            Password = password,
            Strength = strength,
            StrengthLabel = strengthLabel,
            EstimatedCrackTime = crackTime,
            Entropy = entropy
        };
    }

    /// <summary>
    /// Analyzes the strength of a given password.
    /// </summary>
    public PasswordGenerationResponse AnalyzeStrength(string password)
    {
        // Estimate char set size based on content
        int charSetSize = 0;
        if (password.Any(char.IsUpper)) charSetSize += 26;
        if (password.Any(char.IsLower)) charSetSize += 26;
        if (password.Any(char.IsDigit)) charSetSize += 10;
        if (password.Any(c => !char.IsLetterOrDigit(c))) charSetSize += 32;
        
        if (charSetSize == 0) charSetSize = 26; // Default fallback

        double entropy = CalculateEntropy(password.Length, charSetSize);
        int strength = CalculateStrength(password, charSetSize);
        string strengthLabel = GetStrengthLabel(strength);
        string crackTime = EstimateCrackTime(entropy);

        return new PasswordGenerationResponse
        {
            Password = password,
            Strength = strength,
            StrengthLabel = strengthLabel,
            EstimatedCrackTime = crackTime,
            Entropy = entropy
        };
    }

    /// <summary>
    /// Generates a list of passwords based on the specified options.
    /// </summary>
    public List<PasswordGenerationResponse> GenerateBatch(BatchPasswordGenerationRequest request)
    {
        var results = new List<PasswordGenerationResponse>();
        for (int i = 0; i < request.Count; i++)
        {
            results.Add(GeneratePassword(request.Options));
        }
        return results;
    }

    /// <summary>
    /// Generates a passphrase based on the specified options.
    /// </summary>
    public PasswordGenerationResponse GeneratePassphrase(PassphraseGenerationRequest request)
    {
        if (_wordList == null || _wordList.Length == 0)
        {
             throw new InvalidOperationException("Word list not loaded");
        }

        var words = new List<string>();
        var randomBytes = new byte[4];
        
        using (var rng = RandomNumberGenerator.Create())
        {
            for (int i = 0; i < request.WordCount; i++)
            {
                rng.GetBytes(randomBytes);
                uint randomValue = BitConverter.ToUInt32(randomBytes, 0);
                string word = _wordList[randomValue % _wordList.Length];
                
                if (request.Capitalize)
                {
                    word = char.ToUpper(word[0]) + word.Substring(1);
                }
                
                words.Add(word);
            }
        }

        if (request.IncludeNumber)
        {
            // Add a random number to a random word or at the end
            // Let's append to the end for simplicity
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
                int number = (int)(BitConverter.ToUInt32(randomBytes, 0) % 1000); // 0-999
                words[words.Count - 1] += number.ToString();
            }
        }

        string passphrase = string.Join(request.Separator, words);
        
        // Calculate entropy for passphrase
        // Entropy = num_words * log2(word_list_size)
        double entropy = request.WordCount * Math.Log2(_wordList.Length);
        if (request.IncludeNumber) entropy += Math.Log2(1000); // Add entropy for number
        if (request.Capitalize) entropy += request.WordCount; // 1 bit per capitalized word (roughly)

        // Normalize strength (passphrases are usually strong)
        int strength = (int)Math.Min(100, (entropy / 80.0) * 100); // 80 bits is good for passphrase
        
        return new PasswordGenerationResponse
        {
            Password = passphrase,
            Strength = strength,
            StrengthLabel = GetStrengthLabel(strength),
            EstimatedCrackTime = EstimateCrackTime(entropy),
            Entropy = entropy
        };
    }

    /// <summary>
    /// Calculates the strength of a password
    /// </summary>
    public int CalculateStrength(string password, int charSetSize)
    {
        double entropy = CalculateEntropy(password.Length, charSetSize);
        
        // Normalize entropy to 0-100 scale
        // 128 bits of entropy is considered very strong
        int strength = (int)Math.Min(100, (entropy / 128.0) * 100);
        
        return strength;
    }

    /// <summary>
    /// Builds the character set based on user options
    /// </summary>
    private string BuildCharacterSet(PasswordGenerationRequest request)
    {
        StringBuilder charSet = new StringBuilder();

        if (request.IncludeUppercase)
            charSet.Append(UppercaseChars);

        if (request.IncludeLowercase)
            charSet.Append(LowercaseChars);

        if (request.IncludeNumbers)
            charSet.Append(NumberChars);

        if (request.IncludeSymbols)
            charSet.Append(SymbolChars);

        string result = charSet.ToString();

        // Apply exclusions
        if (request.ExcludeSimilar)
        {
            result = ExcludeCharacters(result, SimilarChars);
        }

        if (request.ExcludeAmbiguous)
        {
            result = ExcludeCharacters(result, AmbiguousChars);
        }

        return result;
    }

    /// <summary>
    /// Excludes specified characters from a string
    /// </summary>
    private string ExcludeCharacters(string source, string charsToExclude)
    {
        return new string(source.Where(c => !charsToExclude.Contains(c)).ToArray());
    }

    /// <summary>
    /// Generates a password using cryptographically secure random
    /// </summary>
    private string GenerateSecurePassword(string charSet, int length)
    {
        char[] password = new char[length];
        byte[] randomBytes = new byte[length * 4]; // 4 bytes per character for better distribution

        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomBytes);
        }

        for (int i = 0; i < length; i++)
        {
            // Use 4 bytes to generate a more uniform distribution
            uint randomValue = BitConverter.ToUInt32(randomBytes, i * 4);
            password[i] = charSet[(int)(randomValue % (uint)charSet.Length)];
        }

        return new string(password);
    }

    /// <summary>
    /// Calculates password entropy in bits
    /// </summary>
    private double CalculateEntropy(int length, int charSetSize)
    {
        // Entropy = log2(charSetSize^length) = length * log2(charSetSize)
        return length * Math.Log2(charSetSize);
    }

    /// <summary>
    /// Gets a human-readable strength label
    /// </summary>
    private string GetStrengthLabel(int strength)
    {
        return strength switch
        {
            < 25 => "Weak",
            < 50 => "Fair",
            < 75 => "Strong",
            _ => "Very Strong"
        };
    }

    /// <summary>
    /// Estimates time to crack password based on entropy
    /// </summary>
    private string EstimateCrackTime(double entropy)
    {
        // Assume 10 billion guesses per second (modern GPU)
        const double guessesPerSecond = 10_000_000_000.0;
        
        // Number of possible combinations
        double combinations = Math.Pow(2, entropy);
        
        // Average time to crack (half the search space)
        double secondsToCrack = (combinations / 2) / guessesPerSecond;

        return FormatTime(secondsToCrack);
    }

    /// <summary>
    /// Formats time duration in human-readable format
    /// </summary>
    private string FormatTime(double seconds)
    {
        if (seconds < 1)
            return "Instant";
        if (seconds < 60)
            return $"{seconds:F0} seconds";
        if (seconds < 3600)
            return $"{seconds / 60:F0} minutes";
        if (seconds < 86400)
            return $"{seconds / 3600:F0} hours";
        if (seconds < 31536000)
            return $"{seconds / 86400:F0} days";
        if (seconds < 31536000000)
            return $"{seconds / 31536000:F0} years";
        
        // For very large numbers, use scientific notation
        double years = seconds / 31536000;
        if (years < 1e12)
            return $"{years / 1e9:F1} billion years";
        if (years < 1e15)
            return $"{years / 1e12:F1} trillion years";
        
        return "Beyond comprehension";
    }
    private string GenerateFromPattern(string pattern)
    {
        var password = new StringBuilder();
        var randomBytes = new byte[4];
        
        using (var rng = RandomNumberGenerator.Create())
        {
            foreach (char c in pattern)
            {
                string? pool = c switch
                {
                    'A' => UppercaseChars,
                    'a' => LowercaseChars,
                    'd' => NumberChars,
                    's' => SymbolChars,
                    '?' => UppercaseChars + LowercaseChars + NumberChars + SymbolChars,
                    _ => null
                };

                if (pool != null)
                {
                    rng.GetBytes(randomBytes);
                    uint randomValue = BitConverter.ToUInt32(randomBytes, 0);
                    password.Append(pool[(int)(randomValue % (uint)pool.Length)]);
                }
                else
                {
                    password.Append(c);
                }
            }
        }
        return password.ToString();
    }

    private double CalculatePatternEntropy(string pattern)
    {
        double entropy = 0;
        foreach (char c in pattern)
        {
            entropy += c switch
            {
                'A' => Math.Log2(26),
                'a' => Math.Log2(26),
                'd' => Math.Log2(10),
                's' => Math.Log2(32), // Approx symbol count
                '?' => Math.Log2(94), // Total printable ascii
                _ => 0
            };
        }
        return entropy;
    }
}
