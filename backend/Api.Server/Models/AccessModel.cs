using System.ComponentModel.DataAnnotations;

namespace Api.Server.Models
{
    public class AccessModel
    {
        [Key]
        [Required]
        public int id { get; set; }

        [Required]
        public string access { get; set; }
    }
}
