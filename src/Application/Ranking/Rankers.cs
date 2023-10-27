using Domain.Models;

namespace Application.Ranking;

public class Rankers {
    public readonly LinkedList<ScoreHistory> scores;
    public readonly bool descending;
    public readonly Game game;

    public Rankers(
        bool descending,
        Game game = default!
    ) {
        this.descending = descending;
        this.game = game;
        scores = new();
    }

    public bool Compare(int a, int b) {
        return descending
            ? a >= b
            : a <= b;
    }

    public bool CheckSameGame(ScoreHistory scoreHistoryToAdd) {
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
    public void DeleteSameUser(ScoreHistory scoreHistoryToAdd) {
        LinkedListNode<ScoreHistory> currentNode = scores.First!;
        int pass = 1;

        while (currentNode != null) {
            if (currentNode.Value.UserId == scoreHistoryToAdd.UserId && Compare(scoreHistoryToAdd.Score, currentNode.Value.Score)) {
                if ((pass--) <= 0)
                    scores.Remove(currentNode);
            }

            currentNode = currentNode.Next!;
        }
    }

    // _scores에 새로운 랭커 삽입 및 꼴지 제거.
    // 삽입 후 정렬된 상태가 유지되어야 함
    public bool TryAdd(ScoreHistory scoreHistoryToAdd) {
        // 전달된 점수가 다른 종류의 게임 점수이면 리턴
        if (!CheckSameGame(scoreHistoryToAdd))
            return false;

        // 전달된 점수가 순위안에 들 수 있을만큼 높은 점수가 아니라면 리턴
        // if (!CheckTopTen(scoreHistoryToAdd))
        //     return false;

        LinkedListNode<ScoreHistory> currentNode = scores.First!;

        // scores가 비어있을 때 바로 추가
        if (currentNode is null) {
            scores.AddLast(scoreHistoryToAdd);
            return true;
        }

        // scores 변수에 정렬된 상태를 유지하면서 새로운 노드 삽입
        while (currentNode is not null) {
            if (Compare(scoreHistoryToAdd.Score, currentNode.Value.Score)) {
                scores.AddBefore(currentNode, scoreHistoryToAdd);
                DeleteSameUser(scoreHistoryToAdd);
                // 100명이 초과하면 삭제
                if (scores.Count > 100)
                    scores.RemoveLast();

                return true;
            }
            currentNode = currentNode.Next!;
        }

        if(scores.Count < 100){
            scores.AddLast(scoreHistoryToAdd);
            return true;
        }

        return false;
    }
}
