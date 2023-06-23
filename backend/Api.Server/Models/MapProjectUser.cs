using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Server.Models
{
    public class MapProjectUser
    {
        [Key]
        [Required]
        public int Id { get; set; }

        [ForeignKey("Users")]
        public int User_Id { get; set; }

        [ForeignKey("Project")]
        public int Project_Id { get; set; }

        [ForeignKey("Role")]
        public int Role_Id { get; set; }

        [ForeignKey("Access")]
        public int Access_Id { get; set; }
    }
}
