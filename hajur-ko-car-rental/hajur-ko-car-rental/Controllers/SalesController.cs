using hajur_ko_car_rental.Data;
using hajur_ko_car_rental.DTOs;
using hajur_ko_car_rental.Models.Static;
using hajur_ko_car_rental.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace hajur_ko_car_rental.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        public SalesController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost]
        [Route("rent_paid")]
        public async Task<ActionResult<dynamic>> CustomerRentals([FromBody] SalesDTO salesDto)
        {
            var rentalHistory =  _dbContext.RentalHistory
                 .Where(r => r.RequestStatus == RequestStatus.Paid || r.RequestStatus == RequestStatus.Returned).ToList();

            if (!string.IsNullOrEmpty(salesDto.CustomerId))
            {

                var customerId = salesDto.CustomerId;
                var prevCustomer = _dbContext.ApplicationUsers.FirstOrDefault(u => u.Id == customerId);
                if (prevCustomer == null)
                {
                    return BadRequest(
                        new
                        {
                            message = "Invalid customer id."
                        });
                }

                var currentDate = DateTime.Now.Date;
                DateTime startDate;
                DateTime endDate;
                try
                {
                    startDate = DateTime.Parse(salesDto.StartDate).Date;
                    if (startDate > currentDate)
                    {
                        throw new Exception();
                    }

                }
                catch (Exception)
                {
                    return BadRequest(new { message = "Invalid start date." });
                }

                try
                {
                    endDate = DateTime.Parse(salesDto.EndDate).Date;
                    if (endDate <= startDate
                        //|| endDate > currentDate
                        )
                    {
                        throw new Exception();
                    }
                }
                catch (Exception)
                {
                    return BadRequest(new { message = "Invalid end date." });
                }

                rentalHistory = rentalHistory
                   .Where(r => r.CustomerId == customerId && r.StartDate >= startDate && r.EndDate <= endDate).ToList();


            }

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
                    customer = new
                    {
                        id = customer.Id,
                        name = customer.Name,
                        username = customer.UserName
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

            return Ok(new
            {
                message = "success",
                rentalData = rentalDetails
            });
        }

        [HttpGet]
        [Route("rent/history/{customerId}")]
        public async Task<ActionResult<List<RentalHistory>>> GetCustomerRentalHistory(string customerId)
        {
            try
            {
                Guid customerGuid = new Guid(customerId);
            }
            catch (FormatException)
            {
                return BadRequest(new { message = "Invalid customer ID provided." });
            }

            var rentals = await _dbContext.RentalHistory
                .Where(r => r.CustomerId == customerId)
                .Include(r => r.Cars)
                .OrderByDescending(r => r.StartDate)
                .ToListAsync();

            return Ok(new
            {
                message = "success",
                rentalData = rentals
            });
        }
    }
}
