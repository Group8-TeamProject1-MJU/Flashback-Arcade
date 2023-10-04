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

                    // 해당 스코어가 더 높은 경우
                    if (RankersStatic.GameRankersArray[i].Compare(scores[k].Score, scores[rankerIdx].Score)) {
                        // 이미 같은 유저의 스코어가 있는지 확인
                        bool userExists = false;
                        foreach (var score in RankersStatic.GameRankersArray[i].scores) {
                            if (score.UserId == scores[k].UserId) {
                                userExists = true;
                                break;
                            }
                        }
                        if (!userExists)
                            rankerIdx = k;
                    }
                }

                // 선택된 점수를 swap
                var temp = scores[rankerIdx];
                scores[rankerIdx] = scores[j];
                scores[j] = temp;

                // 선택된 값 추가
                RankersStatic.GameRankersArray[i].scores.Append(scores[j]);
            }
        }

        // 종합 순위 10명 계산
        // TODO: 게임 랭킹에 오른 유저들만 종합점수를 구하고 종합 순위에 추가한다
    }

    public async Task TryAddAsync(ScoreHistory scoreHistoryToAdd) {
        var game = await _gameRepository.GetAsync(scoreHistoryToAdd.GameId);
        var rankers = RankersStatic.GameRankersArray?.FirstOrDefault(r => r.game.Title == game!.Title);

        rankers?.TryAdd(scoreHistoryToAdd);
        RankersStatic.TotalRankers!.TryAdd(scoreHistoryToAdd);
    }
}
