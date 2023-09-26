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
    public IActionResult AddScore(JsonElement json) {
        int score = Convert.ToInt32(json.GetString("score"));



        return Ok(JsonSerializer.Serialize(new {
            response = "Hey"
        }));
    }

    [HttpGet("test")]
    public IActionResult test() {
        return Ok(JsonSerializer.Serialize(new {
            response = "Hey"
        }));
    }
}
