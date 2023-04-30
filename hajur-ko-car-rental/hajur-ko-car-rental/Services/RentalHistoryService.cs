using hajur_ko_car_rental.Data;
using hajur_ko_car_rental.Models.Static;
using hajur_ko_car_rental.Models;
using Microsoft.AspNetCore.Identity;

namespace hajur_ko_car_rental.Services
{
    public class RentalHistoryService
    {
        private readonly AppDbContext _dbContext;
        private readonly UserManager<IdentityUser> _userManager;

        public RentalHistoryService(AppDbContext dbContext, UserManager<IdentityUser> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        public void ApproveRequest(Guid requestId, string authUsername)
        {
            var request = _dbContext.RentalHistory.FirstOrDefault(x => x.Id == requestId && x.RequestStatus == RequestStatus.Pending);

            if (request == null)
            {
                throw new Exception("Invalid request");
            }
            var billStatus = GetBillStatus(request.CustomerId);
            if (billStatus == BillStatus.Due)
            {
                throw new Exception("You can't approve this request as the customer has pending bills.");

            }
            var staff = _dbContext.ApplicationUsers.FirstOrDefault(x => x.UserName == authUsername);
            if (staff == null)
            {
                throw new Exception("Invalid staff id!");
            }


            var carDetails = _dbContext.Cars.FirstOrDefault(x => x.Id == request.CarId);
            if (carDetails == null)
            {
                throw new Exception("Car doesn't exist.");
            }


            request.RequestStatus = RequestStatus.Approved;
            request.AuthorizedBy = staff.Id;

            int rentedDays = (int)(request.EndDate - request.StartDate).TotalDays == 0 ? 1 : (int)(request.EndDate - request.StartDate).TotalDays;
            var payment = new RentalPayment
            {
                PaymentId = Guid.NewGuid(),
                Amount = request.TotalCharge,
                PaymentStatus = PaymentStatus.Pending,
                RentalId = request.Id
            };
            _dbContext.RentalHistory.Update(request);
            _dbContext.RentalPayment.Add(payment);
            _dbContext.SaveChanges();
        }


        public void DenyRequest(Guid requestId, string authUsername)
        {
            var request = _dbContext.RentalHistory.FirstOrDefault(x => x.Id == requestId && x.RequestStatus == RequestStatus.Pending);

            if (request == null)
            {
                throw new Exception("Invalid request");
            }
            var billStatus = GetBillStatus(request.CustomerId);
            if (billStatus == BillStatus.Paid)
            {
                throw new Exception("You can't deny this request.");

            }
            var staff = _dbContext.ApplicationUsers.FirstOrDefault(x => x.UserName == authUsername);
            if (staff == null)
            {
                throw new Exception("Invalid staff id!");
            }

            request.RequestStatus = "Denied";
            request.AuthorizedBy = staff.Id;

            var car = _dbContext.Cars.Find(request.CarId);
            car.Status = CarStatus.Available;
            _dbContext.RentalHistory.Update(request);
            _dbContext.Cars.Update(car);
            _dbContext.SaveChanges();
        }

        public dynamic GetRentalHistory(string? status, string? userId)
        {



            var rentalHistory = _dbContext.RentalHistory.ToList();
            var validStatus = new List<String> { RequestStatus.Pending, RequestStatus.Approved, RequestStatus.Denied, RequestStatus.Cancelled, RequestStatus.Paid, RequestStatus.Returned, RequestStatus.Rented };

            if (status != null)
            {
                if (!validStatus.Contains(status))
                {
                    throw new Exception("Invalid status.");
                }
                rentalHistory = rentalHistory.Where(rh => rh.RequestStatus == status).ToList();
            }
            if (userId != null)
            {
                rentalHistory = rentalHistory.Where(rh => rh.CustomerId == userId).ToList();
            }
            //rentalHistory = rentalHistory.Where(rh =>
            //{
            //    if (rh.CustomerId == userId)
            //    {
            //        return new RentalHistory { 

            //        };
            //    }

            //});
            var rentalDetails = rentalHistory.Select(rh =>
            {
                var customer = _dbContext.ApplicationUsers.FirstOrDefault(customer => customer.Id == rh.CustomerId);
                var staff = _dbContext.ApplicationUsers.FirstOrDefault(staff => staff.Id == rh.AuthorizedBy);
                var car = _dbContext.Cars.FirstOrDefault(car => car.Id == rh.CarId);
                return new
                {
                    id = rh.Id,
                    startDate = rh.StartDate.ToShortDateString(),
                    endDate = rh.EndDate.ToShortDateString(),
                    requestStatus = rh.RequestStatus,
                    totalCharge = rh.TotalCharge,
                    returnDate = rh.ReturnDate,
                    customer = new
                    {
                        id = customer.Id,
                        name = customer.Name,
                        username = customer.UserName,
                        documentUrl = customer.DocumentUrl,
                        phoneNumber = customer.PhoneNumber,
                        email = customer.Email,
                    },
                    authorizedBy = staff == null ? null : new
                    {
                        id = staff.Id,
                        name = staff.Name,
                        username = staff.UserName
                    },
                    car = new
                    {
                        id = car.Id,
                        name = car.CarName,
                        brand = car.Brand,
                        image = car.ImageUrl
                    }


                };



            });
            return rentalDetails;
        }

        public string GetBillStatus(string customerId)
        {
            var unpaidRentalBill = _dbContext.RentalHistory
                .Where(rh => rh.RequestStatus == RequestStatus.Approved && rh.CustomerId == customerId)
                .Join(_dbContext.RentalPayment, hist => hist.Id, payment => payment.RentalId,
                (rHist, rPay) => new { History = rHist, Payment = rPay })
                .Where(x => x.Payment.PaymentStatus == PaymentStatus.Pending).FirstOrDefault();
            if (unpaidRentalBill != null)
            {
                return BillStatus.Due;
            }

            var unpaidDamageBill = _dbContext.RentalHistory
                .Where(rh => rh.RequestStatus == RequestStatus.Approved && rh.CustomerId == customerId)
                .Join(_dbContext.DamageRecord, hist => hist.Id, dmgRecord => dmgRecord.RentalId,
                (rHist, dmgRec) => new { History = rHist, Record = dmgRec })
                .Where(x => x.History.Id == x.Record.RentalId && x.Record.RequestStatus == RequestStatus.Pending)
                .FirstOrDefault();
            if (unpaidDamageBill != null)
            {
                return BillStatus.Due;
            }
            return BillStatus.Paid;
        }

        public RentalHistory GetRentalHistoryById(Guid Id)
        {
            var rentalHistory = _dbContext.RentalHistory.FirstOrDefault(x => x.Id == Id);
            return rentalHistory;
        }
    }
}
