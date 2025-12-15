using PCBuilder.DAL.DTO.Requests;
using PCBuilder.DAL.DTO.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.BLL.Services.Interfaces
{
    public interface IChatService
    {
        Task SendMessageAsync(string senderId, SendMessageRequest request);
        Task<List<ChatMessageResponse>> GetChatAsync(string user1, string user2);
    }
}
