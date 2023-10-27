using System.Text.Json;
using Application.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ScoreController : ControllerBase {
    private readonly ScoreService _scoreService;

    public ScoreController(
        ScoreService scoreService
    ) {
        _scoreService = scoreService;
    }

    [HttpPost("add-score")]
    public async Task<IActionResult> AddScore(JsonElement json) {
        int score = Convert.ToInt32(json.GetString("score"));
        string? title = json.GetString("title");

        if (await _scoreService.AddScoreHistory(score, title!))
            return Ok();
        else return BadRequest();
    }

    [HttpGet("get-rankers")]
    public async Task<ActionResult<IEnumerable<string>>> GetRankersAsync(string title) {
        return Ok(JsonSerializer.Serialize(await _scoreService.GetRankersAsync(title)));
    }
}
