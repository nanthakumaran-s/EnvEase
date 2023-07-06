using Api.Server.Dto.Incoming;
using Api.Server.Models;
using Api.Server.Repos.EnterpriseRepo;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnterpriseController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUserRepo _userRepo;
        private readonly IEnterpriseRepo _enterpriseRepo;
        private readonly IBCryptUtils _bCryptUtils;

        public EnterpriseController(IMapper mapper, IEnterpriseRepo enterpriseRepo, IUserRepo userRepo, IBCryptUtils bCryptUtils)
        {
            _mapper = mapper;
            _userRepo = userRepo;
            _enterpriseRepo = enterpriseRepo;
            _bCryptUtils = bCryptUtils;
        }

        [HttpPost, Authorize(Roles = "Super Admin")]
        public IActionResult AddEnterprise(AddEnterpriseDto request)
        {
            EnterpriseModel enterpriseModel = _mapper.Map<EnterpriseModel>(request);
            enterpriseModel.HashKey = _bCryptUtils.HashString(request.Name);
            _enterpriseRepo.AddEnterprise(enterpriseModel);
            _enterpriseRepo.SaveChanges();

            return Ok(new
            {
                status = true,
                message = "Enterprise created"
            });
        }

        [HttpGet, Authorize]
        public IActionResult GetEnterprise()
        {
            UsersModel? user = _userRepo.GetUser(User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)!.Value);
            if (user == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "Invalid tokens"
                });
            }

            EnterpriseModel? enterprise = _enterpriseRepo.GetEnterprise(user.EnterpriseId);
            if (enterprise == null)
            {
                return BadRequest(new {
                    status = false,
                    message = "No enterprise found"
                });
            }

            return Ok(new
            {
                status = true,
                enterprise,
            });
        }

        [HttpGet("members"), Authorize]
        public IActionResult GetMembers()
        {
            UsersModel? user = _userRepo.GetUser(User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)!.Value);
            if (user == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "Invalid tokens"
                });
            }

            EnterpriseModel? enterprise = _enterpriseRepo.GetEnterprise(user.EnterpriseId);
            if (enterprise == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "No enterprise found"
                });
            }

            return Ok(new
            {
                status = true,
                members = _userRepo.GetUsers(user.EnterpriseId)
            });
        }
    }
}
