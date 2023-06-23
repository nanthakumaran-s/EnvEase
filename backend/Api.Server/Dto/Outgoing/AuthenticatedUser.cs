using Api.Server.Dto.Internal;

namespace Api.Server.Dto.Outgoing
{
    public class AuthenticatedUser
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public TokensDto Tokens { get; set; } = new TokensDto();
    }
}
