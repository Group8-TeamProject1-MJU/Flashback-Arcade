using Domain.Models;

namespace Application.Ranking;

public class Rankers {
    public readonly LinkedList<ScoreHistory> scores;
    public Dictionary<string, int> rankedPlayers;
    public readonly bool descending;
    public readonly Game game;

    public Rankers(
        bool descending,
        Game game = default!
    ) {
        this.descending = descending;
        this.game = game;
        this.rankedPlayers = new();
        scores = new();
    }

    public bool Compare(int a, int b) {
        return descending
            ? a >= b
            : a <= b;
    }

    public bool CheckSameGame(ScoreHistory scoreHistoryToAdd) {
        if (game is null) return true;
        return scoreHistoryToAdd.GameId == game.Id;
    }

    /// <returns>
    /// true: 스코어가 순위 안에 들 수 있다
    /// false: 스코어가 순위 안에 들 수 없다
    ///</returns>
    // public bool CheckTopTen(ScoreHistory newScoreHistory) {
    //     return scores.FirstOrDefault() is null || Compare(newScoreHistory.Score, scores.Last().Score);
    // }

    // 같은 유저가 중복으로 존재할경우 삭제
    public void DeleteSameUser(LinkedListNode<ScoreHistory> currentNode, ScoreHistory scoreHistoryToAdd) {
        while (currentNode != null) {
            if (currentNode.Value.UserId == scoreHistoryToAdd.UserId)
                scores.Remove(currentNode);
            currentNode = currentNode.Next!;
        }
    }

    // _scores에 새로운 랭커 삽입 및 꼴지 제거.
    // 삽입 후 정렬된 상태가 유지되어야 함
    public LinkedListNode<ScoreHistory>? TryAdd(ScoreHistory scoreHistoryToAdd, bool isTotalRankers = false) {
        // 전달된 점수가 다른 종류의 게임 점수이면 리턴
        if (!CheckSameGame(scoreHistoryToAdd))
            return null;

        LinkedListNode<ScoreHistory> currentNode = scores.First!;

        // scores가 비어있을 때 바로 추가
        if (currentNode is null) {
            scores.AddLast(scoreHistoryToAdd);
            if (!isTotalRankers)
                rankedPlayers.Add(scoreHistoryToAdd.UserId, 1);
            return scores.Last;
        }

        // scores 변수에 정렬된 상태를 유지하면서 새로운 노드 삽입
        while (currentNode is not null) {
            if (Compare(scoreHistoryToAdd.Score, currentNode.Value.Score)) {
                scores.AddBefore(currentNode, scoreHistoryToAdd);
                if (!isTotalRankers) {
                    if (rankedPlayers.ContainsKey(scores.Last!.Value.UserId))
                        rankedPlayers[scores.Last!.Value.UserId] = scoreHistoryToAdd.Score;
                    else rankedPlayers.Add(scores.Last!.Value.UserId, scoreHistoryToAdd.Score);
                }
                DeleteSameUser(currentNode, scoreHistoryToAdd);
                if (scores.Count > 100) {
                    scores.RemoveLast();
                }

                return currentNode.Previous;
            }
            if (scoreHistoryToAdd.UserId == currentNode.Value.UserId)
                return null;

            currentNode = currentNode.Next!;
        }

        if (scores.Count < 100) {
            scores.AddLast(scoreHistoryToAdd);
            if (!isTotalRankers)
                rankedPlayers.Add(scoreHistoryToAdd.UserId, 1);

            return scores.Last;
        }

        return null;
    }
}
