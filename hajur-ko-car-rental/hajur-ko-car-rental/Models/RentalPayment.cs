using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using hajur_ko_car_rental.Models;

namespace hajur_ko_car_rental.Models
{
    public class RentalPayment
    {
        [Key]
        public Guid PaymentId { get; set; }

        public DateTime PaymentDate { get; set; }
        public double Amount { get; set; }
        public string? PaymentType { get; set; }
        public string PaymentStatus { get; set; }

        [ForeignKey("Staff")]
        public string? CheckedBy { get; set; }

        public virtual ApplicationUser Staff { get; set; }

        [ForeignKey("RentalHistory")]
        public Guid RentalId { get; set; }

        public virtual RentalHistory RentalHistory { get; set; }
    }
}
