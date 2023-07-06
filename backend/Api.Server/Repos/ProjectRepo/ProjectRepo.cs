using Api.Server.Data;
using Api.Server.Dto.Outgoing;
using Api.Server.Models;

namespace Api.Server.Repos.ProjectRepo
{
    public class ProjectRepo : IProjectRepo
    {
        private readonly ApplicationDbContext _dbContext;

        public ProjectRepo(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Project Model
        public void CreateProject(ProjectModel project, int userId)
        {
            _dbContext.Project.Add(project);
            _dbContext.SaveChanges();
            var projectCreated = _dbContext.Project.Where(p => p.ApiKey == project.ApiKey).FirstOrDefault();
            MapProjectUser mp = new()
            {
                UserId = userId,
                ProjectId = projectCreated!.Id,
                AccessId = 4
            };

            _dbContext.MapProjectUser.Add(mp);
        }

        public ProjectModel? GetProject(int id, int enterpriseId)
        {
            return _dbContext.Project.Where(p => p.Id == id && p.BelongsTo == enterpriseId).FirstOrDefault();
        }

        public IEnumerable<object> GetProjects(int UserId)
        {
            return _dbContext
                .MapProjectUser
                .Where(mp => mp.UserId == UserId)
                .Join(
                    _dbContext.Project,
                    (mp) => mp.ProjectId,
                    (p) => p.Id,
                    (mp, p) => new {
                        p.Id,
                        p.Name,
                        p.ApiKey,
                        mp.AccessId
                    }
                 )
                .Join(
                    _dbContext.Access,
                    (mp) => mp.AccessId,
                    (a) => a.Id,
                    (mp, a) => new
                    {
                        mp.Id,
                        mp.Name,
                        mp.ApiKey,
                        a.Access
                    }
                )
                .ToList();
        }

        public void UpdateProject(ProjectModel project)
        {
            _dbContext.Project.Update(project);
        }

        public void DeleteProject(ProjectModel project)
        {
            _dbContext.MapProjectUser.RemoveRange(_dbContext.MapProjectUser.Where(mp => mp.ProjectId == project.Id));
            _dbContext.Project.Remove(project);
        }


        // Map Project User Model
        public void AddMember(MapProjectUser mapProjectUser)
        {
            _dbContext.MapProjectUser.Add(mapProjectUser);
        }

        public MapProjectUser? GetMember(int UserId, int ProjectId) 
        {
            return _dbContext.MapProjectUser.Where(mp => mp.UserId == UserId &&  mp.ProjectId == ProjectId).FirstOrDefault();
        }

        public IEnumerable<object> GetMembers(int ProjectId)
        {
            return _dbContext
                .MapProjectUser
                .Where(mp => mp.ProjectId == ProjectId)
                .Join(
                    _dbContext.Users,
                    mp => mp.UserId,
                    u => u.Id,
                    (mp, u) => new
                    {
                        u.Id,
                        u.Name,
                        u.Email,
                        mp.AccessId
                    }
                )
                .Join(
                    _dbContext.Access,
                    mp => mp.AccessId,
                    a => a.Id,
                    (mp, a) => new
                    {
                        mp.Id,
                        mp.Name,
                        mp.Email,
                        a.Access,
                    }
                )
                .ToList();
        }

        public void UpdateMember(MapProjectUser mapProjectUser)
        {
            _dbContext.MapProjectUser.Update(mapProjectUser);
        }

        public void DeleteMember(MapProjectUser mapProjectUser)
        {
            _dbContext.MapProjectUser.Remove(mapProjectUser);
        }


        // Common
        public bool SaveChanges()
        {
            return (_dbContext.SaveChanges() > 0);
        }
    }
}
