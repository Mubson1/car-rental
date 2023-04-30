using hajur_ko_car_rental.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace hajur_ko_car_rental.Data
{
    public sealed class AppDbContext : IdentityDbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            //Database.EnsureCreated();
        }

        public DbSet<ApplicationUser> ApplicationUsers { get; set; }

        public DbSet<DocumentType> DocumentType { get; set; }

        public DbSet<Cars> Cars { get; set; }
        public DbSet<RentalHistory> RentalHistory { get; set; }

        public DbSet<RentalPayment> RentalPayment { get; set; }
        public DbSet<SpecialOffers> SpecialOffers { get; set; }
        public DbSet<DamageRecord> DamageRecord { get; set; }
        public DbSet<DamagePayment> DamagePayment { get; set; }

        public DbSet<SpecialOffers> Offers { get; set; }
    }
}