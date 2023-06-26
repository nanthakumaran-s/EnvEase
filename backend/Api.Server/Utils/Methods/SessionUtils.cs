using Api.Server.Data;
using Api.Server.Dto.Incoming;
using Api.Server.Dto.Internal;
using Api.Server.Models;
using Api.Server.Repos.SessionRepo;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace Api.Server.Utils.Methods
{
    public class SessionUtils: ISessionUtils
    {
        private readonly string _secretKey;
        private readonly ISessionRepo _sessionRepo;
        private readonly ApplicationDbContext _dbContext;

        public SessionUtils(IConfiguration configuration, ISessionRepo sessionRepo, ApplicationDbContext dbContext) 
        {
            _secretKey = configuration.GetSection("JwtConfig:Secret").Value!;
            _sessionRepo = sessionRepo;
            _dbContext = dbContext;
        }

        public TokensDto CreateTokens(UsersModel user, bool isDbWrite, LoginDto? request = null)
        {
            TokensDto tokens = new()
            {
                AccessToken = CreateJwtToken(user, out string jwt_token_id),
                RefreshToken = CreateRefreshToken(),
            };

            if (isDbWrite)
            {
                SessionModel session = new()
                {
                    JwtId = jwt_token_id,
                    Token = tokens.RefreshToken,
                    AddedTime = DateTime.Now,
                    ExpiryTime = DateTime.Now.AddMonths(6),
                    IsRevoked = false,
                    Device = request!.Device,
                    UserId = user.Id,
                };

                _sessionRepo.CreateSession(session);
                _sessionRepo.SaveChanges();
            }

            return tokens;
        }

        public ClaimsPrincipal? VerifyAndGetPrincipal(string token)
        {
            var _tokenValidationParameters = new TokenValidationParameters()
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_secretKey)),
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = false,
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, _tokenValidationParameters, out SecurityToken securityToken);
            if (securityToken is JwtSecurityToken jwtSecurityToken) {
                var result = jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha512, StringComparison.InvariantCultureIgnoreCase);
                if (result == false){
                    return null;
                }
            }
            return principal;
        }

        private string CreateJwtToken(UsersModel user, out string jwt_token_id)
        {
            jwt_token_id = Guid.NewGuid().ToString();
            RoleModel role = _dbContext.Role.Where(x => x.Id == user.RoleId).FirstOrDefault()!;
            List<Claim> claims = new()
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Role, role.Role),
                new Claim(JwtRegisteredClaimNames.Jti, jwt_token_id),
                new Claim(JwtRegisteredClaimNames.Iat, DateTime.Now.ToUniversalTime().ToString())
            };
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);
            var token = new JwtSecurityToken(
                claims: claims,
                signingCredentials: creds,
                expires: DateTime.Now.AddMinutes(30)
            );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        private static string CreateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }
}
