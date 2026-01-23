using Microsoft.EntityFrameworkCore;
using PCBuilder.DAL.Data;
using PCBuilder.DAL.Models;
using PCBuilder.DAL.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.Repositories.Classes
{
    public class ShopRepository : IShopRepository
    {
        private readonly ApplicationDbContext _context;

        public ShopRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task AddShopAsync(Shop shop)
        {
            await _context.Shops.AddAsync(shop);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteShopAsync(Guid shopId)
        {
            var shop = await _context.Shops.FindAsync(shopId);

            if (shop == null)
                throw new Exception("Shop not found");

            _context.Shops.Remove(shop);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Shop>> GetAllShopsAsync()
        {
            return await _context.Shops
            .AsNoTracking()
            .ToListAsync();
        }

        public async Task<Shop> GetShopByIdAsync(Guid shopId)
        {
            return await _context.Shops
           .AsNoTracking()
           .FirstOrDefaultAsync(s => s.Id == shopId);
        }

        public async Task AddRequestAsync(Shop request)
        {
            request.Status = ShopRequestStatus.Pending; 
            request.RequestedAt = DateTime.UtcNow;     

            await _context.Shops.AddAsync(request);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Shop>> GetPendingRequestsAsync()
        {
            return await _context.Shops
                .Where(r => r.Status == ShopRequestStatus.Pending)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Shop?> GetPendingRequestByIdAsync(Guid requestId)
        {
            return await _context.Shops
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == requestId && s.Status == ShopRequestStatus.Pending);
        }

        public async Task UpdateAsync(Shop request)
        {
            _context.Shops.Update(request);
            await _context.SaveChangesAsync();
        }
    }
}
