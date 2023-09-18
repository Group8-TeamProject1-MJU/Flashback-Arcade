using Microsoft.AspNetCore.Identity;
using Application.DTOs;
using Microsoft.Extensions.Logging;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;
using Domain.IServices;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;

namespace Application.Services;

public class AccountService {
    private readonly ILogger _logger;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly AccountRepository _accountRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IConfiguration _configuration;
    private readonly EmailService _emailService;
    public AccountService(
        ILogger<AccountService> logger,
        SignInManager<IdentityUser> signInManager,
        UserManager<IdentityUser> userManager,
        AccountRepository accountRepository,
        IHttpContextAccessor httpContextAccessor,
        IConfiguration configuration,
        IEmailService emailService
    ) {
        _logger = logger;
        _signInManager = signInManager;
        _userManager = userManager;
        _accountRepository = accountRepository;
        _httpContextAccessor = httpContextAccessor;
        _configuration = configuration;
        _emailService = (emailService as EmailService)!;
    }

    public async Task<ResponseDTO> SignInAsync(string username, string password) {
        var user = await _userManager.FindByNameAsync(username);

        if (user is null)
            return new ResponseDTO {
                Succeeded = false,
                Errors = new List<string> { "유저아이디 또는 비밀번호가 일치하지 않습니다" }
            };

        if (!user.EmailConfirmed)
            return new ResponseDTO() {
                Succeeded = false,
                Errors = new List<string> { "이메일 인증을 완료해주세요" }
            };

        // var result = await _signInManager.CheckPasswordSignInAsync(user, password, false);
        var result = await _signInManager.PasswordSignInAsync(user, password, false, false);

        if (!result.Succeeded)
            return new ResponseDTO() {
                Succeeded = false,
                Errors = new List<string> { "로그인 실패. 관리자에게 문의해주세요." }
            };
        else {
            // await _signInManager.SignInWithClaimsAsync(user, false, new List<Claim> {
            //     new Claim(ClaimTypes.NameIdentifier, username)
            // });
            // await _httpContextAccessor.HttpContext!.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(
            //     new ClaimsIdentity(
            //         new List<Claim>() {
            //             new Claim(ClaimTypes.Name, username)
            //         }
            //         , CookieAuthenticationDefaults.AuthenticationScheme
            //     )
            // ));

            return new ResponseDTO { Succeeded = true };
        }
    }

    public async Task<ResponseDTO> SignUpAsync(string username, string password, string email) {
        if (await _userManager.FindByNameAsync(username) is not null)
            return new ResponseDTO {
                Succeeded = false,
                Errors = new List<string> { "이미 존재하는 아이디입니다." }
            };

        // Store the user data in the db
        var user = new IdentityUser { UserName = username, Email = email };
        var result = await _userManager.CreateAsync(user, password);
        var httpContext = _httpContextAccessor.HttpContext!;
        if (result.Succeeded) {
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

            _logger.LogInformation(token);

            var url = $"{_configuration["ClientUrls:ReactUrl"]!}/account/confirm-email?token={token}&email={email}";

            var body = $"<h3>아래 링크를 눌러 이메일 인증을 완료해주세요</h3><br /><a href={url}>인증페이지로 이동</a>";
            var isSent = await _emailService.SendFromServerAsync(email, "Flashback Arcade 회원가입을 완료해주세요", body);
            if (!isSent) {
                _logger.LogInformation("Failed to send an email...");
            }

            return new ResponseDTO { Succeeded = true };
        }
        else
            return new ResponseDTO() {
                Succeeded = false,
                Errors = result.Errors.Select(e => e.Description).ToList()
            };
    }

    public async Task<IdentityUser> GetByEmailAsync(string email) {
        return await _accountRepository.GetByEmailAsync(email);
    }
}
