using System.ComponentModel.DataAnnotations;

namespace hajur_ko_car_rental.DTOs.AdminDtos
{
    public class StaffMemberDTO
    {
        public string Id { get; set; }
        [Required(ErrorMessage = "Username is required")]
        public string UserName { get; set; }
        [Required(ErrorMessage = "Email address is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Password is required")]
        [RegularExpression(@"^(?=.*\d)(?=.*\W)(?=.*[a-zA-Z]).{8,}$", ErrorMessage = "Password must be at least 8 characters long and contain at least one digit and one special character.")]

        public string Password { get; set; }
        [Required(ErrorMessage = "Role is required")]
        public string Role { get; set; }
    }
}
