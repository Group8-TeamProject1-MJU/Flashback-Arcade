using System.Runtime.InteropServices;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase {

    private readonly ILogger _logger;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly UserManager<IdentityUser> _userManager;

    public TestController(
        ILogger<TestController> logger,
        SignInManager<IdentityUser> signInManager,
        UserManager<IdentityUser> userManager
    ) {
        _logger = logger;
        _signInManager = signInManager;
        _userManager = userManager;
    }


    [HttpGet("test")]
    public async Task<IActionResult> TestGet() {
        HttpContext.User.Claims.ToList().ForEach(c => {
            System.Console.WriteLine($"{c.Type} {c.Value}");
        });
        System.Console.WriteLine(HttpContext.User.Identity?.IsAuthenticated);
        System.Console.WriteLine(_signInManager.IsSignedIn(HttpContext.User));
        return Ok(JsonSerializer.Serialize("asdasdasd"));
    }
}
