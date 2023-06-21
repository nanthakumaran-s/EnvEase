using System.ComponentModel.DataAnnotations;

namespace Api.Server.Models
{
    public class ProjectModel
    {
        [Key]
        [Required]
        public int id { get; set; }

        [Required]
        public string name { get; set; }

        [Required]
        public string api_key { get; set; }
    }
}
