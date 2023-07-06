namespace Api.Server.Dto.Incoming
{
    public class ChangePassDto
    {
        public string OldPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }

    public class TwoFactorDto
    {
        public bool TwoFactor { get; set; }
    }

    public class DeleteUserDto
    {
        public int Id { get; set; }
    }
}
