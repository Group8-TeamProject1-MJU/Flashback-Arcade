using Microsoft.AspNetCore.Identity;
using Application.DTOs;
using Microsoft.Extensions.Logging;

namespace Application.Services;

public class AccountService {
    private readonly ILogger _logger;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly UserManager<IdentityUser> _userManager;

    public AccountService(
        ILogger<AccountService> logger,
        SignInManager<IdentityUser> signInManager,
        UserManager<IdentityUser> userManager
    ) {
        _logger = logger;
        _signInManager = signInManager;
        _userManager = userManager;
    }

    public async Task<ResponseDTO> SignInAsync(string username, string password) {
        var user = await _userManager.FindByNameAsync(username);

        if (user is null)
            return new ResponseDTO {
                Succeeded = false,
                Errors = new List<string> { "유저아이디 또는 비밀번호가 일치하지 않습니다" }
            };

        var result = await _signInManager.PasswordSignInAsync(user, password, false, false);
        if (result.Succeeded)
            return new ResponseDTO { Succeeded = true };
        else
            return new ResponseDTO() {
                Succeeded = false,
                Errors = new List<string> { "로그인 실패. 관리자에게 문의해주세요." }
            };
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
}
