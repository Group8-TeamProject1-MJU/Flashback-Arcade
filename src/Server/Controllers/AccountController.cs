using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using Application.DTOs;
using Application.Services;
using AspNet.Security.OAuth.KakaoTalk;
using AspNet.Security.OAuth.Naver;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase {
    private readonly ILogger _logger;
    private readonly AccountService _accountService;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly IConfiguration _configuration;
    private readonly UserManager<IdentityUser> _userManager;
    public AccountController(
        ILogger<AccountController> logger,
        AccountService accountService,
        SignInManager<IdentityUser> signInManager,
        IConfiguration configuration,
        UserManager<IdentityUser> userManager
    ) {
        _accountService = accountService;
        _logger = logger;
        _configuration = configuration;
        _signInManager = signInManager;
        _userManager = userManager;
    }

    [HttpPost(template: "signin")]
    public async Task<IActionResult> SigninAsync(JsonElement json) {
        var username = json.GetString("username");
        var password = json.GetString("password");
        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
            return Ok(new ResponseDTO {
                Succeeded = false,
                Errors = new List<string> { "아이디 또는 비밀번호가 비었습니다." }
            });

        var response = await _accountService.SignInAsync(username!, password!);
        var jsonResponse = JsonSerializer.Serialize(response);

        return response.Succeeded ? Ok(jsonResponse) : BadRequest(jsonResponse);
    }

    [HttpPost(template: "signup")]
    public async Task<IActionResult> SignupAsync(JsonElement json) {
        var username = json.GetString("username");
        var password = json.GetString("password");
        var email = json.GetString("email");

        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password) || string.IsNullOrWhiteSpace(email))
            return Ok(new ResponseDTO {
                Succeeded = false,
                Errors = new List<string> { "이메일, 비밀번호, 아이디 중 값이 비어있습니다." }
            });

        var response = await _accountService.SignUpAsync(username!, password!, email!);
        var jsonResponse = JsonSerializer.Serialize(response);

        return response.Succeeded ? Ok(jsonResponse) : BadRequest(jsonResponse);
    }

    [HttpPost(template: "signout")]
    public async Task<IActionResult> SignoutAsync() {
        await _signInManager.SignOutAsync();
        return Ok(new ResponseDTO {
            Succeeded = true
        });
    }

    [HttpGet(template: "google-signin")]
    public IActionResult GoogleSignIn() {
        var prop = _signInManager.ConfigureExternalAuthenticationProperties(GoogleDefaults.AuthenticationScheme, "/api/account/oauth-cb");

        return Challenge(prop, GoogleDefaults.AuthenticationScheme);
    }

    [HttpGet(template: "naver-signin")]
    public IActionResult NaverSignIn() {
        var prop = _signInManager.ConfigureExternalAuthenticationProperties(NaverAuthenticationDefaults.AuthenticationScheme, "/api/account/oauth-cb");

        return Challenge(prop, NaverAuthenticationDefaults.AuthenticationScheme);
    }

    [HttpGet(template: "kakaotalk-signin")]
    public IActionResult KakaotalkSignin() {
        var prop = _signInManager.ConfigureExternalAuthenticationProperties(KakaoTalkAuthenticationDefaults.AuthenticationScheme, "/api/account/oauth-cb");

        return Challenge(prop, KakaoTalkAuthenticationDefaults.AuthenticationScheme);
    }

    [HttpGet("oauth-cb")]
    public async Task<IActionResult> OauthCbAsync() {
        // Load up the login session from the external cookie
        var info = await _signInManager.GetExternalLoginInfoAsync();

        // return when it failed to load the session
        if (info == null) {
            _logger.LogInformation("Error loading external login information.");
            return Redirect(_configuration["ClientUrls:ReactUrl"]!);
        }

        Console.WriteLine(info.Principal.HasClaim(c => c.Type == ClaimTypes.Email));
        // Attempt to external-login with the session loaded up
        var result = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: false, bypassTwoFactor: true);

        if (result.Succeeded) {
            _logger.LogInformation("{Name} logged in with {LoginProvider} provider.", info.Principal.Identity?.Name, info.LoginProvider);
            if (info.Principal.HasClaim(c => c.Type == ClaimTypes.Email)) {
                var user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);

                // await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(
                //     new ClaimsIdentity(
                //         new List<Claim> {
                //             new Claim(ClaimTypes.Email, info.Principal.FindFirstValue(ClaimTypes.Email)!),
                //             new Claim(ClaimTypes.Name, info.Principal.FindFirstValue(ClaimTypes.Email)!)
                //         },
                //         CookieAuthenticationDefaults.AuthenticationScheme
                //     )
                // ));
                await _signInManager.SignInAsync(user!, true);
            }
            return Redirect(_configuration["ClientUrls:ReactUrl"]!);
        }
        else if (result.IsLockedOut)
            return Redirect(_configuration["ClientUrls:ReactUrl"]!);
        else {
            if (info.Principal.HasClaim(c => c.Type == ClaimTypes.Email)) {
                var user = await _accountService.GetByEmailAsync(info.Principal.FindFirstValue(ClaimTypes.Email)!);

                // 동일한 이메일로 가입된 소셜 계정이 존재할 경우
                if (user is not null) {
                    var addResult = await _userManager.AddLoginAsync(user, info);

                    if (addResult.Succeeded) {
                        // await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(
                        //     new ClaimsIdentity(
                        //         new List<Claim> {
                        //             new Claim(ClaimTypes.Email, info.Principal.FindFirstValue(ClaimTypes.Email)!),
                        //             new Claim(ClaimTypes.Name, info.Principal.FindFirstValue(ClaimTypes.Email)!)
                        //         },
                        //         CookieAuthenticationDefaults.AuthenticationScheme
                        //     )
                        // ));
                        await _signInManager.SignInAsync(user!, true);
                    }
                    // return Redirect(_configuration["ClientUrls:ReactUrl"]!);
                }
                // 동일한 이메일로 가입된 소셜 계정이 없을 경우
                else {
                    var username = info.Principal.FindFirstValue(ClaimTypes.Email)!;
                    username = username.Split('@')[0];
                    username = Regex.Replace(username, @"[^a-zA-Z0-9]", "");

                    // string result = input.Replace(" ", ""); // 모든 공백을 제거합니다.
                    user = new IdentityUser {
                        Email = info.Principal.FindFirstValue(ClaimTypes.Email)!,
                        UserName = username,
                        EmailConfirmed = true
                    };

                    var createResult = await _userManager.CreateAsync(user);
                    if (createResult.Succeeded) {
                        var addResult = await _userManager.AddLoginAsync(user, info);
                        if (addResult.Succeeded) {
                            _logger.LogInformation("User created an account using {Name} provider.", info.LoginProvider);
                            // await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(
                            //     new ClaimsIdentity(
                            //         new List<Claim> {
                            //             new Claim(ClaimTypes.Email, info.Principal.FindFirstValue(ClaimTypes.Email)!),
                            //             new Claim(ClaimTypes.Name, info.Principal.FindFirstValue(ClaimTypes.Email)!)
                            //         },
                            //         CookieAuthenticationDefaults.AuthenticationScheme
                            //     )
                            // ));
                            await _signInManager.SignInAsync(user!, true);
                        }
                    }
                }
            }
            return Redirect(_configuration["ClientUrls:ReactUrl"]!);
        }
    }

    [HttpPost("confirm-email")]
    public async Task<IActionResult> ConfirmEmail(string token, string email) {
        string msg;
        _logger.LogInformation($"token before decoding: {token}");
        _logger.LogInformation(email);

        var user = await _userManager.FindByEmailAsync(email);
        if (user is null) {
            msg = "The matching user doesn't exist with the provided email";
            _logger.LogInformation(msg);
            return BadRequest(new { msg });
        }

        token = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));
        _logger.LogInformation($"token after decoding: {token}");

        var result = await _userManager.ConfirmEmailAsync(user, token);
        msg = result.Succeeded ? "메일 인증에 성공했습니다." : "메일 인증에 실패했습니다.";

        return Ok(new { msg });
    }

    [HttpPost("external-signup")]
    public async Task<IActionResult> ExternalSignupAsync(string token, string provider, string email, string username, string password) {
        System.Console.WriteLine("asdasdas@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@d");
        if (string.IsNullOrWhiteSpace(username)
            || string.IsNullOrWhiteSpace(email)
            || string.IsNullOrWhiteSpace(password)
            || string.IsNullOrWhiteSpace(token))
            return BadRequest(JsonSerializer.Serialize(
                new ResponseDTO {
                    Succeeded = false,
                    Errors = new List<string> {
                        "유저네임 또는 패스워드가 비었습니다"
                    }
                }));

        var user = await _accountService.GetByEmailAsync(email);
        if (user is null)
            return BadRequest(JsonSerializer.Serialize(
                            new ResponseDTO {
                                Succeeded = false,
                                Errors = new List<string> {
                        "회원가입 실패. 관리자에게 문의하세요. e1"
                                }
                            }));


        token = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));
        var result = await _userManager.ResetPasswordAsync(user, token, password);
        if (!result.Succeeded)
            return BadRequest(JsonSerializer.Serialize(
                    new ResponseDTO {
                        Succeeded = false,
                        Errors = new List<string> {
                        "회원가입 실패. 관리자에게 문의하세요. e1"
                        }
                    }));

        var usernameSet = await _userManager.SetUserNameAsync(user, username);

        if (!usernameSet.Succeeded)
            return BadRequest(JsonSerializer.Serialize(
                    new ResponseDTO {
                        Succeeded = false,
                        Errors = new List<string> {
                                "회원가입 실패. 관리자에게 문의하세요. e2"
                        }
                    }));

        _logger.LogInformation("User created an account using {Name} provider.", provider);
        // await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(
        //     new ClaimsIdentity(
        //         new List<Claim> {
        //             new Claim(ClaimTypes.Email, info.Principal.FindFirstValue(ClaimTypes.Email)!),
        //             new Claim(ClaimTypes.Name, info.Principal.FindFirstValue(ClaimTypes.Email)!)
        //         },
        //         CookieAuthenticationDefaults.AuthenticationScheme
        //     )
        // ));
        await _signInManager.SignInAsync(user!, true);

        return Ok(new ResponseDTO {
            Succeeded = true
        });
    }


    [HttpGet("authenticate")]
    public IActionResult AuthenticateAsync() {
        _logger.LogInformation("authenticate");

        HttpContext.User.Claims.ToList().ForEach(c => {
            _logger.LogInformation($"{c.Type} {c.Value}");
        });
        System.Console.WriteLine(_signInManager.IsSignedIn(HttpContext.User));

        return Ok(JsonSerializer.Serialize(new {
            isAuthenticated = _signInManager.IsSignedIn(HttpContext.User),
            username = HttpContext.User.FindFirstValue(ClaimTypes.Name),
            email = HttpContext.User.FindFirstValue(ClaimTypes.Email)
        }));
    }
}
