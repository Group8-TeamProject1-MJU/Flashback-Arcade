using System.Collections.Generic;
using System.Security.Claims;
using System.Text.Json;
using Application.Services;
using Domain.IServices;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MimeKit;
using MimeKit.Text;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase {

    private readonly ILogger _logger;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly EmailService _emailService;

    public TestController(
        ILogger<TestController> logger,
        SignInManager<IdentityUser> signInManager,
        UserManager<IdentityUser> userManager,
        IEmailService emailService
    ) {
        _logger = logger;
        _signInManager = signInManager;
        _userManager = userManager;
        _emailService = (emailService as EmailService)!;
    }


    [HttpGet("test")]
    public IActionResult TestGet() {
        _logger.LogInformation("TestGet");

        HttpContext.User.Claims.ToList().ForEach(c => {
            System.Console.WriteLine($"{c.Type} {c.Value}");
        });
        System.Console.WriteLine(HttpContext.User.Identity?.IsAuthenticated);
        System.Console.WriteLine(_signInManager.IsSignedIn(HttpContext.User));

        return Ok(JsonSerializer.Serialize(new {
            username = HttpContext.User.FindFirstValue(ClaimTypes.Name),
            email = HttpContext.User.FindFirstValue(ClaimTypes.Email)
        }));
    }

    [HttpPost("mail")]
    public async Task<IActionResult> MailAsync(string body) {
        await _emailService.SendFromServerAsync(new List<string> { "jeheecheon@gmail.com" }, "Test!!", body);

        return Ok("ok~~");
    }
}
