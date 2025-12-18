using PCBuilder.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<List<ApplicationUser>> GetAllUsersAsync();
        Task<ApplicationUser> GetUserByIdAsync(string id);
        Task<bool> BlockUserAsync(string id, int days);
        Task<bool> UnblockUserAsync(string id);
        Task<bool> IsBlockedAsync(string id);

        Task<bool> ChangeUserRoleAsync(string userId, string newRole);

       
        Task<bool> UpdateAsync(ApplicationUser user);
        Task<bool> SoftDeleteAsync(ApplicationUser user);
    }
}
