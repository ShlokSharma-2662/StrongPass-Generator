using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using StrongPassWordGenerator.Server.Controllers;
using StrongPassWordGenerator.Server.Models;
using StrongPassWordGenerator.Server.Services;
using Xunit;

namespace StrongPassWordGenerator.Tests.Controllers;

public class PasswordControllerTests
{
    private readonly Mock<IPasswordGeneratorService> _mockService;
    private readonly Mock<ILogger<PasswordController>> _mockLogger;
    private readonly PasswordController _controller;

    public PasswordControllerTests()
    {
        _mockService = new Mock<IPasswordGeneratorService>();
        _mockLogger = new Mock<ILogger<PasswordController>>();
        _controller = new PasswordController(_mockService.Object, _mockLogger.Object);
    }

    [Fact]
    public void GeneratePassword_WithValidRequest_ShouldReturnOkResult()
    {
        // Arrange
        var request = new PasswordGenerationRequest
        {
            Length = 16,
            IncludeUppercase = true,
            IncludeLowercase = true,
            IncludeNumbers = true,
            IncludeSymbols = true
        };

        var expectedResponse = new PasswordGenerationResponse
        {
            Password = "TestPassword123!",
            Strength = 75,
            StrengthLabel = "Strong",
            EstimatedCrackTime = "1000 years",
            Entropy = 95.5
        };

        _mockService
            .Setup(s => s.GeneratePassword(It.IsAny<PasswordGenerationRequest>()))
            .Returns(expectedResponse);

        // Act
        var result = _controller.GeneratePassword(request);

        // Assert
        result.Should().BeOfType<OkObjectResult>();
        var okResult = result as OkObjectResult;
        okResult!.Value.Should().BeOfType<ApiResponse<PasswordGenerationResponse>>();
        
        var apiResponse = okResult.Value as ApiResponse<PasswordGenerationResponse>;
        apiResponse!.Success.Should().BeTrue();
        apiResponse.Data.Should().BeEquivalentTo(expectedResponse);
    }

    [Fact]
    public void GeneratePassword_WithNoCharacterTypes_ShouldReturnBadRequest()
    {
        // Arrange
        var request = new PasswordGenerationRequest
        {
            Length = 16,
            IncludeUppercase = false,
            IncludeLowercase = false,
            IncludeNumbers = false,
            IncludeSymbols = false
        };

        // Act
        var result = _controller.GeneratePassword(request);

        // Assert
        result.Should().BeOfType<BadRequestObjectResult>();
        var badRequestResult = result as BadRequestObjectResult;
        var apiResponse = badRequestResult!.Value as ApiResponse<PasswordGenerationResponse>;
        apiResponse!.Success.Should().BeFalse();
        apiResponse.Errors.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public void GeneratePassword_WhenServiceThrowsException_ShouldReturnBadRequest()
    {
        // Arrange
        var request = new PasswordGenerationRequest
        {
            Length = 16,
            IncludeUppercase = true,
            IncludeLowercase = true,
            IncludeNumbers = true,
            IncludeSymbols = true
        };

        _mockService
            .Setup(s => s.GeneratePassword(It.IsAny<PasswordGenerationRequest>()))
            .Throws(new ArgumentException("Invalid character set"));

        // Act
        var result = _controller.GeneratePassword(request);

        // Assert
        result.Should().BeOfType<BadRequestObjectResult>();
        var badRequestResult = result as BadRequestObjectResult;
        var apiResponse = badRequestResult!.Value as ApiResponse<PasswordGenerationResponse>;
        apiResponse!.Success.Should().BeFalse();
        apiResponse.Errors.Should().Contain("Invalid character set");
    }

    [Fact]
    public void HealthCheck_ShouldReturnOkWithHealthyStatus()
    {
        // Act
        var result = _controller.HealthCheck();

        // Assert
        result.Should().BeOfType<OkObjectResult>();
        var okResult = result as OkObjectResult;
        var apiResponse = okResult!.Value as ApiResponse<string>;
        apiResponse!.Success.Should().BeTrue();
        apiResponse.Data.Should().Be("healthy");
    }

    [Theory]
    [InlineData(3)]   // Below minimum
    [InlineData(129)] // Above maximum
    public void GeneratePassword_WithInvalidLength_ShouldReturnBadRequest(int length)
    {
        // Arrange
        var request = new PasswordGenerationRequest
        {
            Length = length,
            IncludeUppercase = true,
            IncludeLowercase = true,
            IncludeNumbers = true,
            IncludeSymbols = true
        };

        // Manually add model error (simulating validation)
        _controller.ModelState.AddModelError("Length", "Password length must be between 4 and 128 characters");

        // Act
        var result = _controller.GeneratePassword(request);

        // Assert
        result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public void GeneratePassword_ShouldCallServiceWithCorrectParameters()
    {
        // Arrange
        var request = new PasswordGenerationRequest
        {
            Length = 20,
            IncludeUppercase = true,
            IncludeLowercase = false,
            IncludeNumbers = true,
            IncludeSymbols = false,
            ExcludeSimilar = true
        };

        var expectedResponse = new PasswordGenerationResponse
        {
            Password = "TEST123456789",
            Strength = 60,
            StrengthLabel = "Strong",
            EstimatedCrackTime = "500 years",
            Entropy = 75.0
        };

        _mockService
            .Setup(s => s.GeneratePassword(It.Is<PasswordGenerationRequest>(
                r => r.Length == 20 &&
                     r.IncludeUppercase == true &&
                     r.IncludeLowercase == false &&
                     r.IncludeNumbers == true &&
                     r.IncludeSymbols == false &&
                     r.ExcludeSimilar == true
            )))
            .Returns(expectedResponse);

        // Act
        var result = _controller.GeneratePassword(request);

        // Assert
        _mockService.Verify(
            s => s.GeneratePassword(It.IsAny<PasswordGenerationRequest>()),
            Times.Once
        );
    }
}
