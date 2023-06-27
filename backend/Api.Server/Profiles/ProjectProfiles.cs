using Api.Server.Dto.Incoming;
using Api.Server.Models;
using AutoMapper;

namespace Api.Server.Profiles
{
    public class ProjectProfiles: Profile
    {
        public ProjectProfiles()
        {
            CreateMap<CreateProjectDto, ProjectModel>();

            CreateMap<AddMemberToProjectDto, MapProjectUser>();
            CreateMap<UpdateMemberDto, MapProjectUser>();
        }
    }
}
