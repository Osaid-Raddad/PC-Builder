using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PCBuilder.BLL.Services.Classes;
using PCBuilder.BLL.Services.Interfaces;
using PCBuilder.DAL.DTO.Requests;
using System.Security.Claims;

namespace PCBuilder.PL.Controllers
{
    [Route("api/[area]/[controller]")]
    [ApiController]
    [Area("Public")]
    [Authorize(Roles ="Admin,SuperAdmin,User,TechSupport")]
    public class PublicController : ControllerBase
    {
        private readonly IUserService _userservice;
        private readonly IShopService _shopService;
        private readonly IUpgradeUserRoleService _upgradeUserRoleService;
        private readonly IContactUsService _contactService;

        public PublicController(IUserService userservice, IShopService shopService,IUpgradeUserRoleService upgradeUserRoleService, IContactUsService contactService)
        {
            _userservice = userservice;
            _shopService = shopService;
            _upgradeUserRoleService = upgradeUserRoleService;
            _contactService = contactService;
        }

        
        [HttpGet("GetAllUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userservice.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("GetShops")]
        public async Task<IActionResult> GetAllShops()
        {
            var shops = await _shopService.GetAllShopsAsync(Request);
            return Ok(shops);
        }

        [Authorize(Roles = "User")]
        [HttpPost("upgrade-to-tech-support")]
        public async Task<IActionResult> RequestUpgrade([FromBody] UpgradeUserRoleRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            await _upgradeUserRoleService.CreateRequestAsync(userId, request);

            return Ok(new { message = "Request sent successfully" });
        }

        [AllowAnonymous]
        [HttpPost("ContactUs")]
        public async Task<IActionResult> Send([FromBody] ContactUsRequest request)
        {
            await _contactService.SendAsync(request);
            return Ok(new { message = "Message sent successfully" });
        }

    }
}
