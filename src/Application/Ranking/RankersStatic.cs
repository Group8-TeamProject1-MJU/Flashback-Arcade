namespace Application.Ranking;

static public class RankersStatic {
    static public readonly Mutex Mutex = new Mutex();
    static public Rankers[]? GameRankersArray;
    static public Rankers? TotalRankers;
}
