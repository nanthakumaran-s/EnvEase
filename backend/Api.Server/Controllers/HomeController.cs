using Microsoft.AspNetCore.Mvc;

namespace Api.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : Controller
    {
        [HttpGet]
        public ActionResult Hi()
        {
            return Ok("Response hit");
        }
    }
}
