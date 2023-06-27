﻿using Api.Server.Dto.Incoming;
using Api.Server.Dto.Outgoing;
using Api.Server.Models;
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

        public AuthController(IUserRepo userRepo, IMapper mapper, IBCryptUtils bCryptUtils, ISessionUtils sessionUtils) {
            _userRepo = userRepo;
            _mapper = mapper;
            _bcryptUtils = bCryptUtils;
            _sessionUtils = sessionUtils;
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

            if (requestedBy.RoleId > request.RoleId) {
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
    }
}