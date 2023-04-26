using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using hajur_ko_car_rental.Models;

namespace hajur_ko_car_rental.Models
{
    public class SpecialOffers
    {
        [Key]
        public Guid Id { get; set; }
        public string OfferTitle { get; set; }
        public string OfferDescription { get; set; }
        public float Discount { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        [ForeignKey("Cars")]
        public Guid CarId { get; set; }

        public virtual Cars Cars { get; set; }
    }
}
