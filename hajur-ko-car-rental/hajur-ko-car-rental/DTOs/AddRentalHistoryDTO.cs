namespace hajur_ko_car_rental.DTOs
{
    public class AddRentalHistoryDTO
    {
        public DateTime StartDate { get; set; } = DateTime.Now;
        public DateTime EndDate { get; set; } = DateTime.Now;
        public string RequestStatus { get; set; }
        public float Charges { get; set; }
        public string NotificationStatus { get; set; }
        public string CustomerId { get; set; }
        public string? CheckedBy { get; set; }
        public Guid CarId { get; set; }
    }
}
