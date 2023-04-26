using hajur_ko_car_rental.Models;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace hajur_ko_car_rental.Models
{
    public class DocumentType
    {
        [Key]
        public int Id { get; set; }

        public string Title { get; set; }
        
        public virtual ICollection<ApplicationUser> Users { get; set; }
    }
}
