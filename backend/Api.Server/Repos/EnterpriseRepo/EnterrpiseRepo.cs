using Api.Server.Data;
using Api.Server.Models;

namespace Api.Server.Repos.EnterpriseRepo
{
    public class EnterrpiseRepo: IEnterpriseRepo
    {
        private readonly ApplicationDbContext _dbContext;
        public EnterrpiseRepo(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void AddEnterprise(EnterpriseModel enterprise) {
            _dbContext.Enterprise.Add(enterprise);
        }
        
        public EnterpriseModel? GetEnterprise(int Id)
        {
            return _dbContext.Enterprise.Where(x => x.Id == Id).FirstOrDefault();
        }

        public void UpdateEnterprise(EnterpriseModel enterprise)
        {
            _dbContext.Enterprise.Update(enterprise);
        }

        public void DeleteEnterprise(EnterpriseModel enterprise)
        {
            _dbContext.Enterprise.Remove(enterprise);
        }

        public bool SaveChanges()
        {
            return (_dbContext.SaveChanges() >= 0);
        }
    }
}
