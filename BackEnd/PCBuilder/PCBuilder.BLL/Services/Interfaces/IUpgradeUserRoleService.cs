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
    public interface IUpgradeUserRoleService
    {
        Task CreateRequestAsync(string userId, UpgradeUserRoleRequest request);
        Task DecideAsync(int requestId, UpgradeUserRoleResponse response);
        Task<List<UpgradeUserRole>> GetAllPendingRequestsAsync();
    }
}
