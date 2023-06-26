using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
        public string ApiKey { get; set; } = string.Empty;

        [ForeignKey("Enterprise")]
        public int BelongsTo { get; set; }
    }
}
