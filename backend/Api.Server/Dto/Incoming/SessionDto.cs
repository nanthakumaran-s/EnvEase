namespace Api.Server.Dto.Incoming
{
    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Device { get; set; } = string.Empty;
    }

    public class RegisterDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public bool TwoFactor { get; set; }
        public int RoleId { get; set; }
        public int EnterpriseId { get; set; }
    }

    public class RevokeTokenDto
    {
        public string Token { get; set; } = string.Empty;
    }
}
