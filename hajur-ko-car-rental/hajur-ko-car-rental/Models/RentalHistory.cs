using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using hajur_ko_car_rental.Models;

namespace hajur_ko_car_rental.Models
{
    public class RentalHistory
    {
        [Key]
        public Guid Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string RequestStatus { get; set; }

        public string? NotificationStatus { get; set; }

        [ForeignKey("Customer")]

        public string CustomerId { get; set; }

        public virtual ApplicationUser Customer { get; set; }

        [ForeignKey("Staff")]
        public string? AuthorizedBy { get; set; }

        public virtual ApplicationUser Staff { get; set; }

        [ForeignKey("Cars")]
        public Guid CarId { get; set; }

        public virtual Cars Cars { get; set; }
    }
}
