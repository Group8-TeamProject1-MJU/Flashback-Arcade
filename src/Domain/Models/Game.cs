using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Domain.Models;

[Table("Game")]
public class Game {
    [Key] public int Id { get; set; }
    [Required] public string Title { get; set; } = string.Empty;
    [Required] public bool Descending { get; set; }
}
