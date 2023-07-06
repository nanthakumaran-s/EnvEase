using Api.Server.Dto.Incoming;
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
        private readonly IBCryptUtils _bCryptUtils;

        public UserController(IMapper mapper, IUserRepo userRepo, IEnterpriseRepo enterpriseRepo, IBCryptUtils bCryptUtils)
        {
            _mapper = mapper;
            _userRepo = userRepo;
            _enterpriseRepo = enterpriseRepo;
            _bCryptUtils = bCryptUtils;
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

        [HttpPatch("two-factor"), Authorize]
        public IActionResult TwoFactor(TwoFactorDto request)
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

            user.TwoFactor = request.TwoFactor;

            _userRepo.UpdateUser(user);
            _userRepo.SaveChanges();

            return Ok(new
            {
                status = true,
                message = "Two Factor updated"
            });
        }

        [HttpPatch("change-password"), Authorize]
        public IActionResult Update(ChangePassDto request)
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

            var isMatch = _bCryptUtils.VerifyPassword(request.OldPassword, user.PasswordHash, user.Salt);
            if (isMatch == false)
            {
                return Ok(new
                {
                    status = false,
                    message = "Password doesn't match"
                });
            }

            var hash = _bCryptUtils.HashPassword(request.NewPassword, out var salt);
            user.PasswordHash = hash;
            user.Salt = Convert.ToHexString(salt);

            _userRepo.UpdateUser(user);
            _userRepo.SaveChanges();

            return Ok(new
            {
                status = true,
                message = "User updated"
            });
        }
    }
}
