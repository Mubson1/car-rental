﻿namespace hajur_ko_car_rental.DTOs.OfferDtos
{
    public class ViewOfferDTO
    {
        public Guid Id { get; set; }
        public string offerTitle { get; set; }
        public string offerDescription { get; set; }
        public float Discount { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public Guid CarId { get; set; }
        public string CarImage { get; set; }
        public string CarStatus { get; set; }
        public float RentRate { get; set; }
        public string CarName { get; set; }
    }
}
