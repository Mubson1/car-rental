using hajur_ko_car_rental.Models;
using hajur_ko_car_rental.Models.Static;
using Microsoft.AspNetCore.Identity;

namespace hajur_ko_car_rental.Data
{
    public class AppDbInitializer
    {
        public static async Task SeedUsersAndRolesAsync(IApplicationBuilder applicationBuilder)
        {
            using (var serviceScope = applicationBuilder.ApplicationServices.CreateScope())
            {
                // Roles
                var roleManager = serviceScope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
                var adminRoleExists = await roleManager.RoleExistsAsync(UserRoles.Admin);
                if (!adminRoleExists)
                    await roleManager.CreateAsync(new IdentityRole(UserRoles.Admin));

                if (!await roleManager.RoleExistsAsync(UserRoles.Staff))
                    await roleManager.CreateAsync(new IdentityRole(UserRoles.Staff));

                if (!await roleManager.RoleExistsAsync(UserRoles.Customer))
                    await roleManager.CreateAsync(new IdentityRole(UserRoles.Customer));

                //Users
                var userManager = serviceScope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
                var adminName = "admin";
                var adminUser = await userManager.FindByNameAsync(adminName);
                if (adminUser == null)
                {
                    var newAdminUser = new ApplicationUser
                    {
                        Name = "Hajur Ko Admin",
                        UserName = adminName,
                        Email = "hajurkoadmin@gmail.com",
                        Address = "Hajur ko Ghar",
                        PhoneNumber = "9843589652",
                        SecurityStamp = Guid.NewGuid().ToString(),
                        EmailConfirmed = true
                    };
                    await userManager.CreateAsync(newAdminUser, "admin@12");
                    await userManager.AddToRoleAsync(newAdminUser, UserRoles.Admin);
                }


                var staffName = "staff";
                var staffUser = await userManager.FindByNameAsync(staffName);
                if (staffUser == null)
                {
                    var newStaffUser = new ApplicationUser
                    {
                        Name = "Hajur Ko Staff",
                        UserName = staffName,
                        Email = "hajurkostaff@gmail.com",
                        Address = "Hajur ko Staff Ko Ghar",
                        PhoneNumber = "9898989898",
                        SecurityStamp = Guid.NewGuid().ToString(),
                        EmailConfirmed = true
                    };
                    await userManager.CreateAsync(newStaffUser, "staff@12");
                    await userManager.AddToRoleAsync(newStaffUser, UserRoles.Staff);
                }

                //Document Details
                var licenseId = 1;
                var citizenshipId = 2;
                var context = serviceScope.ServiceProvider.GetRequiredService<AppDbContext>();
                var docs = context.DocumentType;
                if (docs.FindAsync(licenseId).Result == null)
                {
                    await docs.AddAsync(new DocumentType
                    {
                        Id = licenseId,
                        Title = "License",


                    });
                }

                if (docs.FindAsync(citizenshipId).Result == null)
                {
                    await docs.AddAsync(new DocumentType
                    {
                        Id = citizenshipId,
                        Title = "Citizenship",


                    });
                }
                context.SaveChanges();

            }
        }
    }
}