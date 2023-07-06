using Api.Server.Models;

namespace Api.Server.Repos.UserRepo
{
    public interface IUserRepo
    {
        // Users
        void CreateUser(UsersModel user);
        UsersModel? GetUser(string email);
        UsersModel? GetUser(int id);
        UsersModel? GetUser(int id, int enterpriseId);
        UsersModel? GetUser(string email, int enterpriseId);
        void UpdateUser(UsersModel user);
        IEnumerable<object> GetUsers(int enterpriseId);


        // Role
        RoleModel? GetRole(int id);


        // Common
        bool SaveChanges();
    }
}
