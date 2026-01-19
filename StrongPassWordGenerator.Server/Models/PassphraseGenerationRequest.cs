using System.ComponentModel.DataAnnotations;

namespace StrongPassWordGenerator.Server.Models;

public class PassphraseGenerationRequest
{
    [Range(3, 20, ErrorMessage = "Word count must be between 3 and 20")]
    public int WordCount { get; set; } = 4;

    public string Separator { get; set; } = "-";

    public bool Capitalize { get; set; } = false;

    public bool IncludeNumber { get; set; } = false;
}
