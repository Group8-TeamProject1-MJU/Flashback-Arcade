using System.Collections.Generic;
using System.Net;
using System.Security.Claims;
using System.Text;
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
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public TestController(
        ILogger<TestController> logger,
        SignInManager<IdentityUser> signInManager,
        UserManager<IdentityUser> userManager,
        IEmailService emailService,
        HttpClient httpClient,
        IConfiguration configuration
    ) {
        _logger = logger;
        _signInManager = signInManager;
        _userManager = userManager;
        _emailService = (emailService as EmailService)!;
        _httpClient = httpClient;
        _configuration = configuration;
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

    [HttpGet("translate")]
    public async Task<IActionResult> Translate(string textToTransltate) {
        string url = "https://openapi.naver.com/v1/papago/n2mt";

        string sourceLanguage = "ko";
        string targetLanguage = "en";

        _httpClient.DefaultRequestHeaders.Add("X-Naver-Client-Id", _configuration["Authentication:Naver:ClientId"]);
        _httpClient.DefaultRequestHeaders.Add("X-Naver-Client-Secret", _configuration["Authentication:Naver:ClientSecret"]);

        var content = new StringContent($"source={sourceLanguage}&target={targetLanguage}&text={textToTransltate}", Encoding.UTF8, "application/x-www-form-urlencoded");

        var response = await _httpClient.PostAsync(url, content);

        if (response.IsSuccessStatusCode) {
            string result = await response.Content.ReadAsStringAsync();
            Console.WriteLine(result);
            return Ok(result);
        }
        else {
            Console.WriteLine($"Error: {response.StatusCode} - {response.ReasonPhrase}");
            return BadRequest();
        }
    }
}
