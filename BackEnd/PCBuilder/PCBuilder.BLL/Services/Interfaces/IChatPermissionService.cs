using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.BLL.Services.Interfaces
{
    public interface IChatPermissionService
    {
        Task<bool> CanSendAsync(string senderId, string receiverId);
    }
}
