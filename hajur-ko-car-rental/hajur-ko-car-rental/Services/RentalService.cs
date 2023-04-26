using hajur_ko_car_rental.Data;
using hajur_ko_car_rental.Models.Static;
using hajur_ko_car_rental.Models;
using Microsoft.AspNetCore.Identity;

namespace hajur_ko_car_rental.Services
{
    public class RentalService
    {
        private readonly AppDbContext _dbContext;
        private readonly UserManager<IdentityUser> _userManager;

        public RentalService(AppDbContext dbContext, UserManager<IdentityUser> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        public void ApproveRequest(Guid RequestId, string StaffId)
        {
            var request = _dbContext.RentalHistory.FirstOrDefault(x => x.Id == RequestId);

            if (request == null)
            {
                throw new Exception("Invalid request");
            }

            var staff = _dbContext.ApplicationUsers.FirstOrDefault(x => x.Id == StaffId);
            if (staff == null)
            {
                throw new Exception("Invalid staff id!");
            }


            var carDetails = _dbContext.Cars.FirstOrDefault(x => x.Id == request.CarId);
            if (carDetails == null)
            {
                throw new Exception("Car doesn't exist.");
            }
            if (carDetails.Status != CarStatus.Available)
            {
                throw new Exception("Car is not available for rent.");
            }

            request.RequestStatus = "Approved";

            int rentedDays = (int)(request.EndDate - request.StartDate).TotalDays == 0 ? 1 : (int)(request.EndDate - request.StartDate).TotalDays;
            var payment = new RentalPayment
            {
                PaymentId = Guid.NewGuid(),
                Amount = rentedDays * carDetails.RatePerDay,
                PaymentStatus = "In progress",
                RentalId = request.Id
            };
            _dbContext.RentalHistory.Update(request);
            _dbContext.RentalPayment.Add(payment);
            _dbContext.SaveChanges();
        }


        public void DenyRequest(Guid RequestId, string StaffId)
        {
            var request = _dbContext.RentalHistory.FirstOrDefault(x => x.Id == RequestId);

            if (request == null)
            {
                throw new Exception("Invalid request");
            }

            var staff = _dbContext.ApplicationUsers.FirstOrDefault(x => x.Id == StaffId);
            if (staff == null)
            {
                throw new Exception("Invalid staff id!");
            }

            request.RequestStatus = "Denied";
            _dbContext.RentalHistory.Update(request);
            _dbContext.SaveChanges();
        }

        public List<RentalHistory> GetAllRentalHistory()
        {

            var rentalHistory = _dbContext.RentalHistory.ToList();

            return rentalHistory;
        }

        public RentalHistory GetRentalHistoryById(Guid Id)
        {
            var rentalHistory = _dbContext.RentalHistory.FirstOrDefault(x => x.Id == Id);
            return rentalHistory;
        }
    }
}
