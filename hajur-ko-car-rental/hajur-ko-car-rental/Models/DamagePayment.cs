﻿using hajur_ko_car_rental.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace hajur_ko_car_rental.Models
{
    public class DamagePayment
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

        [ForeignKey("DamageRecord")]
        public Guid DamageRecordId { get; set; }

        public virtual DamageRecord DamageRecord { get; set; }
    }
}
