namespace StrongPassWordGenerator.Server.Models;

/// <summary>
/// Standardized API response wrapper
/// </summary>
/// <typeparam name="T">Type of data being returned</typeparam>
public class ApiResponse<T>
{
    /// <summary>
    /// Indicates if the request was successful
    /// </summary>
    public bool Success { get; set; }

    /// <summary>
    /// The response data
    /// </summary>
    public T? Data { get; set; }

    /// <summary>
    /// Success or informational message
    /// </summary>
    public string? Message { get; set; }

    /// <summary>
    /// List of error messages (if any)
    /// </summary>
    public List<string>? Errors { get; set; }

    /// <summary>
    /// Creates a successful response
    /// </summary>
    public static ApiResponse<T> SuccessResponse(T data, string? message = null)
    {
        return new ApiResponse<T>
        {
            Success = true,
            Data = data,
            Message = message
        };
    }

    /// <summary>
    /// Creates an error response
    /// </summary>
    public static ApiResponse<T> ErrorResponse(List<string> errors, string? message = null)
    {
        return new ApiResponse<T>
        {
            Success = false,
            Errors = errors,
            Message = message
        };
    }

    /// <summary>
    /// Creates an error response with a single error
    /// </summary>
    public static ApiResponse<T> ErrorResponse(string error, string? message = null)
    {
        return ErrorResponse(new List<string> { error }, message);
    }
}
