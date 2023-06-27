using Api.Server.Models;

namespace Api.Server.Repos.EnterpriseRepo
{
    public interface IEnterpriseRepo
    {
        void AddEnterprise(EnterpriseModel enterprise);
        EnterpriseModel? GetEnterprise(int Id);
        void UpdateEnterprise(EnterpriseModel enterprise);
        void DeleteEnterprise(EnterpriseModel enterprise);
        bool SaveChanges();
    }
}
