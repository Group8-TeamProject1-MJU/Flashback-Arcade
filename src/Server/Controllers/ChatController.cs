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
public class ChatController : ControllerBase {
    private readonly ILogger _logger;
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public ChatController(
        ILogger<TestController> logger,
        HttpClient httpClient,
        IConfiguration configuration
    ) {
        _logger = logger;
        _httpClient = httpClient;
        _configuration = configuration;
    }

    [HttpGet("translate")]
    public async Task<IActionResult> Translate(string textToTransltate, string translateFrom, string translateTo) {
        string url = "https://openapi.naver.com/v1/papago/n2mt";

        _httpClient.DefaultRequestHeaders.Add("X-Naver-Client-Id", _configuration["Authentication:Naver:ClientId"]);
        _httpClient.DefaultRequestHeaders.Add("X-Naver-Client-Secret", _configuration["Authentication:Naver:ClientSecret"]);

        var content = new StringContent($"source={translateFrom}&target={translateTo}&text={textToTransltate}", Encoding.UTF8, "application/x-www-form-urlencoded");

        var response = await _httpClient.PostAsync(url, content);

        if (response.IsSuccessStatusCode) {
            string result = await response.Content.ReadAsStringAsync();
            Console.WriteLine(result);

            using (JsonDocument doc = JsonDocument.Parse(result)) {
                // root를 가져오고 필요한 경로로 이동
                JsonElement root = doc.RootElement;
                JsonElement messageElement = root.GetProperty("message");
                JsonElement resultElement = messageElement.GetProperty("result");
                JsonElement translatedTextElement = resultElement.GetProperty("translatedText");

                // 번역된 텍스트 추출
                string translatedText = translatedTextElement.GetString()!;

                if (!string.IsNullOrWhiteSpace(translatedText)) {
                    return Ok(translatedText);
                }
                else {
                    _logger.LogInformation("Error extracting translated text.");
                    return BadRequest();
                }
            }
        }
        else {
            _logger.LogInformation($"Error: {response.StatusCode} - {response.ReasonPhrase}");
            return BadRequest();
        }
    }
}
