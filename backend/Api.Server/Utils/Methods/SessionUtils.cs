using Api.Server.Dto.Incoming;
using Api.Server.Dto.Internal;
using Api.Server.Models;
using Api.Server.Repos.SessionRepo;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
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

        public SessionUtils(IConfiguration configuration, ISessionRepo sessionRepo) 
        {
            _secretKey = configuration.GetSection("JwtConfig:Secret").Value!;
            _sessionRepo = sessionRepo;
        }

        public TokensDto CreateTokens(UsersModel user, bool isDbWrite, LoginDto? request = null)
        {
            TokensDto tokens = new()
            {
                Access_Token = CreateJwtToken(user, out string jwt_token_id),
                Refresh_Token = CreateRefreshToken(),
            };

            if (isDbWrite)
            {
                SessionModel session = new()
                {
                    Jwt_Id = jwt_token_id,
                    Token = tokens.Refresh_Token,
                    Added_Time = DateTime.Now,
                    Expiry_Time = DateTime.Now.AddMonths(6),
                    Is_Revoked = false,
                    Device = request!.Device,
                    User_Id = user.Id,
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
            List<Claim> claims = new()
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Role, "Employee"),
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
