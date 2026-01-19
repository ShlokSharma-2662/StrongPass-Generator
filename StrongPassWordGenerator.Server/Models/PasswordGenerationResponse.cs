namespace StrongPassWordGenerator.Server.Models;

/// <summary>
/// Response model for password generation containing the password and strength metrics
/// </summary>
public class PasswordGenerationResponse
{
    /// <summary>
    /// The generated password
    /// </summary>
    public string Password { get; set; } = string.Empty;

    /// <summary>
    /// Password strength score (0-100)
    /// </summary>
    public int Strength { get; set; }

    /// <summary>
    /// Human-readable strength label
    /// </summary>
    public string StrengthLabel { get; set; } = string.Empty;

    /// <summary>
    /// Estimated time to crack the password
    /// </summary>
    public string EstimatedCrackTime { get; set; } = string.Empty;

    /// <summary>
    /// Entropy of the password in bits
    /// </summary>
    public double Entropy { get; set; }
}
