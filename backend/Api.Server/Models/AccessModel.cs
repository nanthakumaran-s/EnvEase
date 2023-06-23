using System.ComponentModel.DataAnnotations;

namespace Api.Server.Models
{
    public class AccessModel
    {
        [Key]
        [Required]
        public int Id { get; set; }

        [Required]
        public string Access { get; set; } = string.Empty;
    }
}
