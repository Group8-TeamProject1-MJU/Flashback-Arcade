using Infrastructure.DbContexts;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class AccountRepository {
    private readonly IdentityDbContext _dbContext;

    public AccountRepository(
        IdentityDbContext dbContext
    ) {
        _dbContext = dbContext;
    }

    public async Task<IdentityUser> GetByEmailAsync(string email) {
        return (await _dbContext.IdentityDbSet.FirstOrDefaultAsync(user => user.Email == email))!;
    }
}
