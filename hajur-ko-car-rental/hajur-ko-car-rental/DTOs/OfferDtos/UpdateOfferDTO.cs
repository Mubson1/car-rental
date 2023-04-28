namespace hajur_ko_car_rental.DTOs.OfferDtos
{
    public class UpdateOfferDTO
    {
        public string Id { get; set; }
        public string OfferTitle { get; set; }
        public string OfferDescription { get; set; }
        public float Discount { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public Guid CarId { get; set; }
    }
}
