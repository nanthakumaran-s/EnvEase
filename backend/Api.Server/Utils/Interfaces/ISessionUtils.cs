using Api.Server.Dto.Incoming;
using Api.Server.Dto.Internal;
using Api.Server.Models;
using System.Security.Claims;

namespace Api.Server.Utils.Interfaces
{
    public interface ISessionUtils
    {
        TokensDto CreateTokens(UsersModel user, bool isDbWrite, LoginDto? request = null);
        ClaimsPrincipal? VerifyAndGetPrincipal(string token);
    }
}
