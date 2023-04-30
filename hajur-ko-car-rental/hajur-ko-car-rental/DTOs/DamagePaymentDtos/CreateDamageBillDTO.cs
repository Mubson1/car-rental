namespace hajur_ko_car_rental.DTOs.DamagePaymentDtos
{
    public class CreateDamageBillDTO
    {
        public double Amount { get; set; }
        public Guid DamageRecordId { get; set; }
    }
}
