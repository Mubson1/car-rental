using hajur_ko_car_rental.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace hajur_ko_car_rental.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class CarRentalController: ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public CarRentalController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("FrequentlyRentedCars")]
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
                    .ToList();

                return Ok(rentedCars);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("NotRentedCars")]
        public IActionResult GetNotRentedCars()
        {
            try
            {
                var notRentedCars = _dbContext.Cars
                    .Where(c => !_dbContext.RentalHistory.Any(r => r.CarId == c.Id))
                    .ToList();

                return Ok(notRentedCars);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("FrequentCustomers")]
        public IActionResult GetFrequentCustomers()
        {
            try
            {
                var frequentCustomers = _dbContext.Users
                    .Where(u => _dbContext.RentalHistory
                        .Count(r => r.CustomerId == u.Id && r.StartDate > DateTimeOffset.UtcNow.AddMonths(-1)) > 3)
                    .ToList();

                return Ok(frequentCustomers);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("InactiveCustomers")]
        public IActionResult GetInactiveCustomers()
        {
            try
            {
                var inactiveCustomers = _dbContext.Users
                    .Where(u => !_dbContext.RentalHistory
                        .Any(r => r.CustomerId == u.Id && r.StartDate > DateTimeOffset.UtcNow.AddMonths(-3)))
                    .ToList();

                return Ok(inactiveCustomers);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
