using FluentAssertions;
using StrongPassWordGenerator.Server.Models;
using StrongPassWordGenerator.Server.Services;
using Xunit;

namespace StrongPassWordGenerator.Tests.Services;

public class PasswordGeneratorServiceTests
{
    private readonly PasswordGeneratorService _service;

    public PasswordGeneratorServiceTests()
    {
        _service = new PasswordGeneratorService();
    }

    [Fact]
    public void GeneratePassword_WithDefaultOptions_ShouldReturnValidPassword()
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

        // Act
        var result = _service.GeneratePassword(request);

        // Assert
        result.Should().NotBeNull();
        result.Password.Should().NotBeNullOrEmpty();
        result.Password.Length.Should().Be(16);
        result.Strength.Should().BeInRange(0, 100);
        result.StrengthLabel.Should().NotBeNullOrEmpty();
        result.EstimatedCrackTime.Should().NotBeNullOrEmpty();
        result.Entropy.Should().BeGreaterThan(0);
    }

    [Theory]
    [InlineData(4)]
    [InlineData(8)]
    [InlineData(16)]
    [InlineData(32)]
    [InlineData(64)]
    [InlineData(128)]
    public void GeneratePassword_WithDifferentLengths_ShouldReturnCorrectLength(int length)
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

        // Act
        var result = _service.GeneratePassword(request);

        // Assert
        result.Password.Length.Should().Be(length);
    }

    [Fact]
    public void GeneratePassword_WithOnlyUppercase_ShouldContainOnlyUppercase()
    {
        // Arrange
        var request = new PasswordGenerationRequest
        {
            Length = 20,
            IncludeUppercase = true,
            IncludeLowercase = false,
            IncludeNumbers = false,
            IncludeSymbols = false
        };

        // Act
        var result = _service.GeneratePassword(request);

        // Assert
        result.Password.Should().MatchRegex("^[A-Z]+$");
    }

    [Fact]
    public void GeneratePassword_WithOnlyNumbers_ShouldContainOnlyNumbers()
    {
        // Arrange
        var request = new PasswordGenerationRequest
        {
            Length = 20,
            IncludeUppercase = false,
            IncludeLowercase = false,
            IncludeNumbers = true,
            IncludeSymbols = false
        };

        // Act
        var result = _service.GeneratePassword(request);

        // Assert
        result.Password.Should().MatchRegex("^[0-9]+$");
    }

    [Fact]
    public void GeneratePassword_WithNoCharacterTypes_ShouldThrowException()
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

        // Act & Assert
        Assert.Throws<ArgumentException>(() => _service.GeneratePassword(request));
    }

    [Fact]
    public void GeneratePassword_MultipleCalls_ShouldReturnDifferentPasswords()
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

        // Act
        var result1 = _service.GeneratePassword(request);
        var result2 = _service.GeneratePassword(request);
        var result3 = _service.GeneratePassword(request);

        // Assert
        result1.Password.Should().NotBe(result2.Password);
        result2.Password.Should().NotBe(result3.Password);
        result1.Password.Should().NotBe(result3.Password);
    }

    [Fact]
    public void GeneratePassword_WithExcludeSimilar_ShouldNotContainSimilarChars()
    {
        // Arrange
        var request = new PasswordGenerationRequest
        {
            Length = 50,
            IncludeUppercase = true,
            IncludeLowercase = true,
            IncludeNumbers = true,
            IncludeSymbols = false,
            ExcludeSimilar = true
        };

        // Act
        var result = _service.GeneratePassword(request);

        // Assert - should not contain l, I, 1, O, 0
        result.Password.Should().NotContain("l");
        result.Password.Should().NotContain("I");
        result.Password.Should().NotContain("1");
        result.Password.Should().NotContain("O");
        result.Password.Should().NotContain("0");
    }

    // Note: Strength calculation is also tested in other tests like
    // GeneratePassword_StrengthLabel_ShouldBeConsistentWithStrength
    // and GeneratePassword_ShouldCalculateEntropyCorrectly

    [Fact]
    public void GeneratePassword_StrengthLabel_ShouldBeConsistentWithStrength()
    {
        // Arrange & Act
        var weakRequest = new PasswordGenerationRequest
        {
            Length = 4,
            IncludeUppercase = false,
            IncludeLowercase = true,
            IncludeNumbers = false,
            IncludeSymbols = false
        };
        var weakResult = _service.GeneratePassword(weakRequest);

        var strongRequest = new PasswordGenerationRequest
        {
            Length = 32,
            IncludeUppercase = true,
            IncludeLowercase = true,
            IncludeNumbers = true,
            IncludeSymbols = true
        };
        var strongResult = _service.GeneratePassword(strongRequest);

        // Assert
        weakResult.Strength.Should().BeLessThan(strongResult.Strength);
        weakResult.StrengthLabel.Should().BeOneOf("Weak", "Fair");
        strongResult.StrengthLabel.Should().BeOneOf("Strong", "Very Strong");
    }

    [Fact]
    public void GeneratePassword_ShouldCalculateEntropyCorrectly()
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

        // Act
        var result = _service.GeneratePassword(request);

        // Assert
        // With all options, charset size should be 94 (26+26+10+32)
        // Entropy = 16 * log2(94) ≈ 104 bits
        result.Entropy.Should().BeGreaterThan(90);
        result.Entropy.Should().BeLessThan(120);
    }
}
