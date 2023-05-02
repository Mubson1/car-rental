using hajur_ko_car_rental.Models;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace hajur_ko_car_rental.Models
{
    public class ApplicationUser: IdentityUser
    {
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Address { get; set; }



        public string? DocumentUrl { get; set; }

        [ForeignKey("DocumentType")]

        public int? DocType { get; set; }


        public virtual DocumentType DocumentType { get; set; }
    }
}
