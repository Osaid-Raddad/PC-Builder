using PCBuilder.BLL.Services.Interfaces;
using PCBuilder.DAL.DTO.Requests;
using PCBuilder.DAL.DTO.Responses;
using PCBuilder.DAL.Models;
using PCBuilder.DAL.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.BLL.Services.Classes
{
    public class ChatService : IChatService
    {
        private readonly IChatPermissionService _permissionService;
        private readonly IChatRepository _chatRepository;

        public ChatService(IChatPermissionService permissionService,IChatRepository chatRepository) 
        {
            _permissionService = permissionService;
            _chatRepository = chatRepository;
        }

        public async Task SendMessageAsync(string senderId, SendMessageRequest request)
        {
            if (!await _permissionService.CanSendAsync(senderId, request.ReceiverId))
                throw new UnauthorizedAccessException("Chat not allowed.");

            var message = new ChatMessage
            {
                SenderId = senderId,
                ReceiverId = request.ReceiverId,
                Message = request.Message,
                SentAt = DateTime.UtcNow,
                IsRead = false
            };

            await _chatRepository.AddAsync(message);
        }

        public async Task<List<ChatMessageResponse>> GetChatAsync(string user1, string user2)
        {
            if (!await _permissionService.CanSendAsync(user1, user2))
                throw new UnauthorizedAccessException();

            var messages = await _chatRepository.GetChatAsync(user1, user2);

            return messages.Select(m => new ChatMessageResponse
            {
                SenderId = m.SenderId,
                Message = m.Message,
                SentAt = m.SentAt
            }).ToList();
        }

       
    }
}
