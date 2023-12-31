using Domain.Models;
using Infrastructure.DbContexts;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class GameRepository {
    private readonly MainDbContext _dbContext;

    public GameRepository(
        MainDbContext dbContext
    ) {
        _dbContext = dbContext;
    }

    public Game? Get(int id) {
        return _dbContext.GameDbSet.FirstOrDefault(game => game.Id == id);
    }

    public async Task<Game?> GetAsync(int id) {
        return await _dbContext.GameDbSet.FirstOrDefaultAsync(game => game.Id == id);
    }

    public async Task<Game?> GetByTitle(string title) {
        return await _dbContext.GameDbSet.FirstOrDefaultAsync(game => game.Title == title);
    }

    public List<Game> GetAll() {
        return _dbContext.GameDbSet.ToList();
    }
}
