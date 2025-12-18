using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PCBuilder.BLL.Services.Interfaces;
using PCBuilder.DAL.DTO.Requests;
using System.Security.Claims;

namespace PCBuilder.PL.Areas.TechSupport.Controllers
{
    [Route("api/[area]/[controller]")]
    [ApiController]
    [Authorize]
    [Area("Profile")]
    public class TechProfileController : ControllerBase
    {
        private readonly IUserService _userService;

        public TechProfileController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var profile = await _userService.GetTechSupportProfileAsync(userId, Request);
            return Ok(profile);
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateProfile([FromForm] UpdateTechSupportProfileRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            await _userService.UpdateTechSupportProfileAsync(userId, request, Request);
            return Ok(new { message = "Updated Successfully" });
        }
    }
}
