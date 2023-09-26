using Domain.Models;
using Infrastructure.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace Application.Ranking;

public class RankersStaticHelper {
    private readonly GameRepository _gameRepository;
    private readonly ScoreRepository _scoreRepository;

    public RankersStaticHelper(
        GameRepository gameRepository,
        ScoreRepository scoreRepository
    ) {
        _gameRepository = gameRepository;
        _scoreRepository = scoreRepository;
    }

    public async Task Initialize() {
        var games = _gameRepository.GetAll();
        var scores = _scoreRepository.GetAll();

        RankersStatic.GameRankersArray = new Rankers[games.Count];
        for (int i = 0; i < RankersStatic.GameRankersArray.Count(); ++i) {
            RankersStatic.GameRankersArray[i] = new Rankers(games[i].Descending, games[i].Title);

            for (int j = 0; j < 10; ++j) {
                int rankerIdx = scores.FindIndex(s => {
                    var game = _gameRepository.Get(s.GameId);
                    return game!.Title == RankersStatic.GameRankersArray[i].gameTitle;
                });

                for (int k = rankerIdx + 1; k < scores.Count; ++k) {
                    var game = await _gameRepository.GetAsync(scores[k].GameId);
                    if (game!.Title != RankersStatic.GameRankersArray[i].gameTitle)
                        continue;
                    if (!RankersStatic.GameRankersArray[i].Compare(scores[rankerIdx].Score, scores[k].Score))
                        rankerIdx = k;
                }

                RankersStatic.GameRankersArray[i].Add(scores[rankerIdx]);
            }
        }

        RankersStatic.TotalRankers = new Rankers(true);
    }

    public async Task Add(ScoreHistory scoreHistoryToAdd) {
        var game = await _gameRepository.GetAsync(scoreHistoryToAdd.GameId);
        var rankers = RankersStatic.GameRankersArray?.FirstOrDefault(r => r.gameTitle == game!.Title);

        rankers?.Add(scoreHistoryToAdd);
        RankersStatic.TotalRankers!.Add(scoreHistoryToAdd);
    }
}
