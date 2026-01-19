using StrongPassWordGenerator.Server.Middleware;
using StrongPassWordGenerator.Server.Services;

using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add service defaults & Aspire client integrations.
builder.AddServiceDefaults();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddProblemDetails();

// Register password generator service
builder.Services.AddScoped<IPasswordGeneratorService, PasswordGeneratorService>();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",
                "http://localhost:5173",
                "http://localhost:4173"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseGlobalExceptionHandler();

// Enable OpenAPI and Scalar UI for all environments
app.MapOpenApi();
app.MapScalarApiReference();

app.UseCors("AllowFrontend");

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();
app.MapDefaultEndpoints();

app.MapFallbackToFile("index.html");

app.UseFileServer();

app.Run();

