using System.Security.Claims;
using System.Text.Json;
using Application.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase {
    private readonly ILogger _logger;
    private readonly AccountService _accountService;
    public AccountController(
        ILogger<AccountController> logger,
        AccountService accountService
    ) {
        _accountService = accountService;
        _logger = logger;
    }

    [HttpPost(template: "signin")]
    public async Task<IActionResult> SigninAsync(JsonElement json) {
        var username = json.GetString("username");
        var password = json.GetString("password");
        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
            return BadRequest("Empty input");

        _logger.LogInformation($"{username} {password}");

        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
        new ClaimsPrincipal(
            new ClaimsIdentity(new List<Claim>() {
                new Claim(ClaimTypes.NameIdentifier, password)
            },
            CookieAuthenticationDefaults.AuthenticationScheme)
        ));

        return Ok(new {
            message = "Logined"
        });
    }

    [HttpPost(template: "signup")]
    public async Task<IActionResult> SignupAsync(JsonElement json) {
        var username = json.GetString("username");
        var password = json.GetString("password");
        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
            return Ok(new ResponseDTO {
                Succeeded = false,
                Errors = new List<string> { "아이디 또는 비밀번호가 비었습니다." }
            });
        
        var response = await _accountService.SignUpAsync(username!, password!);
        var jsonResponse = JsonSerializer.Serialize(response);
        
        return response.Succeeded ? Ok(jsonResponse) : BadRequest(jsonResponse);
    }
}
