# Build stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY StrongPassWordGenerator.Server/StrongPassWordGenerator.Server.csproj StrongPassWordGenerator.Server/
RUN dotnet restore StrongPassWordGenerator.Server/StrongPassWordGenerator.Server.csproj

# Copy everything else and build
COPY StrongPassWordGenerator.Server/. StrongPassWordGenerator.Server/
WORKDIR /src/StrongPassWordGenerator.Server
RUN dotnet build -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Copy published app
COPY --from=publish /app/publish .

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "StrongPassWordGenerator.Server.dll"]
