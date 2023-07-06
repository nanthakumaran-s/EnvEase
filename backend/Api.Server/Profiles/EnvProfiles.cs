using Api.Server.Dto.Incoming;
using Api.Server.Models;
using AutoMapper;

namespace Api.Server.Profiles
{
    public class EnvProfiles: Profile
    {
        public EnvProfiles()
        {
            CreateMap<CreateEnvDto, EnvModel>();
        }
    }
}
