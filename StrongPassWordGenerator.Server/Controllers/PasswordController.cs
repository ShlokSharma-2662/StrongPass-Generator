using Microsoft.AspNetCore.Mvc;
using StrongPassWordGenerator.Server.Models;
using StrongPassWordGenerator.Server.Services;

namespace StrongPassWordGenerator.Server.Controllers;

/// <summary>
/// API controller for password generation
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PasswordController : ControllerBase
{
    private readonly IPasswordGeneratorService _passwordService;
    private readonly ILogger<PasswordController> _logger;

    public PasswordController(
        IPasswordGeneratorService passwordService,
        ILogger<PasswordController> logger)
    {
        _passwordService = passwordService;
        _logger = logger;
    }

    /// <summary>
    /// Generates a password based on provided options
    /// </summary>
    /// <param name="request">Password generation options</param>
    /// <returns>Generated password with strength metrics</returns>
    [HttpPost("generate")]
    [ProducesResponseType(typeof(ApiResponse<PasswordGenerationResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<PasswordGenerationResponse>), StatusCodes.Status400BadRequest)]
    public IActionResult GeneratePassword([FromBody] PasswordGenerationRequest request)
    {
        _logger.LogInformation("Password generation requested with length: {Length}", request.Length);

        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();

            return BadRequest(ApiResponse<PasswordGenerationResponse>.ErrorResponse(
                errors,
                "Validation failed"
            ));
        }

        if (!request.IsValid())
        {
            return BadRequest(ApiResponse<PasswordGenerationResponse>.ErrorResponse(
                "At least one character type must be selected",
                "Invalid request"
            ));
        }

        try
        {
            var result = _passwordService.GeneratePassword(request);
            
            _logger.LogInformation(
                "Password generated successfully. Length: {Length}, Strength: {Strength}",
                request.Length,
                result.Strength
            );

            return Ok(ApiResponse<PasswordGenerationResponse>.SuccessResponse(
                result,
                "Password generated successfully"
            ));
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid password generation request");
            return BadRequest(ApiResponse<PasswordGenerationResponse>.ErrorResponse(
                ex.Message,
                "Invalid request"
            ));
        }
    }

    /// <summary>
    /// Generates a list of secure passwords based on the provided options
    /// </summary>
    [HttpPost("batch")]
    [ProducesResponseType(typeof(ApiResponse<List<PasswordGenerationResponse>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public IActionResult GenerateBatch([FromBody] BatchPasswordGenerationRequest request)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            
            return BadRequest(ApiResponse<object>.ErrorResponse(errors, "Validation failed"));
        }

        try
        {
            var result = _passwordService.GenerateBatch(request);
            return Ok(ApiResponse<List<PasswordGenerationResponse>>.SuccessResponse(result, "Passwords generated successfully"));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Generates a secure passphrase
    /// </summary>
    [HttpPost("passphrase")]
    [ProducesResponseType(typeof(ApiResponse<PasswordGenerationResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public IActionResult GeneratePassphrase([FromBody] PassphraseGenerationRequest request)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .ToList();
            
            return BadRequest(ApiResponse<object>.ErrorResponse(errors, "Validation failed"));
        }

        try
        {
            var result = _passwordService.GeneratePassphrase(request);
            return Ok(ApiResponse<PasswordGenerationResponse>.SuccessResponse(result, "Passphrase generated successfully"));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Analyzes the strength of a password
    /// </summary>
    [HttpPost("analyze")]
    [ProducesResponseType(typeof(ApiResponse<PasswordGenerationResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public IActionResult Analyze([FromBody] AnalyzePasswordRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse("Validation failed"));
        }

        var result = _passwordService.AnalyzeStrength(request.Password);
        return Ok(ApiResponse<PasswordGenerationResponse>.SuccessResponse(result, "Password analyzed successfully"));
    }

    /// <summary>
    /// Checks the health of the password generator service
    /// </summary>
    [HttpGet("health")]
    [ProducesResponseType(typeof(ApiResponse<string>), StatusCodes.Status200OK)]
    public IActionResult HealthCheck()
    {
        return Ok(ApiResponse<string>.SuccessResponse("healthy", "Password generator service is running"));
    }
}
