using hajur_ko_car_rental.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace hajur_ko_car_rental.Models
{
    public class DamageRecord
    {
        [Key]
        public Guid Id { get; set; }

        public string DamageDescription { get; set; }

        public DateTime ReportDate { get; set; }

        [ForeignKey("Cars")]
        public Guid? CarId { get; set; }

        public virtual Cars Cars { get; set; }

        [ForeignKey("RentalHistory")]
        public Guid? RentalId { get; set; }

        public virtual RentalHistory RentalHistory { get; set; }

        [ForeignKey("Staff")]
        public string? CheckedBy { get; set; }

        public virtual ApplicationUser Staff { get; set; }
    }
}
