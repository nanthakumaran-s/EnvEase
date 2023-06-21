using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Server.Models
{
    public class MapProjectUser
    {
        [Key]
        [Required]
        public int id { get; set; }

        [ForeignKey("Users")]
        public int user_id { get; set; }

        [ForeignKey("Project")]
        public int project_id { get; set; }

        [ForeignKey("Role")]
        public int role_id { get; set; }

        [ForeignKey("Access")]
        public int access_id { get; set; }
    }
}
