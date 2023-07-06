using Api.Server.Models;

namespace Api.Server.Repos.ProjectRepo
{
    public interface IProjectRepo
    {
        // Project Model
        void CreateProject(ProjectModel project, int userId);
        ProjectModel? GetProject(int id, int enterpriseId);
        IEnumerable<object> GetProjects(int userId);
        void UpdateProject(ProjectModel project);
        void DeleteProject(ProjectModel project);



        // Map Project User Model
        void AddMember(MapProjectUser mapProjectUser);
        MapProjectUser? GetMember(int UserId, int ProjectId);
        IEnumerable<object> GetMembers(int ProjectId);
        void UpdateMember(MapProjectUser mapProjectUser);
        void DeleteMember(MapProjectUser mapProjectUser);



        // Common
        bool SaveChanges();
    }
}
