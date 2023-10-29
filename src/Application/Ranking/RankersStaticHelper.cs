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

            System.Console.WriteLine($"{RankersStatic.GameRankersArray[i].game.Title} 스코어 리스트 프린트 시작");
            foreach (var s in RankersStatic.GameRankersArray[i].scores)
                System.Console.WriteLine($"{s.UserId} {s.Score}");
            System.Console.WriteLine($"{RankersStatic.GameRankersArray[i].game.Title} 스코어 리스트 프린트 종료");
        }

        // 종합 순위 10명 계산
        // TODO: 게임 랭킹에 오른 유저들만 종합점수를 구하고 종합 순위에 추가한다
    }

    public async Task<bool> TryAddAsync(ScoreHistory scoreHistoryToAdd) {
        var game = await _gameRepository.GetAsync(scoreHistoryToAdd.GameId);
        var rankers = RankersStatic.GameRankersArray?.FirstOrDefault(r => r.game.Id == scoreHistoryToAdd.GameId);

        System.Console.WriteLine($"새로 입력된 스코어의 유저ID: {scoreHistoryToAdd.UserId} 점수: {scoreHistoryToAdd.Score}");

        System.Console.WriteLine("게임 점수 목록 업데이트 전:");
        foreach (var score in rankers.scores)
            Console.WriteLine($"{score.Score} {score.UserId}");

        bool addedToGameRankers = rankers!.TryAdd(scoreHistoryToAdd);
        // bool addedToTotalRankers = RankersStatic.TotalRankers!.TryAdd(scoreHistoryToAdd);

        System.Console.WriteLine("게임 점수 목록 업데이트 후:");
        foreach (var score in rankers.scores)
            Console.WriteLine($"{score.Score} {score.UserId}");

        return addedToGameRankers;
    }
}
