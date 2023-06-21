using System.ComponentModel.DataAnnotations;

namespace Api.Server.Models
{
    public class RoleModel
    {
        [Key]
        [Required]
        public int id { get; set; }

        [Required]
        public string role { get; set; }
    }
}
