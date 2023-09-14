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
