using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PCBuilder.BLL.Services.Classes;
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
        private readonly IShopService _shopService;

        public PublicController(IUserService userservice, IShopService shopService)
        {
            _userservice = userservice;
            _shopService = shopService;
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

    }
}
