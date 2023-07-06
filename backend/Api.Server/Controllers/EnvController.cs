using Api.Server.Data;
using Api.Server.Dto.Incoming;
using Api.Server.Models;
using Api.Server.Repos.ProjectRepo;
using AutoMapper;
using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnvController: Controller
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly IUserRepo _userRepo;
        private readonly IProjectRepo _projectRepo;
        private readonly IBCryptUtils _bCryptUtils;

        public EnvController(ApplicationDbContext dbContext, IMapper mapper, IUserRepo userRepo, IProjectRepo projectRepo, IBCryptUtils bCryptUtils)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _projectRepo = projectRepo;
            _userRepo = userRepo;
            _bCryptUtils = bCryptUtils;
        }

        [HttpGet, Authorize]
        public IActionResult GetEnvs([FromQuery] GetEnvDto request)
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

            ProjectModel? projectModel = _projectRepo.GetProject(request.ProjectId, user.EnterpriseId);

            if (projectModel == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "No project found"
                });
            }

            List<EnvModel> envs = _dbContext.Env.Where(e => e.ProjectId == request.ProjectId && e.Type == request.Type).ToList();
            for(int i = 0; i < envs.Count(); i++)
            {
                envs[i].Value = _bCryptUtils.DecryptString(projectModel.ApiKey, envs[i].Value);
            }

            return Ok(new
            {
                status = true,
                envs
            });
        }

        [HttpPost, Authorize]
        public IActionResult PostEnvs(CreateEnvDto request)
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

            ProjectModel? projectModel = _projectRepo.GetProject(request.ProjectId, user.EnterpriseId);

            if (projectModel == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "No project found"
                });
            }

            //TODO: Get secure keyvault secret key and encrypt 

            EnvModel env = _mapper.Map<EnvModel>(request);
            env.Value = _bCryptUtils.EncryptString(projectModel.ApiKey, request.Value);
            _dbContext.Env.Add(env);
            _dbContext.SaveChanges();

            return Ok(new
            {
                status = true,
                message = "Env Added"
            });
        }

        [HttpPatch, Authorize]
        public IActionResult UpdateEnv(UpdateEnvDto request)
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

            EnvModel? env = _dbContext.Env.Where(e => e.Id == request.Id).FirstOrDefault();
            
            if (env == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "No env found"
                });
            }

            ProjectModel? projectModel = _projectRepo.GetProject(request.ProjectId, user.EnterpriseId);

            if (projectModel == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "No project found"
                });
            }

            env.Value = _bCryptUtils.EncryptString(projectModel.ApiKey, request.Value);
            _dbContext.Env.Update(env);
            _dbContext.SaveChanges();

            return Ok(new
            {
                status = true,
                message = "Env updated"
            });
        }

        [HttpDelete, Authorize]
        public IActionResult DeleteEnv(DeleteEnvDto request)
        {
            EnvModel? env = _dbContext.Env.Where(e => e.Id == request.Id).FirstOrDefault();

            if (env == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "No env found"
                });
            }

            _dbContext.Env.Remove(env);
            _dbContext.SaveChanges();

            return Ok(new
            {
                status = true,
                message = "Env Removed"
            });
        }
    }
}
