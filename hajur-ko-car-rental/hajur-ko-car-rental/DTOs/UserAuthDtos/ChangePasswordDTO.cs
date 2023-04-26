namespace hajur_ko_car_rental.DTOs.UserAuthDtos
{
    public class ChangePasswordDTO
    {
        public string userId { get; set; }
        public string currentPw { get; set; }
        public string newPw { get; set; }
    }
}
