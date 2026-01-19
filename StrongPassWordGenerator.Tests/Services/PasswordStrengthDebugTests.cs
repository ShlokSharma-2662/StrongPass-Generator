using FluentAssertions;
using StrongPassWordGenerator.Server.Models;
using StrongPassWordGenerator.Server.Services;
using Xunit;
using Xunit.Abstractions;

namespace StrongPassWordGenerator.Tests.Services;

public class PasswordStrengthDebugTests
{
    private readonly PasswordGeneratorService _service;
    private readonly ITestOutputHelper _output;

    public PasswordStrengthDebugTests(ITestOutputHelper output)
    {
        _service = new PasswordGeneratorService();
        _output = output;
    }

    [Fact]
    public void Debug_StrengthCalculation()
    {
        var testCases = new[]
        {
            (length: 16, charSetSize: 26),
            (length: 16, charSetSize: 62),
            (length: 20, charSetSize: 62),
            (length: 32, charSetSize: 95),
        };

        foreach (var (length, charSetSize) in testCases)
        {
            var password = new string('a', length);
            var strength = _service.CalculateStrength(password, charSetSize);
            _output.WriteLine($"Length: {length}, CharSet: {charSetSize} => Strength: {strength}");
        }
    }
}
