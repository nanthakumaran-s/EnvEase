using Api.Server.Data;
using Api.Server.Dto.Incoming;
using Api.Server.Dto.Outgoing;
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
    public class AuthController : Controller
    {
        private readonly IUserRepo _userRepo;
        private readonly IMapper _mapper;
        private readonly IBCryptUtils _bcryptUtils;
        private readonly ISessionUtils _sessionUtils;
        private readonly ApplicationDbContext _dbContext;
        private readonly IEnterpriseRepo _enterpriseRepo;

        public AuthController(IUserRepo userRepo, IMapper mapper, IBCryptUtils bCryptUtils, ISessionUtils sessionUtils, ApplicationDbContext dbContext, IEnterpriseRepo enterpriseRepo) {
            _userRepo = userRepo;
            _mapper = mapper;
            _bcryptUtils = bCryptUtils;
            _sessionUtils = sessionUtils;
            _dbContext = dbContext;
            _enterpriseRepo = enterpriseRepo;
        }

        [HttpPost("register"), Authorize(Roles = "Super Admin, Owner, Admin, HR, Project Manager")]
        public IActionResult Register(RegisterDto request)
        {
            UsersModel? repoUser = _userRepo.GetUser(request.Email);
            if (repoUser != null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "User already exists"
                });
            }
            UsersModel? requestedBy = _userRepo.GetUser(User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)!.Value);
            if (requestedBy == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "Invalid user according to token"
                });
            }

            if (requestedBy.RoleId >= request.RoleId) {
                return BadRequest(new
                {
                    status = false,
                    message = "Out of scope"
                });
            }

            UsersModel user = _mapper.Map<UsersModel>(request);

            var hash = _bcryptUtils.HashPassword(request.Password, out var salt);
            user.PasswordHash = hash;
            user.Salt = Convert.ToHexString(salt);

            _userRepo.CreateUser(user);
            _userRepo.SaveChanges();

            return Ok(new
            {
                status = true,
                message = "User created"
            });
        }

        [HttpPost("login"), AllowAnonymous]
        public IActionResult Login(LoginDto request)
        {
            UsersModel? repoUser = _userRepo.GetUser(request.Email);
            if (repoUser == null) {
                return BadRequest(new { 
                    status = false,
                    message = "No user found with this email"
                });
            }
                
            var isMatch = _bcryptUtils.VerifyPassword(request.Password, repoUser.PasswordHash, repoUser.Salt);
            if (isMatch == false)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "Password doesn't match"
                });
            }
            if (repoUser.TwoFactor == true)
            {
                // TODO
            }

            AuthenticatedUser authenticatedUser = _mapper.Map<AuthenticatedUser>(repoUser);
            authenticatedUser.Tokens = _sessionUtils.CreateTokens(repoUser, true, request);
            return Ok(new
            {
                status = true,
                message = "Authenticated",
                user = authenticatedUser
            });
        }

        [HttpDelete, Authorize]
        public IActionResult DeleteUser(DeleteUserDto request)
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

            UsersModel? userToDelete = _userRepo.GetUser(request.Id);
            if (userToDelete == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "Invalid user id"
                });
            }

            if (user.EnterpriseId != userToDelete.EnterpriseId || user.RoleId >= userToDelete.RoleId)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "Out of scope"
                });
            }

            _dbContext.Users.Remove(userToDelete);
            _dbContext.Session.RemoveRange(_dbContext.Session.Where(s => s.UserId == request.Id));
            _dbContext.MapProjectUser.RemoveRange(_dbContext.MapProjectUser.Where(mp => mp.UserId == request.Id));
            _dbContext.SaveChanges();

            return Ok(new
            {
                status = true,
                message = "User removed"
            });
        }
    }
}
