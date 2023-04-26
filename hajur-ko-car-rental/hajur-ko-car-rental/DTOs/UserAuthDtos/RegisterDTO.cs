using System.ComponentModel.DataAnnotations;

namespace hajur_ko_car_rental.DTOs.UserAuthDtos
{
    public class RegisterDTO
    {
        public string FullName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }

        [RegularExpression(@"^(?=.*\d)(?=.*\W)(?=.*[a-zA-Z]).{8,}$", ErrorMessage = "Password must be at least 8 characters long and contain at least one digit and one special character.")]
        public string Password { get; set; }
        public string PhoneNumber { get; set; }


        public string Address { get; set; }

        public IFormFile? Document { get; set; }
        public string? DocType { get; set; }
    }
}
