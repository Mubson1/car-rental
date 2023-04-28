using hajur_ko_car_rental.Data;
using hajur_ko_car_rental.DTOs.AdminDtos;
using hajur_ko_car_rental.Interface;
using hajur_ko_car_rental.Models.Static;
using hajur_ko_car_rental.Models;
using hajur_ko_car_rental.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace hajur_ko_car_rental.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly AppDbContext _dbContext;
        private readonly IAdminService _adminService;

        public AdminController(UserManager<IdentityUser> userManager, AppDbContext appDbContext, AdminService adminService)
        {
            _userManager = userManager;
            _dbContext = appDbContext;
            _adminService = adminService;
        }

        [HttpPost]
        [Route("add_staff")]
        public async Task<IActionResult> CreateNewStaffMember([FromBody] RegisterStaffDTO registerDto
            //string userName, string email, string password, string role
            )
        {

            var prevUser = await _userManager.FindByNameAsync(registerDto.Username);
            if (prevUser != null)
            {
                return BadRequest(new { message = "Username already taken." });
            }
            var prevEmailUser = await _userManager.FindByEmailAsync(registerDto.Email);
            if (prevEmailUser != null)
            {
                return BadRequest(new { message = "Email already taken." });
            }
            var validRoles = new List<String> { UserRoles.Admin, UserRoles.Staff };
            if (!validRoles.Contains(registerDto.Role))
            {
                throw new Exception("Invalid role.");
            }
            try
            {
                _adminService.ValidateAdmin();

                ApplicationUser user = new ApplicationUser
                {

                    UserName = registerDto.Username,
                    Email = registerDto.Email,
                    PhoneNumber = registerDto.PhoneNumber,
                    Address = registerDto.Address,
                    Name = registerDto.FullName,
                };


                var result = await _userManager.CreateAsync(user, registerDto.Password);
                if (!result.Succeeded)
                {
                    return BadRequest(result.Errors);
                }
                else if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, registerDto.Role);

                }
                var addedUser = await _userManager.FindByNameAsync(registerDto.Username);
                var staffMemberDto = new RegisterStaffOutputDTO
                {
                    Id = addedUser.Id,

                    Username = addedUser.UserName,
                    Email = addedUser.Email,
                    PhoneNumber = registerDto.PhoneNumber,
                    Address = registerDto.Address,
                    FullName = registerDto.FullName,
                    Role = registerDto.Role
                };

                return Ok(new { message = "Registration successful", staffMember = staffMemberDto });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }




        }
        [HttpGet]
        [Route("get_users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = _dbContext.ApplicationUsers.ToList();
            var viewUsers = users.Select(user =>
            {
                var result = _userManager.GetRolesAsync(user).Result;
                var userRole = result == null ? "" : result[0];
                if (userRole != UserRoles.Customer)
                {
                    return new ViewUserDTO
                    {
                        Id = user.Id,
                        FullName = user.Name,
                        Username = user.UserName,

                        Email = user.Email,
                        PhoneNumber = user.PhoneNumber,
                        Address = user.Address,
                        Role = userRole,
                    };
                }
                return null;
            }).Where(user => user != null);
            return Ok(new
            {
                message = "success",
                users = viewUsers
            });
        }

        [HttpPost]
        [Route("change_password")]
        public async Task<IActionResult> ChangePassword(ChangeStaffPasswordDTO changePasswordDto)
        {
            var user = await _userManager.FindByIdAsync(changePasswordDto.UserId);

            if (user == null)
            {
                return BadRequest(new { message = "User not found" });
            }
            if (user.UserName == "admin")
            {
                return Unauthorized(new { message = "You can not update this user." });

            }
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, changePasswordDto.NewPassword);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors.FirstOrDefault()?.Description);
            }

            return Ok(new
            {
                message = "You have sucessfully changed your password"
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StaffMemberDTO>> GetStaffMemberById(string id)
        {
            var staffMember = await _adminService.GetStaffMemberById(id);

            if (staffMember == null)
            {
                return BadRequest(new { message = "There is no staff with the respective ID." });
            }

            return Ok(staffMember);
        }

        [HttpPut("update_user")]
        public async Task<IActionResult> UpdateStaffMember([FromBody] UpdateStaffDTO staffUpdateDto)
        {
            try
            {
                var updatedStaff = await _adminService.UpdateStaffMember(staffUpdateDto);
                return Ok(new { message = "Staff Updated succesfully", staff = staffUpdateDto });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStaffMember(string id)
        {
            try
            {
                var result = await _adminService.DeleteStaffMember(id);
                if (!result)
                {
                    return NotFound(new { message = "Staff not found." });
                }

            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

            return Ok(new { message = "Staff removed successfully" });
        }
    }
}
