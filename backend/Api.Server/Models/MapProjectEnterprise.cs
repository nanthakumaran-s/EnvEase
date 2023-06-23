using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Server.Models
{
    public class MapProjectEnterprise
    {
        [Key]
        [Required]
        public int Id { get; set; }

        [ForeignKey("Enterprise")]
        public int Enterprise_Id { get; set; }

        [ForeignKey("Project")]
        public int Project_Id { get; set; }
    }
}
