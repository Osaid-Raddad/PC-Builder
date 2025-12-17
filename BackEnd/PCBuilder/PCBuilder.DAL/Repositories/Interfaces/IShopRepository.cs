using PCBuilder.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.Repositories.Interfaces
{
    public interface IShopRepository
    {
        Task<List<Shop>> GetAllShopsAsync();

        Task<Shop> GetShopByIdAsync(Guid shopId);

        Task AddShopAsync(Shop shop);
        Task DeleteShopAsync(Guid shopId);

        Task AddRequestAsync(Shop request);
        Task<List<Shop>> GetPendingRequestsAsync();

        Task<Shop?> GetPendingRequestByIdAsync(Guid requestId);

        Task UpdateAsync(Shop request);
    }
}
