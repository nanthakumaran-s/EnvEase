using Api.Server.Models;

namespace Api.Server.Repos.UserRepo
{
    public interface IUserRepo
    {
        bool SaveChanges();
        void CreateUser(UsersModel user);
        UsersModel? GetUser(string email);
        UsersModel? GetUserById(int id);
        void UpdateUser(UsersModel user);
    }
}
