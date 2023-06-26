using Api.Server.Models;

namespace Api.Server.Repos.EnterpriseRepo
{
    public interface IEnterpriseRepo
    {
        void AddEnterprise(EnterpriseModel enterprise);
        EnterpriseModel? GetEnterprise(string name);
        void UpdateEnterprise(EnterpriseModel enterprise);
        void DeleteEnterprise(EnterpriseModel enterprise);
        bool SaveChanges();
    }
}
