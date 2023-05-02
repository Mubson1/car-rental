using hajur_ko_car_rental.DTOs.OfferDtos;
using hajur_ko_car_rental.Models;

namespace hajur_ko_car_rental.Interface
{
    public interface ISpecialOffer
    {
        public ViewOfferDTO AddOffer(AddOfferDTO offer);
        public ViewOfferDTO UpdateOffer(UpdateOfferDTO offer);
        List<ViewOfferDTO> ViewValidOffers();
        List<SpecialOffers> GetOfferByCarId(Guid id);
        public List<ViewOfferDTO> ViewAllOffers();
        public List<OfferCarsDTO> GetCarList();

        void RemoveOffer(Guid id);
    }
}
