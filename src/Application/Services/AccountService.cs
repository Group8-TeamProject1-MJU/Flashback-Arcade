using Microsoft.AspNetCore.Identity;
using Application.DTOs;
using Microsoft.Extensions.Logging;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;

namespace Application.Services;

public class AccountService {
    private readonly ILogger _logger;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly AccountRepository _accountRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;
    public AccountService(
        ILogger<AccountService> logger,
        SignInManager<IdentityUser> signInManager,
        UserManager<IdentityUser> userManager,
        AccountRepository accountRepository,
        IHttpContextAccessor httpContextAccessor
    ) {
        _logger = logger;
        _signInManager = signInManager;
        _userManager = userManager;
        _accountRepository = accountRepository;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<ResponseDTO> SignInAsync(string username, string password) {
        var user = await _userManager.FindByNameAsync(username);

        if (user is null)
            return new ResponseDTO {
                Succeeded = false,
                Errors = new List<string> { "유저아이디 또는 비밀번호가 일치하지 않습니다" }
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

    public async Task<ResponseDTO> SignUpAsync(string username, string password) {
        if (await _userManager.FindByNameAsync(username) is not null)
            return new ResponseDTO {
                Succeeded = false,
                Errors = new List<string> { "이미 존재하는 아이디입니다." }
            };

        // Store the user data in the db
        var user = new IdentityUser { UserName = username };
        var result = await _userManager.CreateAsync(user, password);

        if (result.Succeeded)
            return new ResponseDTO { Succeeded = true };
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
