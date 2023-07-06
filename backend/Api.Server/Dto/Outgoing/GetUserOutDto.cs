using Api.Server.Models;

namespace Api.Server.Dto.Outgoing
{
    public class GetUserOutDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public bool TwoFactor { get; set; }
        public EnterpriseModel Enterprise { get; set; } = new EnterpriseModel();
        public RoleModel Role { get; set; } = new RoleModel();
    }
}
