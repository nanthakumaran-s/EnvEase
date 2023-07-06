using Api.Server.Dto.Internal;

namespace Api.Server.Utils.Interfaces
{
    public interface IBCryptUtils
    {
        string HashPassword(string password, out byte[] salt);
        bool VerifyPassword(string password, string hash, string salt);
        ProjectTokensDto CreateApiKeys(string name);
        string HashString(string name);

        string EncryptString(string key, string plainText);
        string DecryptString(string key, string cipherText);
    }
}
