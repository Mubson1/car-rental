namespace hajur_ko_car_rental.DTOs
{
    public class PostDamageReqDTO
    {
        public string DamageDescription { get; set; }
        public Guid? RentalId { get; set; }
    }
}
