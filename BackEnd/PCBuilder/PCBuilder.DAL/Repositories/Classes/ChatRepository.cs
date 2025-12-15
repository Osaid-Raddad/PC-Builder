using Microsoft.EntityFrameworkCore;
using PCBuilder.DAL.Data;
using PCBuilder.DAL.Models;
using PCBuilder.DAL.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.Repositories.Classes
{
    public class ChatRepository : IChatRepository
    {
        private readonly ApplicationDbContext _context;

        public ChatRepository(ApplicationDbContext context) 
        {
            _context = context;
        }

        public async Task AddAsync(ChatMessage message)
        {
            await _context.ChatMessages.AddAsync(message);
            await _context.SaveChangesAsync();
        }

        public async Task<List<ChatMessage>> GetChatAsync(string user1, string user2)
        {
            return await _context.ChatMessages
                .Where(m => (m.SenderId == user1 && m.ReceiverId == user2) ||
                            (m.SenderId == user2 && m.ReceiverId == user1))
                .OrderBy(m => m.SentAt)
                .ToListAsync();
        }
    }
}
