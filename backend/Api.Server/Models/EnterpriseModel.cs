using System.ComponentModel.DataAnnotations;

namespace Api.Server.Models
{
    public class EnterpriseModel
    {
        [Key]
        [Required]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public string? ImageUrl { get; set; }
    }
}
