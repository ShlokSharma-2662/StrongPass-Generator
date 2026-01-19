using System.ComponentModel.DataAnnotations;

namespace StrongPassWordGenerator.Server.Models;

public class AnalyzePasswordRequest
{
    [Required]
    public string Password { get; set; } = string.Empty;
}
