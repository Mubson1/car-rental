namespace hajur_ko_car_rental.DTOs.DamageDtos
{
    public class ViewDamageReqDTO
    {
        public Guid Id { get; set; }
        public string DamageDescription { get; set; }
        public DateTime ReportDate { get; set; }
        public Guid? RentalId { get; set; }
        public string? CheckedBy { get; set; }
    }
}
