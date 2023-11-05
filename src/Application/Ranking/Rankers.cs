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

            // 종합랭킹에 추가 중이 아닌 경우 유저 랭크를 저장하는 HashMap을 업데이트. 종합랭킹은 이 함수에서 HashMap 내용을 업데이트 하지 않음
            if (!isTotalRankers)
                rankedPlayers.Add(scoreHistoryToAdd.UserId, 1);

            return scores.Last;
        }

        // scores 변수에 정렬된 상태를 유지하면서 새로운 노드 삽입
        while (currentNode is not null) {
            // 새 점수가 현재노드 점수보다 높은 경우
            if (Compare(scoreHistoryToAdd.Score, currentNode.Value.Score)) {
                // 현재 노드 앞에 새 점수 추가
                scores.AddBefore(currentNode, scoreHistoryToAdd);

                // 동일 유저의 점수가 존재하면 삭제
                DeleteSameUser(currentNode, scoreHistoryToAdd);

                // 점수가 100개 이상이면 가장 마지막 꼴찌 노드 삭제
                if (scores.Count > 100)
                    scores.RemoveLast();

                // 방금 추가된 노드 (점수)
                var addedNode = currentNode.Previous;

                // 종합랭킹에 추가 중이 아닌 경우 유저 랭크를 저장하는 HashMap을 업데이트. 종합랭킹은 이 함수에서 HashMap 내용을 업데이트 하지 않음
                if (!isTotalRankers) {
                    // 방금 추가한 점수의 랭크를 계산
                    var rank = scores.ToList().IndexOf(scoreHistoryToAdd) + 1;

                    // HashMap에 새 점수를 등록한 유저의 랭크를 업데이트
                    if (rankedPlayers.ContainsKey(scoreHistoryToAdd.UserId))
                        rankedPlayers[scoreHistoryToAdd.UserId] = rank;
                    else rankedPlayers.Add(scoreHistoryToAdd.UserId, rank);

                    // 추가된 점수 밑에 위치하는 랭커들의 정보를 HashMap에서 업데이트
                    while (currentNode is not null) {
                        rankedPlayers[currentNode.Value.UserId] = ++rank;
                        currentNode = currentNode.Next!;
                    }
                }

                return addedNode;
            }

            // 어떤 유저의 새 점수가 이미 랭커로 등록된 점수보다 낮은 경우
            else if (scoreHistoryToAdd.UserId == currentNode.Value.UserId)
                return null;

            else currentNode = currentNode.Next!;
        }

        // 랭커에 오른 점수들보다 높지 않고, 랭커에 등록된 점수들이 100개 미만인 경우
        if (scores.Count < 100) {
            scores.AddLast(scoreHistoryToAdd);

            // 종합랭킹에 추가 중이 아닌 경우 유저 랭크를 저장하는 HashMap을 업데이트. 종합랭킹은 이 함수에서 HashMap 내용을 업데이트 하지 않음
            if (!isTotalRankers)
                rankedPlayers.Add(scoreHistoryToAdd.UserId, scores.Count);

            return scores.Last;
        }

        return null;
    }
}
