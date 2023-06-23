using Api.Server.Dto.Incoming;
using Api.Server.Dto.Internal;
using Api.Server.Dto.Outgoing;
using Api.Server.Models;
using Api.Server.Repos.SessionRepo;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
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
        private readonly ISessionRepo _sessionRepo;

        public AuthController(IUserRepo userRepo, IMapper mapper, IBCryptUtils bCryptUtils, ISessionUtils sessionUtils, ISessionRepo sessionRepo) {
            _userRepo = userRepo;
            _mapper = mapper;
            _bcryptUtils = bCryptUtils;
            _sessionUtils = sessionUtils;
            _sessionRepo = sessionRepo;
        }

        [HttpPost("register"), Authorize(Roles = "Owner, Admin, Project Manager")]
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
            UsersModel user = _mapper.Map<UsersModel>(request);

            var hash = _bcryptUtils.HashPassword(request.Password, out var salt);
            user.Password_Hash = hash;
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
                
            var isMatch = _bcryptUtils.VerifyPassword(request.Password, repoUser.Password_Hash, repoUser.Salt);
            if (isMatch == false)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "Password doesn't match"
                });
            }
            if (repoUser.Two_Factor == true)
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

        [HttpPatch("revoke"), Authorize]
        public IActionResult RevokeRefreshToken(RevokeTokenDto request)
        {
            var user = _userRepo.GetUser(User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)!.Value);
            if (user == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "Invalid token"
                });
            }

            var session = _sessionRepo.GetSessionByToken(request.Token);
            if (session == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "Invalid session"
                });
            }

            if (user.Id != session.User_Id)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "Invalid token"
                });
            }

            session.Is_Revoked = true;
            _sessionRepo.UpdateSession(session);
            _sessionRepo.SaveChanges();

            return Ok(new {
                status = true,
                message = "Revoked session"
            });
        }

        [HttpPatch("revoke-all"), Authorize]
        public IActionResult RevokeAll()
        {
            var user = _userRepo.GetUser(User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)!.Value);
            if (user == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "Invalid token"
                });
            }

            var sessions = _sessionRepo.GetSessions(user.Id);

            foreach (var session in sessions)
            {
                session.Is_Revoked = true;
                _sessionRepo.UpdateSession(session);
            }

            _sessionRepo.SaveChanges();

            return Ok(new
            {
                status = true,
                message = "All sessions revoked"
            });
        }

        [HttpDelete("session"), Authorize]
        public IActionResult DeleteSession(RevokeTokenDto request) {
            var user = _userRepo.GetUser(User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)!.Value);
            if (user == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "Invalid token"
                });
            }

            SessionModel session = _sessionRepo.GetSessionByToken(request.Token)!;
            if (session == null)
            {
                return BadRequest(new { 
                    status = false,
                    message = "Invalid Token"
                });
            }

            if (user.Id != session.User_Id)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "Invalid token"
                });
            }

            _sessionRepo.DeleteSession(session);
            _sessionRepo.SaveChanges();
            return Ok(new { 
                status = true,
                message = "Session Deleted"
            });
        }

        [HttpPost("refresh-tokens"), AllowAnonymous]
        public IActionResult RefreshTokens(TokensDto request)
        {
            var principal = _sessionUtils.VerifyAndGetPrincipal(request.Access_Token);
            if (principal == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "Invalid tokens"
                });
            }

            var session = _sessionRepo.GetSessionByToken(request.Refresh_Token);
            if (session == null)
            {
                return BadRequest(new { 
                    status = false,
                    message = "Invalid tokens"
                });
            }

            var user = _userRepo.GetUserById(session.User_Id);
            if (user == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "Invalid tokens"
                });
            }

            if (session.Is_Revoked)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "Session revoked"
                });
            }

            if (principal.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti)?.Value != session.Jwt_Id)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "Invalid tokens"
                });
            }

            if (session.Expiry_Time <= DateTime.Now)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "Tokens expired"
                });
            }

            TokensDto newTokens = _sessionUtils.CreateTokens(user, false);

            session.Token = newTokens.Refresh_Token;
            session.Jwt_Id = _sessionUtils.VerifyAndGetPrincipal(newTokens.Access_Token)?.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Jti)?.Value!;

            _sessionRepo.UpdateSession(session);
            _sessionRepo.SaveChanges();

            return Ok(new
            {
                status = true,
                tokens = newTokens
               
            });
        } 
    }
}
