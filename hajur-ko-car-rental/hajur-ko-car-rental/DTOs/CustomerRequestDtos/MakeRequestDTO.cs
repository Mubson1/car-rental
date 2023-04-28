namespace hajur_ko_car_rental.DTOs.CustomerRequestDtos
{
    public class MakeRequestDTO
    {
        public string StartDate { get; set; }
        public string EndDate { get; set; }

        public string CustomerId { get; set; }

        public Guid CarId { get; set; }
    }
}
