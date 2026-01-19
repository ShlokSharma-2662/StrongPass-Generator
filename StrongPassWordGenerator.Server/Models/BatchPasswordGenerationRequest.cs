using System.ComponentModel.DataAnnotations;

namespace StrongPassWordGenerator.Server.Models;

public class BatchPasswordGenerationRequest
{
    [Range(1, 50, ErrorMessage = "Count must be between 1 and 50")]
    public int Count { get; set; } = 1;

    [Required]
    public PasswordGenerationRequest Options { get; set; } = new();
}
