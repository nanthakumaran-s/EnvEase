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
        public string JwtId { get; set; } = string.Empty;

        [Required]
        public string Token { get; set; } = string.Empty;

        [Required]
        public DateTime AddedTime { get; set; }

        [Required]
        public DateTime ExpiryTime { get; set; }

        [Required]
        public bool IsRevoked { get; set; }

        [Required]
        public string Device { get; set; } = string.Empty;

        [ForeignKey("Users")]
        public int UserId { get; set; }

    }
}
