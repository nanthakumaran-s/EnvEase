using Api.Server.Data;
using Api.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Server.Repos.SessionRepo
{
    public class SessionRepo : ISessionRepo
    {
        private readonly ApplicationDbContext _dbContext;

        public SessionRepo(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void CreateSession(SessionModel session)
        {
            if (session == null)
            {
                throw new ArgumentNullException(nameof(session));
            }

            _dbContext.Session.Add(session);
        }

        public SessionModel? GetSessionByToken(string token)
        {
            return _dbContext.Session.Where(x => x.Token == token).FirstOrDefault();
        }

        public void UpdateSession(SessionModel session)
        {
            _dbContext.Session.Update(session);
        }

        public IEnumerable<SessionModel> GetSessions(int user_id)
        {
            return _dbContext.Session.Where(x => x.User_Id == user_id).ToList();
        }

        public void DeleteSession(SessionModel session)
        {
            _dbContext.Remove(session);
        }

        public bool SaveChanges()
        {
            return (_dbContext.SaveChanges() >= 0);
        }
    }
}
