using System.ComponentModel.DataAnnotations;

namespace Api.Server.Models
{
    public class ProjectModel
    {
        [Key]
        [Required]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Api_Key { get; set; } = string.Empty;
    }
}
