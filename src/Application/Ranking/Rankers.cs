using Domain.Models;

namespace Application.Ranking;

public class Rankers {
    private readonly LinkedList<ScoreHistory> _scores;
    public readonly bool descending;
    public readonly string gameTitle;

    public Rankers(
        bool descending,
        string gameTitle = default!
    ) {
        this.descending = descending;
        this.gameTitle = gameTitle;
        _scores = new();
    }

    public bool Compare(int a, int b) {
        return descending
            ? a > b
            : a < b;
    }

    /// <returns>
    /// true: 스코어가 순위10 안에 든다
    /// false: 스코어가 순위10 안에 안 든다
    ///</returns>
    public bool CheckTopTen(ScoreHistory newScoreHistory) {
        return (_scores.FirstOrDefault() is null) || Compare(newScoreHistory.Score, _scores.Last().Score);
    }

    // _scores에 새로운 랭커 삽입 및 꼴지 제거.
    // 삽입 후 정렬된 상태가 유지되어야 함
    public void TryAdd(ScoreHistory scoreHistoryToAdd) {
        // 전달된 객체가 순위에 들 수 없으면 리턴
        if (!CheckTopTen(scoreHistoryToAdd))
            return;

        // TODO: _scores변수에 정렬된 상태를 유지하면서 새로운 노드를 삽입!
        // TODO: 공동순위자들을 고려해야 하고 10명이 초과되어선 안 됨
        // TODO: 같은 유저가 중복으로 존재해서는 안됨
        // TODO: _descending이 true이면 내림차순으로, false이면 오름차순으로 정렬되어야 함
        // TODO: 그래서 가능하다면 이미 만들어둔 Compare 메소드를 쓰면 좋음
    }
}
