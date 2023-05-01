namespace hajur_ko_car_rental.DTOs.DamagePaymentDtos
{
    public class CreateDamageBillDTO
    {
        public float Amount { get; set; }
        public Guid DamageRecordId { get; set; }

        public Guid CheckedBy { get; set; }
    }
}
