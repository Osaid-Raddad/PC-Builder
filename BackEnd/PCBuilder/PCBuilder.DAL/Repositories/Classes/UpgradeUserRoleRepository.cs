using Microsoft.EntityFrameworkCore;
using PCBuilder.DAL.Data;
using PCBuilder.DAL.DTO.Requests;
using PCBuilder.DAL.Models;
using PCBuilder.DAL.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.Repositories.Classes
{
    public class UpgradeUserRoleRepository : IUpgradeUserRoleRepository
    {


        private readonly ApplicationDbContext _context;

        public UpgradeUserRoleRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(UpgradeUserRole request)
        {
            await _context.UpgradeUserRoles.AddAsync(request);
        }

        public async Task<UpgradeUserRole?> GetByIdAsync(int id)
        {
            return await _context.UpgradeUserRoles
           .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<UpgradeUserRole?> GetPendingByUserIdAsync(string userId)
        {
            return await _context.UpgradeUserRoles
          .FirstOrDefaultAsync(x =>
              x.UserId == userId &&
              x.IsApproved == null);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
