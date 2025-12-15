using Microsoft.AspNetCore.Identity;
using PCBuilder.BLL.Services.Interfaces;
using PCBuilder.DAL.Models;
using PCBuilder.DAL.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.BLL.Services.Classes
{
    public class ChatPermissionService : IChatPermissionService
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public ChatPermissionService(UserManager<ApplicationUser> userManager) 
        {
            _userManager = userManager;
        }

        public async Task<bool> CanSendAsync(string senderId, string receiverId)
        {
            var sender = await _userManager.FindByIdAsync(senderId);
            var receiver = await _userManager.FindByIdAsync(receiverId);
            if (sender == null || receiver == null)
                return false;
            var senderRoles = await _userManager.GetRolesAsync(sender);
            var receiverRoles = await _userManager.GetRolesAsync(receiver);

            if (senderRoles.Contains("SuperAdmin") || senderRoles.Contains("Admin"))
                return true;

            if (senderRoles.Contains("User"))
                return receiverRoles.Any(r =>
                    r == "Admin" || r == "TechSupport" || r == "SuperAdmin");

            if (senderRoles.Contains("TechSupport"))
                return receiverRoles.Any(r =>
                    r == "User" || r == "Admin" || r == "SuperAdmin");

            return false;
        }
    }
}
