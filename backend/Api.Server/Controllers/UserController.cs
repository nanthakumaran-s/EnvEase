using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Api.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        /*[HttpPost("map-user-with-enterprise"), Authorize(Roles = "Owner, Admin, HR, Project Manager")]
        public IActionResult MapUserWithEnterprise()
        {

        }*/
    }
}
