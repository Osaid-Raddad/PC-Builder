using Microsoft.AspNetCore.Http;
using PCBuilder.DAL.DTO.Requests;
using PCBuilder.DAL.DTO.Responses;
using PCBuilder.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.BLL.Services.Interfaces
{
    public interface IShopService
    {
        Task SubmitShopRequestAsync(ShopRequest request);
        Task ApproveRequestAsync(Guid requestId);
        Task RejectRequestAsync(Guid requestId);

        Task <List<Shop>> GetPendingShopRequestsAsync();

        Task<List<ShopResponseDto>> GetAllShopsAsync(HttpRequest httpRequest);
        Task<ShopResponseDto> GetShopByIdAsync(Guid shopId, HttpRequest request);
        Task<ShopResponse> DeleteShopAsync(Guid shopId);
    }
}
