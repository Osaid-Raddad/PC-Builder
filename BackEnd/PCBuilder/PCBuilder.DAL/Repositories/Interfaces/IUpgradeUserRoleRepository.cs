using PCBuilder.DAL.DTO.Requests;
using PCBuilder.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.Repositories.Interfaces
{
    public interface IUpgradeUserRoleRepository
    {
        Task<UpgradeUserRole?> GetPendingByUserIdAsync(string userId);
        Task<UpgradeUserRole?> GetByIdAsync(int id);
        Task AddAsync(UpgradeUserRole request);
        Task SaveChangesAsync();

        Task<List<UpgradeUserRole>> GetAllPendingAsync();

    }
}
