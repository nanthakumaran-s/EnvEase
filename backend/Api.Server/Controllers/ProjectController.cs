using Api.Server.Dto.Incoming;
using Api.Server.Dto.Internal;
using Api.Server.Models;
using Api.Server.Repos.ProjectRepo;
using AutoMapper;
using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Api.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUserRepo _userRepo;
        private readonly IBCryptUtils _bCryptUtils;
        private readonly IProjectRepo _projectRepo;

        public ProjectController(IMapper mapper, IUserRepo userRepo, IBCryptUtils bCryptUtils, IProjectRepo projectRepo)
        {
            _mapper = mapper;
            _userRepo = userRepo;
            _bCryptUtils = bCryptUtils;
            _projectRepo = projectRepo;
        }

        [HttpPost, Authorize(Roles = "Owner, Admin, Project Manager")]
        public IActionResult CreateProject(CreateProjectDto request)
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

            ProjectModel projectModel = _mapper.Map<ProjectModel>(request);

            ProjectTokensDto tokens = _bCryptUtils.CreateApiKeys(request.Name);
            projectModel.ApiKey = tokens.ApiKey;
            projectModel.BelongsTo = user.EnterpriseId;

            _projectRepo.CreateProject(projectModel, user.Id);
            _projectRepo.SaveChanges();

            return Ok(new
            {
                status = true,
                message = "Created project",
                tokens,
            });
        }

        [HttpGet, Authorize(Roles = "Owner, Admin, Project Manager, Employee")]
        public IActionResult GetProject(GetMembersDto request)
        {
            UsersModel? requestedUser = _userRepo.GetUser(User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)!.Value);
            if (requestedUser == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "Invalid token"
                });
            }

            ProjectModel? project = _projectRepo.GetProject(request.ProjectId, requestedUser.EnterpriseId);
            if (project == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "No project exist"
                });
            }

            return Ok(new
            {
                status = true,
                project
            });
        }

        [HttpGet("projects"), Authorize(Roles = "Owner, Admin, Project Manager, Employee")]
        public IActionResult GetProjects()
        {
            UsersModel? requestedUser = _userRepo.GetUser(User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)!.Value);
            if (requestedUser == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "Invalid token"
                });
            }

            return Ok(new
            {
                status = true,
                projects = _projectRepo.GetProjects(requestedUser.Id)
            }) ;
        }

        [HttpPatch, Authorize(Roles = "Owner, Admin, Project Manager")]
        public IActionResult UpdateProject(UpdateProjectDto request)
        {
            UsersModel? requestedUser = _userRepo.GetUser(User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)!.Value);
            if (requestedUser == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "Invalid token"
                });
            }

            ProjectModel? project = _projectRepo.GetProject(request.ProjectId, requestedUser.EnterpriseId);
            if (project == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "No project exist"
                });
            }

            project.Name = request.Name;
            _projectRepo.UpdateProject(project);
            _projectRepo.SaveChanges();

            return Ok(new
            {
                status = true,
                project
            });
        }

        [HttpDelete, Authorize(Roles = "Owner, Admin, Project Manager")]
        public IActionResult DeleteProject(GetMembersDto request)
        {
            UsersModel? requestedUser = _userRepo.GetUser(User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)!.Value);
            if (requestedUser == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "Invalid token"
                });
            }

            ProjectModel? project = _projectRepo.GetProject(request.ProjectId, requestedUser.EnterpriseId);
            if (project == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "No project exist"
                });
            }

            _projectRepo.DeleteProject(project);
            _projectRepo.SaveChanges();

            return Ok(new
            {
                status = true,
                message = "Project deleted"
            });
        }

        [HttpPost("member"), Authorize(Roles = "Owner, Admin, Project Manager")]
        public IActionResult AddMember(AddMemberToProjectDto request)
        {
            UsersModel? requestedUser = _userRepo.GetUser(User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)!.Value);
            if (requestedUser == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "Invalid token"
                });
            }

            UsersModel? addingMember = _userRepo.GetUser(request.Email, requestedUser.EnterpriseId);
            if (addingMember == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "No user found"
                });
            }

            ProjectModel? project = _projectRepo.GetProject(request.ProjectId, requestedUser.EnterpriseId);
            if (project == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "No project exist"
                });
            }

            MapProjectUser? mp = _projectRepo.GetMember(addingMember.Id, request.ProjectId);
            if (mp != null)
            {
                return BadRequest(new { 
                    status = false,
                    message = "User already mapped"
                });
            }

            MapProjectUser memberToAdd = new()
            {
                AccessId = request.AccessId,
                ProjectId = request.ProjectId,
                UserId = addingMember.Id,
            };
            _projectRepo.AddMember(memberToAdd);
            _projectRepo.SaveChanges();

            return Ok(new
            {
                status = true,
                message = "User added"
            });
        }

        [HttpPatch("member"), Authorize(Roles = "Owner, Admin, HR, Project Manager")]
        public IActionResult UpdateMember(UpdateMemberDto request)
        {
            UsersModel? requestedUser = _userRepo.GetUser(User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)!.Value);
            if (requestedUser == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "Invalid token"
                });
            }

            ProjectModel? project = _projectRepo.GetProject(request.ProjectId, requestedUser.EnterpriseId);
            if (project == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "No project exist"
                });
            }

            MapProjectUser? mappedUser = _projectRepo.GetMember(request.UserId, request.ProjectId);
            if (mappedUser == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "No user found"
                });
            }

            mappedUser.AccessId = request.AccessId;
            _projectRepo.UpdateMember(mappedUser);
            _projectRepo.SaveChanges();

            return Ok(new
            {
                status = true,
                message = "User updated"
            });
        }

        [HttpGet("members"), Authorize]
        public IActionResult GetMembers([FromQuery] GetMembersDto request)
        {
            UsersModel? requestedUser = _userRepo.GetUser(User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)!.Value);
            if (requestedUser == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "Invalid token"
                });
            }

            ProjectModel? project = _projectRepo.GetProject(request.ProjectId, requestedUser.EnterpriseId);
            if (project == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "No project exist"
                });
            }

            return Ok(new
            {
                status = true,
                members = _projectRepo.GetMembers(request.ProjectId),
            });
        }

        [HttpDelete("member"), Authorize(Roles = "Owner, Admin, Project Manager")]
        public IActionResult DeleteMember(DeleteMemberDto request)
        {
            UsersModel? requestedUser = _userRepo.GetUser(User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)!.Value);
            if (requestedUser == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "Invalid token"
                });
            }

            ProjectModel? project = _projectRepo.GetProject(request.ProjectId, requestedUser.EnterpriseId);
            if (project == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "No project exist"
                });
            }

            MapProjectUser? mappedUser = _projectRepo.GetMember(request.UserId, request.ProjectId);
            if (mappedUser == null)
            {
                return BadRequest(new
                {
                    status = false,
                    message = "No user exist"
                });
            }

            _projectRepo.DeleteMember(mappedUser);
            _projectRepo.SaveChanges();

            return Ok(new
            {
                status = true,
                message = "User removed"
            });
        }
    }
}
