using Api.Server.Dto.Outgoing;
using Api.Server.Models;
using Api.Server.Repos.EnterpriseRepo;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IEnterpriseRepo _enterpriseRepo;
        private readonly IUserRepo _userRepo;

        public UserController(IMapper mapper, IUserRepo userRepo, IEnterpriseRepo enterpriseRepo)
        {
            _mapper = mapper;
            _userRepo = userRepo;
            _enterpriseRepo = enterpriseRepo;
        }

        [HttpGet, Authorize]
        public IActionResult GetUser()
        {
            UsersModel? user = _userRepo.GetUser(User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)!.Value);

            if (user == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "Invalid token"
                });
            }

            GetUserOutDto userOut = _mapper.Map<GetUserOutDto>(user);
            userOut.Enterprise = _enterpriseRepo.GetEnterprise(user.EnterpriseId)!;
            userOut.Role = _userRepo.GetRole(user.RoleId)!;

            return Ok(new
            {
                status = true,
                user = userOut
            });
        }
    }
}
