using PCBuilder.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.Repositories.Interfaces
{
    public interface IChatRepository
    {
        Task AddAsync(ChatMessage message);
        Task<List<ChatMessage>> GetChatAsync(string user1, string user2);
    }
}
