using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase {
    private readonly ILogger _logger;

    public AccountController(
        ILogger<AccountController> logger
    ) {
        _logger = logger;
    }

    [HttpPost(template: "login")]
    public async Task<IActionResult> LoginAsync(JsonElement json) {
        var username = json.GetString("username");
        var password = json.GetString("password");

        _logger.LogInformation($"{username} {password}");

        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
        new ClaimsPrincipal(
            new ClaimsIdentity(new List<Claim>() {
                new Claim(ClaimTypes.NameIdentifier, "Jehee")
            },
            CookieAuthenticationDefaults.AuthenticationScheme)
        ));
        return Ok(new {
            message = "Logined"
        });
    }
}
