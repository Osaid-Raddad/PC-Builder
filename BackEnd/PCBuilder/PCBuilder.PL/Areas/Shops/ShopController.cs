using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PCBuilder.BLL.Services.Interfaces;
using PCBuilder.DAL.DTO.Requests;
using PCBuilder.DAL.DTO.Responses;
using PCBuilder.DAL.Models;

namespace PCBuilder.PL.Areas.Shops
{
    [Route("api/[area]/[controller]")]
    [ApiController]
    [Area("Shops")]
    [Authorize]
    public class ShopController : ControllerBase
    {
        private readonly IShopService _shopService;

        public ShopController(IShopService shopService)
        {
            _shopService = shopService;
        }


      
        [HttpPost("Request")]
        public async Task<IActionResult> SubmitShopRequest([FromForm] ShopRequest request)
        {

            await _shopService.SubmitShopRequestAsync(request);

            return Ok(new ShopResponse
            {
                Success = true,
                Message = "The request has been submitted and is awaiting admin approval."
            });
        }

        
       
    }
}
