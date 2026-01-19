using StrongPassWordGenerator.Server.Models;

namespace StrongPassWordGenerator.Server.Services;

/// <summary>
/// Interface for password generation service
/// </summary>
public interface IPasswordGeneratorService
{
    /// <summary>
    /// Generates a password based on the provided options
    /// </summary>
    /// <param name="request">Password generation options</param>
    /// <returns>Generated password with strength metrics</returns>
    PasswordGenerationResponse GeneratePassword(PasswordGenerationRequest request);

    /// <summary>
    /// Calculates the strength of a given password
    /// </summary>
    /// <param name="password">The password to analyze</param>
    /// <param name="charSetSize">Size of the character set used</param>
    /// <returns>Strength score (0-100)</returns>
    int CalculateStrength(string password, int charSetSize);
    /// <summary>
    /// Analyzes the strength of a given password.
    /// </summary>
    /// <param name="password">The password to analyze.</param>
    /// <returns>A response containing strength metrics.</returns>
    PasswordGenerationResponse AnalyzeStrength(string password);

    /// <summary>
    /// Generates a list of passwords based on the specified options.
    /// </summary>
    /// <param name="request">The batch generation request.</param>
    /// <returns>A list of generated passwords with metrics.</returns>
    List<PasswordGenerationResponse> GenerateBatch(BatchPasswordGenerationRequest request);

    /// <summary>
    /// Generates a passphrase based on the specified options.
    /// </summary>
    /// <param name="request">The passphrase generation request.</param>
    /// <returns>A generated passphrase with metrics.</returns>
    PasswordGenerationResponse GeneratePassphrase(PassphraseGenerationRequest request);
}
