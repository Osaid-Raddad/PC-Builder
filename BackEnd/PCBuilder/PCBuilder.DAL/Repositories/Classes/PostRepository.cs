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
    public class PostRepository : IPostRepository
    {
        private readonly ApplicationDbContext _context;

        public PostRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Post> GetByIdAsync(int id)
        {
            return await _context.Posts
                .Include(p => p.Images)
                .Include(p => p.Likes)
                .Include(p => p.Comments)
                .ThenInclude(c => c.Replies)
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<List<Post>> GetAllAsync()
        {
            return await _context.Posts
                .Include(p => p.Images)
                .Include(p => p.Likes)
                .Include(p => p.Comments)
                .Include(p => p.User)
                .ToListAsync();
        }

        public async Task<List<Post>> GetApprovedPostsAsync()
        {
            return await _context.Posts
                .Where(p => p.Status == PostStatus.Approved)
                .Include(p => p.Images)
                .Include(p => p.Likes)
                .Include(p => p.Comments)
                .Include(p => p.User)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Post>> GetPendingPostsAsync()
        {
            return await _context.Posts
                .Include(p => p.Images)
                .Include(p => p.User)
                .Include(p => p.Likes)
                .Include(p => p.Comments)
                .Where(p => p.Status == PostStatus.Pending)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }
        public async Task<List<PostComment>> GetPostCommentsAsync(int postId)
        {
            return await _context.PostComments
       .Where(c => c.PostId == postId)
       .Include(c => c.User)                      
       .Include(c => c.Replies)                  
           .ThenInclude(r => r.User)              
       .ToListAsync();
        }
        public async Task<List<Post>> GetByUserIdAsync(string userId)
        {
            return await _context.Posts
                .Where(p => p.UserId == userId)
                .Include(p => p.Images)
                .Include(p => p.Likes)
                .Include(p => p.Comments)
                .Include(p => p.User)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<int> GetUserPostCountAsync(string userId)
        {
            return await _context.Posts.CountAsync(p => p.UserId == userId);
        }

        public async Task AddCommentAsync(PostComment comment)
        {
            _context.PostComments.Add(comment);
            await _context.SaveChangesAsync();
        }

        public async Task AddAsync(Post post)
        {
            await _context.Posts.AddAsync(post);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Post post)
        {
            _context.Posts.Update(post);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Post post)
        {
            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
        }
    }
}
