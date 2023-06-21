using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Server.Models
{
    public class MapProjectEnterprise
    {
        [Key]
        [Required]
        public int id { get; set; }

        [ForeignKey("Enterprise")]
        public int enterprise_id { get; set; }

        [ForeignKey("Project")]
        public int project_id { get; set; }
    }
}
