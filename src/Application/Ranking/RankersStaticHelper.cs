using Domain.Models;
using Infrastructure.Repositories;

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

        // 초기 배열 생성
        RankersStatic.GameRankersArray = new Rankers[games.Count];
        RankersStatic.TotalRankers = new Rankers(true);

        // 게임별 순위10 계산
        for (int i = 0; i < RankersStatic.GameRankersArray.Count(); ++i) {
            RankersStatic.GameRankersArray[i] = new Rankers(games[i].Descending, games[i]);

            for (int j = 0; j < 10; ++j) {
                int rankerIdx = scores.FindIndex(s => {
                    var game = _gameRepository.Get(s.GameId);
                    return game!.Title == RankersStatic.GameRankersArray[i].game.Title;
                });

                for (int k = rankerIdx + 1; k < scores.Count; ++k) {
                    var game = await _gameRepository.GetAsync(scores[k].GameId);
                    if (game!.Title != RankersStatic.GameRankersArray[i].game.Title)
                        continue;
                    if (!RankersStatic.GameRankersArray[i].Compare(scores[rankerIdx].Score, scores[k].Score))
                        rankerIdx = k;
                }

                RankersStatic.GameRankersArray[i].TryAdd(scores[rankerIdx]);
            }
        }

        // 종합 순위 10명 계산
        // TODO: 유저들의 종합점수를 구한 후,
        // TODO: RankerStatic.TotalRankers.TryAdd(score) 를 호출해서 새 노드를 추가한다
        // TODO: Rankers.TryAdd() 메소드는 10위 안에 들 수 있는 점수만 "알아서" 추가한다
        // TODO: 그래서 유저의 종합점수만
        
    }

    public async Task TryAddAsync(ScoreHistory scoreHistoryToAdd) {
        var game = await _gameRepository.GetAsync(scoreHistoryToAdd.GameId);
        var rankers = RankersStatic.GameRankersArray?.FirstOrDefault(r => r.game.Title == game!.Title);

        rankers?.TryAdd(scoreHistoryToAdd);
        RankersStatic.TotalRankers!.TryAdd(scoreHistoryToAdd);
    }
}
