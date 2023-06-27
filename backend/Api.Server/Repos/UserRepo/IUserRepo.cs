using Api.Server.Models;

namespace Api.Server.Repos.UserRepo
{
    public interface IUserRepo
    {
        bool SaveChanges();
        void CreateUser(UsersModel user);
        UsersModel? GetUser(string email);
        UsersModel? GetUser(int id);
        UsersModel? GetUser(int id, int enterpriseId);
        void UpdateUser(UsersModel user);
    }
}
