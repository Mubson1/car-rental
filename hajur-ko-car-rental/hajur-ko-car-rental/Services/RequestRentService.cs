using hajur_ko_car_rental.Data;
using hajur_ko_car_rental.DTOs.CustomerRequestDtos;
using hajur_ko_car_rental.DTOs.OfferDtos;
using hajur_ko_car_rental.Models.Static;
using hajur_ko_car_rental.Models;

namespace hajur_ko_car_rental.Services
{
    public class RequestRentService
    {
        public AppDbContext _dbContext;


        public RequestRentService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public ViewRequestDTO MakeRequest(MakeRequestDTO dto)
        {
            var startDate = DateTime.Parse(dto.StartDate).Date;
            var endDate = DateTime.Parse(dto.EndDate).Date;
            if (startDate < DateTime.Now.Date)
            {
                throw new Exception("Invalid start date.");

            }
            if (startDate >= endDate)
            {
                throw new Exception("End date should be after the start date.");
            }

            var carId = dto.CarId;
            var request = new RentalHistory
            {
                Id = Guid.NewGuid(),
                CarId = carId,
                CustomerId = dto.CustomerId,
                StartDate = startDate,
                EndDate = endDate,
                RequestStatus = RequestStatus.Pending,
            };
            _dbContext.RentalHistory.Add(request);
            _dbContext.SaveChanges();
            var viewRequest = new ViewRequestDTO
            {
                Id = carId,
                CustomerId = request.CustomerId,
                CarId = request.CarId,
                StartDate = request.StartDate,
                EndDate = request.EndDate,

                RequestStatus = request.RequestStatus,
                CheckedBy = request.AuthorizedBy,
                NotificationStatus = request.NotificationStatus,

            };
            return viewRequest;

        }

        public async Task<float> GetTotalDiscount(CheckDiscountDTO dto)
        {
            var regularUser = _dbContext.ApplicationUsers
                    .Where(u => u.Id == dto.CustomerId && _dbContext.RentalHistory
                        .Count(r => r.CustomerId == u.Id && r.StartDate > DateTimeOffset.UtcNow.AddMonths(-1)) >= 3)
                    .FirstOrDefault();
            float totalDiscount = 0;
            if (regularUser != null)
            {
                totalDiscount += 10;
            }

            var currentDate = DateTimeOffset.UtcNow;
            var offer = _dbContext.Offers.Where(offers => offers.CarId == dto.CarId &&
            offers.StartDate <= currentDate && currentDate <= offers.EndDate.AddDays(1)).FirstOrDefault();
            if (offer != null)
            {
                totalDiscount += offer.Discount;
            }

            return totalDiscount;
        }
    }
}
