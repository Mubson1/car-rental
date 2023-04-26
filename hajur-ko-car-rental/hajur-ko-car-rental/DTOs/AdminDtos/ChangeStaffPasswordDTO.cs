using System.ComponentModel.DataAnnotations;


namespace hajur_ko_car_rental.DTOs.AdminDtos
{
    public class ChangeStaffPasswordDTO
    {
        [Required(ErrorMessage = "UserID is required")]
        public string UserId { get; set; }
        [Required(ErrorMessage = "New password is required")]
        public string NewPassword { get; set; }
    }
}
