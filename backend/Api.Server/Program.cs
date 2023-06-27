global using Api.Server.Repos.UserRepo;
global using Api.Server.Utils.Interfaces;
global using Api.Server.Utils.Methods;
using Api.Server.Data;
using Api.Server.Repos.EnterpriseRepo;
using Api.Server.Repos.ProjectRepo;
using Api.Server.Repos.SessionRepo;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Api.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddDbContext<ApplicationDbContext>(options => 
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("dB")
                )
            );

            var key = Encoding.ASCII.GetBytes(builder.Configuration.GetSection("JwtConfig:Secret").Value!);
            var tokenValidationParameter = new TokenValidationParameters()
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
            };


            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(jwt =>
            {
                jwt.SaveToken = true;
                jwt.TokenValidationParameters = tokenValidationParameter;
            });


            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            // Repositories
            builder.Services.AddScoped<IUserRepo, UserRepo>();
            builder.Services.AddScoped<ISessionRepo, SessionRepo>();
            builder.Services.AddScoped<IEnterpriseRepo, EnterrpiseRepo>();
            builder.Services.AddScoped<IProjectRepo, ProjectRepo>();

            // Utils
            builder.Services.AddScoped<IBCryptUtils, BCryptUtils>();
            builder.Services.AddScoped<ISessionUtils, SessionUtils>();
            builder.Services.AddScoped<IRedisUtils, RedisUtils>();

            builder.Services.AddHttpContextAccessor();


            var app = builder.Build();
            
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseCors(options =>
                options
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader()
            );


            app.MapControllers();

            app.Run();
        }
    }
}