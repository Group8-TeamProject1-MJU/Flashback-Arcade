using Application.Services;
using Domain.IServices;
using Domain.Models;
using Infrastructure.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Application.Ranking;

public class RankersStaticHelper {
    private readonly GameRepository _gameRepository;
    private readonly ScoreRepository _scoreRepository;
    private readonly EmailService _emailService;
    private readonly AccountService _accountService;
    private readonly IConfiguration _configuration;
    private readonly ILogger _logger;

    public RankersStaticHelper(
        GameRepository gameRepository,
        ScoreRepository scoreRepository,
        IEmailService emailService,
        AccountService accountService,
        IConfiguration configuration,
        ILogger<RankersStaticHelper> logger
    ) {
        _gameRepository = gameRepository;
        _scoreRepository = scoreRepository;
        _emailService = (emailService as EmailService)!;
        _accountService = accountService;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task InitializeAsync() {
        var games = _gameRepository.GetAll(); // 모든 종류의 게임
        var scores = _scoreRepository.GetAll(); // 여러 종류의 게임의 스코어들이 한 링크드리스트에 한 리스트 자료형에 섞여 있음

        // 초기 배열 생성
        RankersStatic.GameRankersArray = new Rankers[games.Count];
        RankersStatic.TotalRankers = new Rankers(true);

        // 모든 게임 순회
        for (int i = 0; i < RankersStatic.GameRankersArray.Length; ++i) {
            RankersStatic.GameRankersArray[i] = new Rankers(games[i].Descending, games[i]); // 해당 게임의 랭커 객체 초기화
            var gameScores = scores.Where(s => RankersStatic.GameRankersArray[i].game.Id == s.GameId).ToList(); // 해당 게임의 스코어들

            // 해당 게임 "선택 정렬" 시작, 100명만 뽑음
            for (int j = 0; j < gameScores.Count && j < 100; ++j) {
                int rankerIdx = j; // 선택된 인덱스

                for (int k = j + 1; k < gameScores.Count; ++k)
                    if (RankersStatic.GameRankersArray[i].Compare(gameScores[k].Score, gameScores[rankerIdx].Score))
                        rankerIdx = k;

                // 선택된 점수가 이미 선택되어 포함된 유저의 점수인 경우
                if (RankersStatic.GameRankersArray[i].scores.Any(s => s.UserId == gameScores[rankerIdx].UserId)) {
                    gameScores.RemoveAt(rankerIdx);
                    j--;
                }
                else {
                    // 선택된 점수를 swap  
                    var temp = gameScores[rankerIdx];
                    gameScores[rankerIdx] = gameScores[j];
                    gameScores[j] = temp;

                    // 선택된 값 추가
                    RankersStatic.GameRankersArray[i].scores.AddLast(gameScores[j]);
                }
            }

            var rankedPlayers = RankersStatic.GameRankersArray[i].scores.ToList();
            for (int j = 0; j < rankedPlayers.Count; ++j)
                RankersStatic.GameRankersArray[i].rankedPlayers.Add(rankedPlayers[j].UserId, j + 1);

            _logger.LogInformation($"{RankersStatic.GameRankersArray[i].game.Title} 스코어 리스트 프린트 시작");
            foreach (var s in RankersStatic.GameRankersArray[i].scores)
                _logger.LogInformation($"{s.UserId} {s.Score}");
            _logger.LogInformation($"{RankersStatic.GameRankersArray[i].game.Title} 스코어 리스트 프린트 종료");
        }

        // 종합 순위 10명 계산
        UpdateTotalRankers();
    }

    public void UpdateTotalRankers() {
        var totalRankers = new Dictionary<string, int>();
        RankersStatic.TotalRankers!.rankedPlayers = totalRankers;

        for (int i = 0; i < RankersStatic.GameRankersArray!.Length; ++i) {
            var scores = RankersStatic.GameRankersArray[i].scores.ToList();
            for (int j = 0; j < scores.Count; ++j) {
                if (totalRankers.ContainsKey(scores[j].UserId)) {
                    totalRankers[scores[j].UserId] += 100 - j;
                }
                else
                    totalRankers.Add(scores[j].UserId, 100 - j);
            }
        }

        foreach (var keyVal in totalRankers) {
            var score = new ScoreHistory {
                UserId = keyVal.Key,
                Score = keyVal.Value
            };
            RankersStatic.TotalRankers.TryAdd(score, true);
        }
    }

    public async Task<bool> TryAddAsync(ScoreHistory scoreHistoryToAdd) {
        var game = await _gameRepository.GetAsync(scoreHistoryToAdd.GameId);
        var rankers = RankersStatic.GameRankersArray?.FirstOrDefault(r => r.game.Id == scoreHistoryToAdd.GameId);

        // 게임 점수 목록 업데이트 전 프린트
        _logger.LogInformation($"새로 입력된 스코어의 유저ID: {scoreHistoryToAdd.UserId} 점수: {scoreHistoryToAdd.Score} 게임타이틀: {game.Title}");
        _logger.LogInformation("게임 점수 목록 업데이트 전:");
        foreach (var score in rankers.scores)
            _logger.LogInformation($"{score.Score} {score.UserId}");

        // 게임 점수 추가
        var node = rankers!.TryAdd(scoreHistoryToAdd);
        bool addedToGameRankers = false;
        if (node is not null) {
            addedToGameRankers = true;
            await NotifyChangesAsync(node, rankers);
        }

        // 게임 점수 목록 업데이트 후 프린트
        _logger.LogInformation("게임 점수 목록 업데이트 후:");
        foreach (var score in rankers.scores)
            _logger.LogInformation($"{score.Score} {score.UserId}");

        // 종합 랭킹 업데이트
        UpdateTotalRankers();
        
        return addedToGameRankers;
    }

    public async Task<bool> NotifyChangesAsync(LinkedListNode<ScoreHistory> node, Rankers rankers) {
        var user = await _accountService.Get(node.Value.UserId);
        if (user is null) return false;

        var url = $"{_configuration["ClientUrls:ReactUrl"]!}";
        var body = $"<h3>{user.UserName}님이 {rankers.game.Title}에서 {node.Value.Score}점을 기록하여 순위 {rankers.rankedPlayers[node.Value.UserId]}등이 되었습니다!! 축하해주세요!</h3><br /><a href={url}>여기를 클릭하여 Flashback Arcade로 이동!!</a>";

        // 랭킹을 기록한 유저에게 알림
        if (await _emailService.SendFromServerAsync(user.Email!, "Flashback Arcade 랭킹 업데이트", body) is false)
            return false;

        // 랭킹 +-5 유저들에게 알림
        var prev = node.Previous;
        var next = node.Next;
        for (int i = 0; i < 5; ++i) {
            if (prev is null && next is null)
                break;

            if (prev is not null) {
                user = await _accountService.Get(prev.Value.UserId);
                if (user is null) return false;
                if (await _emailService.SendFromServerAsync(user.Email!, "Flashback Arcade 랭킹 업데이트 알림", body) is false)
                    return false;
                prev = node.Previous;
            }
            if (next is not null) {
                user = await _accountService.Get(next.Value.UserId);
                if (user is null) return false;
                if (await _emailService.SendFromServerAsync(user.Email!, "Flashback Arcade 랭킹 업데이트 알림", body) is false)
                    return false;
                next = node.Next;
            }
        }
        return true;
    }
}
