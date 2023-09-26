using Domain.Models;
using Infrastructure.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Razor.TagHelpers;

namespace Application.Services;

public class ScoreService {
    private readonly ScoreRepository _scoreRepository;
    private readonly GameRepository _gameRepository;
    private readonly AccountService _accountService;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ScoreService(
        ScoreRepository scoreRepository,
        GameRepository gameRepository,
        AccountService accountService,
        UserManager<IdentityUser> userManager,
        IHttpContextAccessor httpContextAccessor
    ) {
        _scoreRepository = scoreRepository;
        _gameRepository = gameRepository;
        _accountService = accountService;
        _userManager = userManager;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<bool> AddScore(int score, string title) {
        var user = await _userManager.GetUserAsync(_httpContextAccessor.HttpContext!.User);
        var game = await _gameRepository.GetByTitle(title);

        if (game is null || user is null) {
            return false;
        }

        System.Console.WriteLine("not null");
        
        return await _scoreRepository.AddScoreHistory(new ScoreHistory {
            Score = score,
            GameId = game.Id,
            UserId = user.Id
        });
    }
}
