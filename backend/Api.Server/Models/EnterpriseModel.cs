using System.ComponentModel.DataAnnotations;

namespace Api.Server.Models
{
    public class EnterpriseModel
    {
        [Key]
        [Required]
        public int id { get; set; }

        [Required]
        public string name { get; set; }
    }
}
