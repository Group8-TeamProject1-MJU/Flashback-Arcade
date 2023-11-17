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
    private readonly IServiceProvider _serviceProvider;

    private readonly IConfiguration _configuration;

    public ChatController(
        ILogger<TestController> logger,
        IConfiguration configuration,
        IServiceProvider serviceProvider
    ) {
        _logger = logger;
        _configuration = configuration;
        _serviceProvider = serviceProvider;
    }

    [HttpGet("translate")]
    public async Task<IActionResult> Translate(string textToTransltate, string translateTo) {
        // 메시지의 언어 코드를 구함
        string translateFrom = await DetectLangs(textToTransltate);
        if (string.IsNullOrWhiteSpace(translateFrom)) {
            _logger.LogInformation("translateFrom is null");
            return BadRequest();
        }

        // translateTo 와 translateFrom이 같다면
        if (translateFrom.CompareTo(translateTo) == 0) 
            return Ok(textToTransltate);
        
        using HttpClient httpClient = _serviceProvider.GetRequiredService<HttpClient>();

        // 네이버 파파고 api 주소 및 헤더, 바디 세팅

        string url = "https://openapi.naver.com/v1/papago/n2mt";
        httpClient.DefaultRequestHeaders.Add("X-Naver-Client-Id",  Environment.GetEnvironmentVariable("NAVER_CLIENTID") ?? _configuration["Authentication:Naver:ClientId"]);
        httpClient.DefaultRequestHeaders.Add("X-Naver-Client-Secret", Environment.GetEnvironmentVariable("NAVER_SECRET") ?? _configuration["Authentication:Naver:ClientSecret"]);
        var content = new StringContent($"source={translateFrom}&target={translateTo}&text={textToTransltate}", Encoding.UTF8, "application/x-www-form-urlencoded");

        // api 요청
        var response = await httpClient.PostAsync(url, content);

        if (response.IsSuccessStatusCode) {
            string result = await response.Content.ReadAsStringAsync();

            using (JsonDocument doc = JsonDocument.Parse(result)) {
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

    [NonAction]
    public async Task<string> DetectLangs(string text) {
        using HttpClient httpClient = _serviceProvider.GetRequiredService<HttpClient>();

        // 네이버 파파고 api 주소 및 헤더, 바디 세팅\
        string url = "https://openapi.naver.com/v1/papago/detectLangs";
        httpClient.DefaultRequestHeaders.Add("X-Naver-Client-Id", _configuration["Authentication:Naver:ClientId"]);
        httpClient.DefaultRequestHeaders.Add("X-Naver-Client-Secret", _configuration["Authentication:Naver:ClientSecret"]);
        var content = new StringContent($"query={text}", Encoding.UTF8, "application/x-www-form-urlencoded");

        // api 요청
        var response = await httpClient.PostAsync(url, content);

        // OK 일 때
        if (response.IsSuccessStatusCode) {
            string result = await response.Content.ReadAsStringAsync();

            using (JsonDocument doc = JsonDocument.Parse(result)) {
                JsonElement root = doc.RootElement;
                JsonElement langCodeElement = root.GetProperty("langCode");

                // 언어코드 추출
                string langCode = langCodeElement.GetString()!;

                if (string.IsNullOrWhiteSpace(langCode)) {
                    _logger.LogInformation("Error detecting language.");
                    return string.Empty;
                }

                return langCode;
            }
        }
        // 에러..
        else {
            _logger.LogInformation($"Error: {response.StatusCode} - {response.ReasonPhrase}");
            return string.Empty;
        }
    }
}
