using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.DbContexts {
    public class IdentityDbContext : IdentityDbContext<IdentityUser> {
        public DbSet<IdentityUser> IdentityDbSet { get; set; }
        public IdentityDbContext(DbContextOptions<IdentityDbContext> dbContextOptions) : base(dbContextOptions) { }
    }
}
