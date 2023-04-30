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

        public async Task<ViewRequestDTO> MakeRequest(MakeRequestDTO dto)
        {
            var customerId = dto.CustomerId;
            var prevCustomer = _dbContext.ApplicationUsers.FirstOrDefault(customer => customer.Id == customerId);
            if (prevCustomer == null)
            {
                throw new Exception("Invalid customer id.");
            }
            if (string.IsNullOrEmpty(prevCustomer.DocumentUrl))
            {
                throw new Exception("You can't make request without uploading your document.");
            }

            var carId = dto.CarId;
            var prevCar = _dbContext.Cars.FirstOrDefault(car => car.Id == carId);
            if (prevCar == null)
            {
                throw new Exception("Invalid car id.");
            }

            var prevReq = _dbContext.RentalHistory.Where(rh => rh.CustomerId == dto.CustomerId && rh.CarId == dto.CarId && rh.RequestStatus == RequestStatus.Pending).FirstOrDefault();
            if (prevReq != null)
            {
                throw new Exception("Your previous request for this car is pending. You can't make another request for this car.");

            }

            if (prevCar.Status != CarStatus.Available)
            {
                throw new Exception("The car is currently unavailable for rent");
            }


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


            var totalDays = (endDate - startDate).TotalDays;
            var charge = (totalDays * prevCar.RatePerDay);
            var discount = await GetTotalDiscount(new CheckDiscountDTO
            {
                CarId = carId,
                CustomerId = customerId,
            });

            var totalCharge = (int)(charge - ((discount / 100) * charge));
            var historyId = Guid.NewGuid();
            var request = new RentalHistory
            {
                Id = historyId,
                CarId = carId,
                CustomerId = dto.CustomerId,
                StartDate = startDate,
                EndDate = endDate,
                TotalCharge = totalCharge,
                RequestStatus = RequestStatus.Pending,
            };

            _dbContext.RentalHistory.Add(request);
            //prevCar.Status = CarStatus.Unavailable;
            _dbContext.Cars.Update(prevCar);
            _dbContext.SaveChanges();


            var viewRequest = new ViewRequestDTO
            {
                Id = historyId,
                CustomerId = request.CustomerId,
                CarId = request.CarId,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                TotalCharge = totalCharge,

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


        public async Task<RentalHistory> CancelReq(Guid id)
        {
            var rentalHistory = _dbContext.RentalHistory.FirstOrDefault(x => x.Id == id &&
             x.RequestStatus == RequestStatus.Pending || x.RequestStatus == RequestStatus.Approved);

            if (rentalHistory == null)
            {
                throw new Exception("Invalid id!");
            }

            rentalHistory.RequestStatus = RequestStatus.Cancelled;
            if (rentalHistory.RequestStatus == RequestStatus.Approved)
            {
                var payment = _dbContext.RentalPayment.Where(rp => rp.RentalId == rentalHistory.Id).FirstOrDefault();
                payment.PaymentStatus = PaymentStatus.Cancelled;
            }
            _dbContext.RentalHistory.Update(rentalHistory);

            var prevCar = _dbContext.Cars.Find(rentalHistory.CarId);
            if (prevCar != null)
            {
                prevCar.Status = CarStatus.Available;
                _dbContext.Cars.Update(prevCar);

            }

            _dbContext.SaveChanges();

            return rentalHistory;
        }

    }
}
