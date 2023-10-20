using Application.Ranking;
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
    private readonly RankersStaticHelper _rankersStaticHelper;

    public ScoreService(
        ScoreRepository scoreRepository,
        GameRepository gameRepository,
        AccountService accountService,
        UserManager<IdentityUser> userManager,
        IHttpContextAccessor httpContextAccessor,
        RankersStaticHelper rankersStaticHelper
    ) {
        _scoreRepository = scoreRepository;
        _gameRepository = gameRepository;
        _accountService = accountService;
        _userManager = userManager;
        _httpContextAccessor = httpContextAccessor;
        _rankersStaticHelper = rankersStaticHelper;
    }

    public async Task<bool> AddScoreHistory(int score, string title) {
        var user = await _userManager.GetUserAsync(_httpContextAccessor.HttpContext!.User);
        var game = await _gameRepository.GetByTitle(title);

        if (game is null || user is null) 
            return false;
        
        var newScoreHistory = new ScoreHistory {
            Score = score,
            GameId = game.Id,
            UserId = user.Id
        };

        bool addedToRankers = await _rankersStaticHelper.TryAddAsync(newScoreHistory);
        bool addedToDB = await _scoreRepository.AddScoreHistory(newScoreHistory);

        return addedToRankers && addedToDB;
    }
}
