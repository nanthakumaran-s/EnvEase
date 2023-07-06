using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Server.Models
{
    public class EnvModel
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Key { get; set; } = string.Empty;

        [Required]
        public string Value { get; set; } = string.Empty;

        [ForeignKey("Project")]
        public int ProjectId { get; set; }

        [Required]
        public string Type { get; set; } = string.Empty;

    }
}
