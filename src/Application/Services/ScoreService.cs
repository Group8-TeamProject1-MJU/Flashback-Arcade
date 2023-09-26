using Infrastructure.Repositories;

namespace Application.Services;

public class ScoreService {
    private readonly ScoreRepository _scoreRepository;
    
    public ScoreService(
        ScoreRepository scoreRepository
    ) {
        _scoreRepository = scoreRepository;
    }

    public void AddScore(int score) {

    }
}
