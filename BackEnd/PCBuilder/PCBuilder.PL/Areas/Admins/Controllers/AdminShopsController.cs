using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PCBuilder.BLL.Services.Classes;
using PCBuilder.BLL.Services.Interfaces;
using PCBuilder.DAL.DTO.Responses;
using PCBuilder.DAL.Repositories.Interfaces;

namespace PCBuilder.PL.Areas.Admins.Controllers
{
    [Route("api/[area]/[controller]")]
    [ApiController]
    [Area("Admins/Shop")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public class AdminShopsController : ControllerBase
    {

        private readonly IShopService _shopService;

        public AdminShopsController( IShopService shopService)
        {
            _shopService = shopService;  
        }

     
        [HttpGet("Pending")]
        public async Task<IActionResult> GetPendingShops()
        {
            var requests = await _shopService.GetPendingShopRequestsAsync();
            return Ok(requests);
        }

        [HttpPost("Approve/{id}")]
        public async Task<IActionResult> ApproveShop(Guid id)
        {
            await _shopService.ApproveRequestAsync(id);

            return Ok(new ShopResponse
            {
                Success = true,
                Message = "Shop approved successfully"
            });
        }

      
        [HttpPost("Reject/{id}")]
        public async Task<IActionResult> RejectShop(Guid id)
        {
            await _shopService.RejectRequestAsync(id);

            return Ok(new ShopResponse
            {
                Success = true,
                Message = "Shop request rejected"
            });
        }

        
        [HttpDelete("DeleteShop/{id}")]
        public async Task<IActionResult> DeleteShop(Guid id)
        {
            await _shopService.DeleteShopAsync(id);

            return Ok(new ShopResponse
            {
                Success = true,
                Message = "Shop deleted successfully"
            });
        }
       
        [HttpGet("GetShop/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetShopById(Guid id)
        {
            var shop = await _shopService.GetShopByIdAsync(id, Request);

            if (shop == null)
                return NotFound("Shop not found");

            return Ok(shop);
        }

        [HttpGet("GetShops")]
        public async Task<IActionResult> GetAllShops()
        {
            var shops = await _shopService.GetAllShopsAsync(Request);
            return Ok(shops);
        }

    }
}
