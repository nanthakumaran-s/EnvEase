using System.ComponentModel.DataAnnotations;

namespace Api.Server.Models
{
    public class RoleModel
    {
        [Key]
        [Required]
        public int Id { get; set; }

        [Required]
        public string Role { get; set; } = string.Empty;
    }
}
