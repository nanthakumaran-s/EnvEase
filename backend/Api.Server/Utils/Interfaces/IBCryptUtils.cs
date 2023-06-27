using Api.Server.Dto.Internal;

namespace Api.Server.Utils.Interfaces
{
    public interface IBCryptUtils
    {
        string HashPassword(string password, out byte[] salt);
        bool VerifyPassword(string password, string hash, string salt);
        ProjectTokensDto CreateApiKeys(string name);
    }
}
