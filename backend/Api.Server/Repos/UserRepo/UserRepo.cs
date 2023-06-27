using Api.Server.Data;
using Api.Server.Models;

namespace Api.Server.Repos.UserRepo
{
    public class UserRepo : IUserRepo
    {
        private readonly ApplicationDbContext _dbContext;

        public UserRepo( ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void CreateUser(UsersModel user)
        {
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user));
            }

            _dbContext.Users.Add(user);
        }

        public UsersModel? GetUser(string email)
        {
            return _dbContext.Users.Where(u => u.Email == email).FirstOrDefault();
        }

        public UsersModel? GetUser(int id)
        {
            return _dbContext.Users.Where(u => u.Id == id).FirstOrDefault();
        }

        public UsersModel? GetUser(int id, int enterpriseId)
        {
            return _dbContext.Users.Where(u => u.Id == id && u.EnterpriseId == enterpriseId).FirstOrDefault();
        }

        public void UpdateUser(UsersModel user)
        {
            _dbContext.Users.Update(user);
        }

        public bool SaveChanges()
        {
            return (_dbContext.SaveChanges() >= 0);
        }
    }
}
