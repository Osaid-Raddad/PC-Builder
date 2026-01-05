using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PCBuilder.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PCBuilder.DAL.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {

        public DbSet<ChatMessage> ChatMessages { get; set; }

        public DbSet<Shop> Shops { get; set; }

        public DbSet<TechSupportAvailability> TechSupportAvailabilities { get; set; }

        public DbSet<Post> Posts { get; set; }
        public DbSet<PostComment> PostComments { get; set; }
        public DbSet<Appointment> Appointments { get; set; }

        public DbSet<UpgradeUserRole> UpgradeUserRoles { get; set; }

        public DbSet<ContactMessage> ContactMessages { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<ApplicationUser>().ToTable("Users");
            builder.Entity<IdentityRole>().ToTable("Roles");
            builder.Entity<IdentityUserRole<string>>().ToTable("UserRoles");
            //ignore
            builder.Ignore<IdentityUserClaim<string>>();
            builder.Ignore<IdentityUserLogin<string>>();
            builder.Ignore<IdentityRoleClaim<string>>();
            builder.Ignore<IdentityUserToken<string>>();

            builder.Entity<Appointment>()
                   .HasOne(a => a.User)
                   .WithMany()
                   .HasForeignKey(a => a.UserId)
                   .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<Appointment>()
                .HasOne(a => a.TechSupport)
                .WithMany()
                .HasForeignKey(a => a.TechSupportId)
                .OnDelete(DeleteBehavior.NoAction);
            // FK PostLike → User
            builder.Entity<PostLike>()
                .HasOne(l => l.User)
                .WithMany()
                .HasForeignKey(l => l.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            // FK PostLike → Post
            builder.Entity<PostLike>()
                .HasOne(l => l.Post)
                .WithMany(p => p.Likes)
                .HasForeignKey(l => l.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<PostComment>()
                  .HasOne(c => c.User)
                  .WithMany()
                  .HasForeignKey(c => c.UserId)
                  .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<PostComment>()
                .HasOne(c => c.Post)
                .WithMany(p => p.Comments)
                .HasForeignKey(c => c.PostId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<PostComment>()
                .HasOne(c => c.ParentComment)
                .WithMany(c => c.Replies)
                .HasForeignKey(c => c.ParentCommentId)
                .OnDelete(DeleteBehavior.Restrict);
        }

    }
}
