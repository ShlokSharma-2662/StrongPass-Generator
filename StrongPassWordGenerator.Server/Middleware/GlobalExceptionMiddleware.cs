using System.Net;
using System.Text.Json;
using StrongPassWordGenerator.Server.Models;

namespace StrongPassWordGenerator.Server.Middleware;

/// <summary>
/// Global exception handling middleware
/// </summary>
public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(
        RequestDelegate next,
        ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var response = exception switch
        {
            ArgumentException argEx => new
            {
                statusCode = (int)HttpStatusCode.BadRequest,
                response = ApiResponse<object>.ErrorResponse(argEx.Message, "Bad Request")
            },
            UnauthorizedAccessException => new
            {
                statusCode = (int)HttpStatusCode.Unauthorized,
                response = ApiResponse<object>.ErrorResponse("Unauthorized access", "Unauthorized")
            },
            _ => new
            {
                statusCode = (int)HttpStatusCode.InternalServerError,
                response = ApiResponse<object>.ErrorResponse(
                    "An internal server error occurred",
                    "Internal Server Error"
                )
            }
        };

        context.Response.StatusCode = response.statusCode;

        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        await context.Response.WriteAsync(
            JsonSerializer.Serialize(response.response, options)
        );
    }
}

/// <summary>
/// Extension method for adding GlobalExceptionMiddleware
/// </summary>
public static class GlobalExceptionMiddlewareExtensions
{
    public static IApplicationBuilder UseGlobalExceptionHandler(this IApplicationBuilder app)
    {
        return app.UseMiddleware<GlobalExceptionMiddleware>();
    }
}
