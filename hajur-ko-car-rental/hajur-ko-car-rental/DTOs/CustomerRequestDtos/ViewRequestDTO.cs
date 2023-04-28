namespace hajur_ko_car_rental.DTOs.CustomerRequestDtos
{
    public class ViewRequestDTO
    {
        public Guid Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string RequestStatus { get; set; }
        public string? NotificationStatus { get; set; }

        public string CustomerId { get; set; }

        public string? CheckedBy { get; set; }

        public Guid CarId { get; set; }
    }
}
