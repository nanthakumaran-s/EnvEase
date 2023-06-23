using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Server.Models
{
    public class MapUserEnterprise
    {
        [Key]
        [Required]
        public int Id { get; set; }

        [ForeignKey("Users")]
        public int User_Id { get; set; }

        [ForeignKey("Enterprise")]
        public int Enterprise_Id { get; set; }

        [ForeignKey("Role")]
        public int Role_Id { get; set; }
    }
}
