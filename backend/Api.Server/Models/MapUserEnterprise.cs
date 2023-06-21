using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Server.Models
{
    public class MapUserEnterprise
    {
        [Key]
        [Required]
        public int id { get; set; }

        [ForeignKey("Users")]
        public int user_id { get; set; }

        [ForeignKey("Enterprise")]
        public int enterprise_id { get; set; }

        [ForeignKey("Role")]
        public int role_id { get; set; }
    }
}
