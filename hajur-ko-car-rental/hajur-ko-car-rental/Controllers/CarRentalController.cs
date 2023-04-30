using hajur_ko_car_rental.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace hajur_ko_car_rental.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CarRentalController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public CarRentalController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("get_frequently_rented_cars")]
        public IActionResult GetFrequentlyRentedCars()
        {
            try
            {
                var rentedCars = _dbContext.RentalHistory
                    .GroupBy(r => r.CarId)
                    .Where(g => g.Count() >= 3 && g.Max(r => r.StartDate) > DateTimeOffset.UtcNow.AddMonths(-1))
                    .Select(g => new
                    {
                        CarId = g.Key,
                        RentalCount = g.Count()
                    })
                    .ToList().Join(_dbContext.Cars, s => s.CarId, c => c.Id, (o, c) => new { Result = o, Car = c })
                            .Select(x => new
                            {
                                rentalCount = x.Result.RentalCount,
                                car = new
                                {
                                    carId = x.Car.Id,
                                    name = x.Car.CarName,
                                    brand = x.Car.Brand,
                                }
                            });
                //var cars = rentedCars.ToList().Select();
                return Ok(
                    new
                    {
                        message = "success",
                        rentedCars
                    }
                    );
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {

                    message = ex.Message
                });
            }
        }

        [HttpGet("get_not_rented_cars")]
        public IActionResult GetNotRentedCars()
        {
            try
            {
                var notRentedCars = _dbContext.Cars
                    .Where(c => !_dbContext.RentalHistory.Any(r => r.CarId == c.Id))
                    .Select(car => new
                    {
                        id = car.Id,
                        name = car.CarName,
                        brand = car.Brand,

                    });

                return Ok(new
                {
                    message = "success",
                    notRentedCars
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {

                    message = ex.Message
                });
            }
        }

        [HttpGet("get_regular_customers")]
        public IActionResult GetFrequentCustomers()
        {
            try
            {
                var regularCustomers = _dbContext.ApplicationUsers
                    .Where(u => _dbContext.RentalHistory
                        .Count(r => r.CustomerId == u.Id && r.StartDate > DateTimeOffset.UtcNow.AddMonths(-1)) >= 1)
                    .Select(customer => new
                    {
                        id = customer.Id,
                        username = customer.UserName,
                        fullName = customer.Name,
                        email = customer.Email,
                        phoneNumber = customer.PhoneNumber,

                    });

                return Ok(new { message = "success", regularCustomers });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {

                    message = ex.Message
                });
            }
        }

        [HttpGet("get_inactive_customers")]
        public IActionResult GetInactiveCustomers()
        {
            try
            {
                var inactiveCustomers = _dbContext.ApplicationUsers
                    .Where(u => !_dbContext.RentalHistory
                        .Any(r => r.CustomerId == u.Id && r.StartDate > DateTimeOffset.UtcNow.AddMonths(-3)))
                    .Select(customer => new
                    {
                        id = customer.Id,
                        username = customer.UserName,
                        fullName = customer.Name,
                        email = customer.Email,
                        phoneNumber = customer.PhoneNumber,

                    });

                return Ok(new
                {
                    message = "success",
                    inactiveCustomers
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {

                    message = ex.Message
                });
            }
        }

    }
}
