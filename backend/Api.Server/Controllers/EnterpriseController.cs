using Api.Server.Dto.Incoming;
using Api.Server.Models;
using Api.Server.Repos.EnterpriseRepo;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnterpriseController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IEnterpriseRepo _enterpriseRepo;

        public EnterpriseController(IMapper mapper, IEnterpriseRepo enterpriseRepo)
        {
            _mapper = mapper;
            _enterpriseRepo = enterpriseRepo;
        }

        [HttpPost, Authorize(Roles = "Super Admin")]
        public IActionResult AddEnterprise(AddEnterpriseDto request)
        {
            EnterpriseModel enterpriseModel = _mapper.Map<EnterpriseModel>(request);
            _enterpriseRepo.AddEnterprise(enterpriseModel);
            _enterpriseRepo.SaveChanges();

            return Ok(new
            {
                status = true,
                message = "Enterprise created"
            });
        }
    }
}
