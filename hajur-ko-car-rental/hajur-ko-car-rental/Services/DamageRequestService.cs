using hajur_ko_car_rental.Data;
using hajur_ko_car_rental.Models.Static;
using hajur_ko_car_rental.Models;
using hajur_ko_car_rental.DTOs.DamageDtos;
using hajur_ko_car_rental.DTOs;

namespace hajur_ko_car_rental.Services
{
    public class DamageRequestService
    {
        private readonly AppDbContext _dbContext;

        public DamageRequestService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public ViewDamageReqDTO MakeDamageRequest(PostDamageReqDTO damagedReqDto)
        {


            var renatlHistory = _dbContext.RentalHistory.FirstOrDefault(x => x.Id == damagedReqDto.RentalId);
            if (renatlHistory == null)
            {
                throw new Exception("Invalid rental Id");
            }



            var damageReqId = Guid.NewGuid();
            var reportDate = DateTime.Now;
            var reqStatus = RequestStatus.Pending;
            var data = new DamageRecord
            {
                Id = damageReqId,
                DamageDescription = damagedReqDto.DamageDescription,
                RentalId = damagedReqDto.RentalId,
                RequestStatus = RequestStatus.Pending,
                ReportDate = reportDate
            };

            var car = _dbContext.Cars.FirstOrDefault(car => car.Id == renatlHistory.CarId);
            car.Status = CarStatus.Damaged;

            _dbContext.DamageRecord.Add(data);
            _dbContext.Cars.Update(car);
            _dbContext.SaveChanges();

            var ViewDamageReq = new ViewDamageReqDTO
            {
                Id = damageReqId,
                DamageDescription = damagedReqDto.DamageDescription,
                RentalId = damagedReqDto.RentalId,
                ReportDate = reportDate
            };
            return ViewDamageReq;
        }



        public dynamic GetAllDamageRequests(string? requestStatus)
        {
            var damageRequests = _dbContext.DamageRecord.ToList();

            if (requestStatus != null)
            {
                var validStatus = new List<String> { RequestStatus.Pending, RequestStatus.Paid, RequestStatus.Approved };
                if (!validStatus.Contains(requestStatus))
                {
                    throw new Exception($"Invalid request status");
                }
                damageRequests = damageRequests.Where(req => req.RequestStatus == requestStatus).ToList();

            }
            else
            {
                damageRequests = damageRequests.Where(req => req.RequestStatus != RequestStatus.Paid).ToList();

            }
            var damageDetails = damageRequests.Select(
                dmgRecord =>
                {
                    var checkedBy = _dbContext.ApplicationUsers.Find(dmgRecord.CheckedBy);
                    var rh = _dbContext.RentalHistory.Find(dmgRecord.RentalId)!;
                    var customer = _dbContext.ApplicationUsers.FirstOrDefault(customer => customer.Id == rh.CustomerId);
                    var car = _dbContext.Cars.FirstOrDefault(car => car.Id == rh.CarId);
                    return new
                    {
                        id = dmgRecord.Id,
                        damageDescription = dmgRecord.DamageDescription,

                        reportDate = dmgRecord.ReportDate.ToShortDateString(),
                        requestStatus = dmgRecord.RequestStatus,
                        rentalDetails = new
                        {

                            id = rh.Id,
                            customer = new
                            {
                                id = customer.Id,
                                name = customer.Name,
                                username = customer.UserName,
                                phoneNumber = customer.PhoneNumber,
                                email = customer.Email,
                            },
                            car = new
                            {
                                id = car.Id,
                                name = car.CarName,
                                brand = car.Brand,
                                image = car.ImageUrl
                            },
                        },
                    };
                }





                );

            return damageDetails;
        }




        public DamageRecord GetDamageReqById(Guid Id)
        {
            var damageRequests = _dbContext.DamageRecord.FirstOrDefault(x => x.Id == Id);
            return damageRequests;

        }


    }
}
