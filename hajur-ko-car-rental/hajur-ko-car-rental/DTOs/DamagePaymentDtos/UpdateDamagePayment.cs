namespace hajur_ko_car_rental.DTOs.DamagePaymentDtos
{
    public class UpdateDamagePayment
    {
        public string Id { get; set; }
        public DateTime PaymentDate { get; set; }
        public double Amount { get; set; }
        public string? PaymentType { get; set; }
        public string PaymentStatus { get; set; }
        public string? CheckedBy { get; set; }
        public Guid DamageRecordId { get; set; }
    }
}
