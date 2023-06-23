using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Server.Models
{
    public class SessionModel
    {
        [Key]
        [Required]
        public int Id { get; set; }

        [Required]
        public string Jwt_Id { get; set; } = string.Empty;

        [Required]
        public string Token { get; set; } = string.Empty;

        [Required]
        public DateTime Added_Time { get; set; }

        [Required]
        public DateTime Expiry_Time { get; set; }

        [Required]
        public bool Is_Revoked { get; set; }

        [Required]
        public string Device { get; set; } = string.Empty;

        [ForeignKey("Users")]
        public int User_Id { get; set; }

    }
}
