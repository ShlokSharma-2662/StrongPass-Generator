# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
# Set API URL to relative path for production
ENV VITE_API_URL=""
RUN npm run build

# Stage 2: Build Backend
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-build
WORKDIR /src
COPY StrongPassWordGenerator.Server/StrongPassWordGenerator.Server.csproj StrongPassWordGenerator.Server/
RUN dotnet restore StrongPassWordGenerator.Server/StrongPassWordGenerator.Server.csproj
COPY StrongPassWordGenerator.Server/. StrongPassWordGenerator.Server/
WORKDIR /src/StrongPassWordGenerator.Server
RUN dotnet build -c Release -o /app/build

# Stage 3: Publish
FROM backend-build AS publish
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Stage 4: Final
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 8080
COPY --from=publish /app/publish .
COPY --from=frontend-build /app/dist ./wwwroot
ENTRYPOINT ["dotnet", "StrongPassWordGenerator.Server.dll"]
