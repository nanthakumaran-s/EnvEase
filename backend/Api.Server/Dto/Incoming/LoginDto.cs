namespace Api.Server.Dto.Incoming
{
    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Device { get; set; } = string.Empty;
    }
}
