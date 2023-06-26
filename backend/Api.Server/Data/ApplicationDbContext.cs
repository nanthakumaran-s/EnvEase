using Api.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Server.Data
{
    public class ApplicationDbContext: DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<UsersModel> Users { get; set; }
        public DbSet<EnterpriseModel> Enterprise { get; set; }
        public DbSet<ProjectModel> Project { get; set; }
        public DbSet<MapProjectUser> MapProjectUser { get; set; }
        public DbSet<RoleModel> Role { get; set; }
        public DbSet<AccessModel> Access { get; set; }
        public DbSet<SessionModel> Session { get; set; }

    }
}
