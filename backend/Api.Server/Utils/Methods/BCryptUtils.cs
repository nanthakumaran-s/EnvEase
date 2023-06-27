using Api.Server.Dto.Internal;
using System.Security.Cryptography;
using System.Text;

namespace Api.Server.Utils.Methods
{
    public class BCryptUtils : IBCryptUtils
    {
        private readonly int keySize = 64;
        private readonly int iterations = 350000;
        private readonly HashAlgorithmName hashAlgorithm = HashAlgorithmName.SHA512;

        public string HashPassword(string password, out byte[] salt)
        {
            salt = RandomNumberGenerator.GetBytes(keySize);

            var hash = Rfc2898DeriveBytes.Pbkdf2(
                Encoding.UTF8.GetBytes(password),
                salt,
                iterations,
                hashAlgorithm,
                keySize
            );

            return Convert.ToHexString(hash);
        }

        public bool VerifyPassword(string password, string hash, string salt)
        {
            var hashToCompare = Rfc2898DeriveBytes.Pbkdf2(password, ToByte(salt), iterations, hashAlgorithm, keySize);
            return CryptographicOperations.FixedTimeEquals(hashToCompare, Convert.FromHexString(hash));
        }

        public ProjectTokensDto CreateApiKeys(string name)
        {
            return new ProjectTokensDto()
            {
                ApiKey = CreateRandom(16),
                ApiSecret = CreateRandom(32),
            };
        }

        private static byte[] ToByte(string salt)
        {
            return Enumerable.Range(0, salt.Length)
                .Where(x => x % 2 == 0)
                .Select(x => Convert.ToByte(salt.Substring(x, 2), 16))
                .ToArray();
        }

        private static string CreateRandom(int len)
        {
            var randomNumber = new byte[len];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }
}
