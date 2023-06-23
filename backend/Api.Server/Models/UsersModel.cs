using System.ComponentModel.DataAnnotations;

namespace Api.Server.Models
{
    public class UsersModel
    {
        [Key]
        [Required]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password_Hash { get; set; } = string.Empty;

        [Required]
        public string Salt { get; set; } = string.Empty;

        [Required]
        public bool Two_Factor { get; set; }
    }
}
