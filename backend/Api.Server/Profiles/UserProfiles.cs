using Api.Server.Dto.Incoming;
using Api.Server.Dto.Outgoing;
using Api.Server.Models;
using AutoMapper;

namespace Api.Server.Profiles
{
    public class UserProfiles: Profile
    {
        public UserProfiles()
        {
            // Incoming
            CreateMap<RegisterDto, UsersModel>();

            // Outgoing
            CreateMap<UsersModel, AuthenticatedUser>();
            CreateMap<UsersModel, GetUserOutDto>();
        }
    }
}
