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

    public async Task InitializeAsync() {
        var games = _gameRepository.GetAll();
        var scores = _scoreRepository.GetAll();

        // 초기 배열 생성
        RankersStatic.GameRankersArray = new Rankers[games.Count];
        RankersStatic.TotalRankers = new Rankers(true);

        // 게임별 TOP10 계산
        for (int i = 0; i < RankersStatic.GameRankersArray.Count(); ++i) {
            // 순위 배열 초기화
            RankersStatic.GameRankersArray[i] = new Rankers(games[i].Descending, games[i]);

            // 상위 10명 선택 정렬 시작
            for (int j = 0; j < 10 && j < scores.Count; ++j) {
                int rankerIdx = j;

                for (int k = j + 1; k < scores.Count; ++k) {
                    // 동일한 게임의 스코어인지 확인
                    var game = await _gameRepository.GetAsync(scores[k].GameId);
                    if (game!.Title != RankersStatic.GameRankersArray[i].game.Title)
                        continue;

                    // 해당 스코어가 더 높은 경우 선택
                    if (RankersStatic.GameRankersArray[i].Compare(scores[k].Score, scores[rankerIdx].Score))
                        rankerIdx = k;
                }

                var result = RankersStatic.GameRankersArray[i].TryAdd(scores[rankerIdx]);
                if (result is false)
                    break;

                // 선택된 점수를 swap
                var temp = scores[rankerIdx];
                scores[rankerIdx] = scores[j];
                scores[j] = temp;
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
