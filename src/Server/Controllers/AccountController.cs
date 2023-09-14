using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController: ControllerBase {
    private readonly ILogger _logger;

    public AccountController(
        ILogger<AccountController> logger
    ) {
        _logger = logger;
    }
    
    [HttpGet("asd")]
    public IActionResult GetSomething() {
        _logger.LogInformation("Called");
        return Ok(new {
            message = "Hello"
        });
    }
}
