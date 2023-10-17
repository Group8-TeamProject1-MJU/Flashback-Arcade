using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.DbContexts {
    public class AccountDbContext : IdentityDbContext<IdentityUser> {
        public DbSet<IdentityUser> IdentityDbSet { get; set; }
        public AccountDbContext(DbContextOptions<AccountDbContext> dbContextOptions) : base(dbContextOptions) { }
    }
}
