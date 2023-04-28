namespace hajur_ko_car_rental.DTOs.UserAuthDtos
{
    public class UploadDocumentDTO
    {
        public string UserId { get; set; }

        public IFormFile Document { get; set; }

        public string DocType { get; set; }
    }
}
