using Api.Server.Models;

namespace Api.Server.Repos.ProjectRepo
{
    public interface IProjectRepo
    {
        // Project Model
        void CreateProject(ProjectModel project);
        ProjectModel? GetProject(int id, int enterpriseId);
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
