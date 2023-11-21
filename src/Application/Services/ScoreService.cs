using System.Text.Json;
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
    private readonly AccountRepository _accountRepository;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly RankersStaticHelper _rankersStaticHelper;

    public ScoreService(
        ScoreRepository scoreRepository,
        GameRepository gameRepository,
        AccountService accountService,
        AccountRepository accountRepository,
        UserManager<IdentityUser> userManager,
        IHttpContextAccessor httpContextAccessor,
        RankersStaticHelper rankersStaticHelper
    ) {
        _scoreRepository = scoreRepository;
        _gameRepository = gameRepository;
        _accountService = accountService;
        _accountRepository = accountRepository;
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

        return addedToDB;
    }

    public async Task<IEnumerable<object>> GetRankersAsync(string title) {
        var scores = RankersStatic.GameRankersArray!.FirstOrDefault(rankers => string.Compare(rankers.game.Title, title) == 0)!.scores.ToList();
        return await Task.WhenAll(scores.Select(async s => {
            return new {
                UserName = await _accountRepository.GetUserNameAsync(s.UserId),
                Score = s.Score,
                Id = s.Id
            };
        }));
    }

    public async Task<IEnumerable<object>?> GetTotalRankersAsync() {
        return await Task.WhenAll(RankersStatic.TotalRankers!.scores.Select(async s => {
            return new {
                UserName = await _accountRepository.GetUserNameAsync(s.UserId),
                Score = s.Score
            };
        }));
    }

    public async Task<IEnumerable<object>> GetRanksAsync(string userName) {
        string? id = await _accountService.GetByUserNameAsync(userName);
        if (string.IsNullOrWhiteSpace(id))
            return null!;

        return RankersStatic.GameRankersArray!
            .Select(rankers => {
                return new {
                    Title = rankers.game.Title,
                    Rank = rankers.rankedPlayers.ContainsKey(id) == true ? rankers.rankedPlayers[id] : 0
                };
            })
            .Where(ranker => ranker.Rank is not 0);
    }
}
