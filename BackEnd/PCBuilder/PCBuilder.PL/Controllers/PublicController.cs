using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PCBuilder.BLL.Services.Interfaces;

namespace PCBuilder.PL.Controllers
{
    [Route("api/[area]/[controller]")]
    [ApiController]
    [Area("Public")]
    [Authorize(Roles ="Admin,SuperAdmin,User,TechSupport")]
    public class PublicController : ControllerBase
    {
        private readonly IUserService _userservice;

        public PublicController(IUserService userservice)
        {
            _userservice = userservice;
        }

        
        [HttpGet("GetAllUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userservice.GetAllUsersAsync();
            return Ok(users);
        }
    }
}
