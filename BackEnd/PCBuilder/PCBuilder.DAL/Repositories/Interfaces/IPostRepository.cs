using PCBuilder.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.Repositories.Interfaces
{
    public interface IPostRepository
    {
        Task<Post> GetByIdAsync(int id); 
        Task<List<Post>> GetAllAsync();
        Task<List<Post>> GetApprovedPostsAsync();

        Task<List<Post>> GetPendingPostsAsync();
        Task<List<Post>> GetByUserIdAsync(string userId); 
        Task<int> GetUserPostCountAsync(string userId); 
        Task AddAsync(Post post); 
        Task UpdateAsync(Post post); 
        Task DeleteAsync(Post post); 
    }
}
