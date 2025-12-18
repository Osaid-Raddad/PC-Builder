using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using PCBuilder.BLL.Services.Interfaces;
using PCBuilder.DAL.DTO.Requests;

namespace PCBuilder.PL.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly IChatService _chatService;

        public ChatHub(IChatService chatService)
        {
            _chatService = chatService;
        }

        public async Task SendMessage(string receiverId, string message)
        {
            var senderId = Context.UserIdentifier;

            await _chatService.SendMessageAsync(senderId, new SendMessageRequest
            {
                ReceiverId = receiverId,
                Message = message
            });

            await Clients.User(receiverId)
                .SendAsync("ReceiveMessage", senderId, message);
        }
    }
}
