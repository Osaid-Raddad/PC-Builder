using PCBuilder.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.Repositories.Interfaces
{
    public interface IAppointmentRepository
    {
        Task AddAsync(Appointment appointment);
        Task<Appointment> GetAsync(int id);
        Task<List<Appointment>> GetForTechAsync(string techId);
        Task<List<Appointment>> GetForUserAsync(string userId);
        Task SaveAsync();
    }
}
