using Api.Server.Models;

namespace Api.Server.Repos.SessionRepo
{
    public interface ISessionRepo
    {
        void CreateSession(SessionModel session);
        SessionModel? GetSessionByToken(string token);
        void UpdateSession(SessionModel session);
        IEnumerable<SessionModel> GetSessions(int user_id);
        void DeleteSession(SessionModel session);
        bool SaveChanges();
    }
}
