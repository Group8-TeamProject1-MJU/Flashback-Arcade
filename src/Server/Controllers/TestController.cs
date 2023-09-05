using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers;

[ApiController]
[Route("[controller]")]
public class TestController : ControllerBase {
    private readonly ILogger<TestController> _logger;

    public TestController(ILogger<TestController> logger) {
        _logger = logger;
    }

    [HttpGet("test")]
    public string TestGet() {
        return "asdasdasdasd~~~~~";
    }
}
