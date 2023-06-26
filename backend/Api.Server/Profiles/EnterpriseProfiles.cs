using Api.Server.Dto.Incoming;
using Api.Server.Models;
using AutoMapper;

namespace Api.Server.Profiles
{
    public class EnterpriseProfiles: Profile
    {
        public EnterpriseProfiles()
        {
            CreateMap<AddEnterpriseDto, EnterpriseModel>();
        }
    }
}
