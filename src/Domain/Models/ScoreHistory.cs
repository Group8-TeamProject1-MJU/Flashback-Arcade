using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Models;

[Table("ScoreHistory")]
public class ScoreHistory {
    [Key] public int Id { get; set; }
    [Required] public int Score { get; set; }
    [Required] public string UserId { get; set; } = string.Empty;
    [Required] public int GameId { get; set; }
}
