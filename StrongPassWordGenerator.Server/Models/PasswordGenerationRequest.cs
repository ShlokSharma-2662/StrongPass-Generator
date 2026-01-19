using System.ComponentModel.DataAnnotations;

namespace StrongPassWordGenerator.Server.Models;

/// <summary>
/// Request model for password generation with customizable options
/// </summary>
public class PasswordGenerationRequest
{
    /// <summary>
    /// Length of the password to generate (4-128 characters)
    /// </summary>
    [Range(4, 128, ErrorMessage = "Password length must be between 4 and 128 characters")]
    public int Length { get; set; } = 16;

    /// <summary>
    /// Include uppercase letters (A-Z)
    /// </summary>
    public bool IncludeUppercase { get; set; } = true;

    /// <summary>
    /// Include lowercase letters (a-z)
    /// </summary>
    public bool IncludeLowercase { get; set; } = true;

    /// <summary>
    /// Include numbers (0-9)
    /// </summary>
    public bool IncludeNumbers { get; set; } = true;

    /// <summary>
    /// Include special symbols (!@#$%^&*()_+-=[]{}|;:,.<>?)
    /// </summary>
    public bool IncludeSymbols { get; set; } = true;

    /// <summary>
    /// Exclude similar characters (l, 1, I, O, 0)
    /// </summary>
    public bool ExcludeSimilar { get; set; } = false;

    /// <summary>
    /// Exclude ambiguous characters ({, }, [, ], (, ), /, \, ', ", ~, ,, ., <, >)
    /// </summary>
    public bool ExcludeAmbiguous { get; set; } = false;

    /// <summary>
    /// Custom character set to use for generation
    /// </summary>
    public string? CustomCharacterSet { get; set; }

    /// <summary>
    /// Pattern to use for generation (e.g. A-d-d-d)
    /// </summary>
    public string? Pattern { get; set; }

    /// <summary>
    /// Validates that at least one character type is selected
    /// </summary>
    public bool IsValid()
    {
        if (!string.IsNullOrEmpty(Pattern) || !string.IsNullOrEmpty(CustomCharacterSet))
        {
            return true;
        }
        return IncludeUppercase || IncludeLowercase || IncludeNumbers || IncludeSymbols;
    }
}
