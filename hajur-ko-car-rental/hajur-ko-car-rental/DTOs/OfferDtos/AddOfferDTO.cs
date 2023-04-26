namespace hajur_ko_car_rental.DTOs.OfferDtos
{
    public class AddOfferDTO
    {
        public string offerTitle { get; set; }
        public string offerDescription { get; set; }
        public float Discount { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public Guid CarId { get; set; }
    }
}
