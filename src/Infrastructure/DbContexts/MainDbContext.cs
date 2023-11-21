using Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.DbContexts {
    public class MainDbContext : DbContext {
        public MainDbContext(DbContextOptions<MainDbContext> options) : base(options) { }

        public DbSet<Game> GameDbSet { get; set; }
        public DbSet<ScoreHistory> ScoreHistoryDbSet { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            base.OnModelCreating(modelBuilder);

            var gamesToSeed = new Game[] {
                new Game {
                    Id = 1,
                    Title = "Snake Game",
                    Descending = true
                },
                new Game {
                    Id = 2,
                    Title = "Tetris",
                    Descending = true
                },
                new Game {
                    Id = 3,
                    Title = "Ball Shooting",
                    Descending = true
                },
                new Game {
                    Id = 4,
                    Title = "Memory",
                    Descending = true
                },
                new Game {
                    Id = 5,
                    Title = "15 Puzzle",
                    Descending = false
                },
                new Game {
                    Id = 6,
                    Title = "Brick Breakout",
                    Descending = true
                },
                new Game {
                    Id = 7,
                    Title = "Mine Sweeper",
                    Descending = false
                },                
                new Game {
                    Id = 8,
                    Title = "Qucik Speed Master",
                    Descending = false
                }
            };

            modelBuilder.Entity<Game>().HasData(gamesToSeed);
        }
    }
}
