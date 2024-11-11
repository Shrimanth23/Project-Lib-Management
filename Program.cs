using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Project_Lib_Management.Data;
using System.IO;

namespace Project_Lib_Management
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();

            // Enable CORS
            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            // Register LibraryContext with dependency injection
            builder.Services.AddDbContext<LibraryContext>(options =>
                options.UseOracle(builder.Configuration.GetConnectionString("OracleDbConnection")));

            // Swagger configuration
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Use CORS
            app.UseCors();

            // Configure middleware to serve default files (index.html) and static files
            app.UseDefaultFiles(new DefaultFilesOptions
            {
                DefaultFileNames = new List<string> { "index.html" }
            });

            // Use a relative path for the static files
            var staticFilesPath = Path.Combine(Directory.GetCurrentDirectory(), "LibraryWebApp");
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(staticFilesPath),
                RequestPath = ""
            });

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseAuthorization();

            // Map controllers for API endpoints
            app.MapControllers();

            // Run the app
            app.Run();
        }
    }
}
