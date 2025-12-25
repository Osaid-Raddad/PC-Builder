using PCBuilder.DAL.DTO.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.BLL.Services.Classes
{
    public interface IContactUsService
    {
        Task SendAsync(ContactUsRequest request);
    }
}
