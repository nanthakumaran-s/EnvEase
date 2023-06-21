using System.ComponentModel.DataAnnotations;

namespace Api.Server.Models
{
    public class UsersModel
    {
        [Key]
        [Required]
        public int id { get; set; }

        [Required]
        public string name { get; set; }

        [Required]
        public string email { get; set; }

        [Required]
        public string password { get; set; }

        [Required]
        public bool two_factor { get; set; }
    }
}
