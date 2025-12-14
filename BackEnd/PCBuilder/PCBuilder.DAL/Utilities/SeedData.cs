using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PCBuilder.DAL.Data;
using PCBuilder.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.Utilities
{
    public class SeedData : ISeedData
    {
        private readonly ApplicationDbContext _context;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;

        public  SeedData(ApplicationDbContext context, RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _roleManager = roleManager;
            _userManager = userManager;
        }

        

        public async Task IdentityDataSeedingAsync()
        {
            if(! await _roleManager.Roles.AnyAsync())
            {
                await  _roleManager.CreateAsync(new IdentityRole ("Admin"));
                await _roleManager.CreateAsync(new IdentityRole("SuperAdmin"));
                await _roleManager.CreateAsync(new IdentityRole("User"));
            }

            if( ! await _userManager.Users.AnyAsync())
            {
                var user1 = new ApplicationUser
                {
                    Email = "osaidislam1@gmail.com",
                    FullName = "Osaid Islam",
                    PhoneNumber = "1234567890",
                    UserName = "OSAID",
                    EmailConfirmed = true
                };
                var user2 = new ApplicationUser
                {
                    Email = "omarmaherkhatib2@gmail.com",
                    FullName = "Omar Maher",
                    PhoneNumber = "1234587890",
                    UserName = "Omar",
                    EmailConfirmed = true
                };
                var user3 = new ApplicationUser
                {
                    Email = "aadamadamm343@gmail.com",
                    FullName = "Adam Abahre",
                    PhoneNumber = "1234567590",
                    UserName = "Adam23",
                    EmailConfirmed = true
                };
                await _userManager.CreateAsync(user1, "P@ssw0rd1");
                await _userManager.CreateAsync(user2, "P@ssw0rd2");
                await _userManager.CreateAsync(user3, "P@ssw0234");

                await _userManager.AddToRoleAsync(user1, "SuperAdmin");
                await _userManager.AddToRoleAsync(user2, "Admin");
                await _userManager.AddToRoleAsync(user3, "User");
            }
            await _context.SaveChangesAsync();
        }

    }
}
