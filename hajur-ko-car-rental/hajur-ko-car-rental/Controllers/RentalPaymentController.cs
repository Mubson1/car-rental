using hajur_ko_car_rental.Data;
using hajur_ko_car_rental.Models.Static;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace hajur_ko_car_rental.Controllers
{
    //[Authorize(Roles = "Admin,Staff")]
    [ApiController]
    [Route("api/[controller]")]
    public class RentalPaymentController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        public RentalPaymentController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }


        [HttpGet("get_rent_payment")]
        public async Task<ActionResult<dynamic>> GetRentalPayments(string?
            paymentStatus)
        {
            var validStatus = new List<String> { PaymentStatus.Paid, PaymentStatus.Pending, PaymentStatus.Cancelled };
            var payments = await _dbContext.RentalPayment

                 .ToListAsync();
            if (paymentStatus != null)
            {
                if (!validStatus.Contains(paymentStatus))
                {
                    return BadRequest(new { message = "Invalid payment status" });
                }
                payments = _dbContext.RentalPayment
                     .Where(p => p.PaymentStatus == paymentStatus)
                     .ToList();


            }
            var paymentDetails = payments.Select(payment =>
            {
                var checkedBy = _dbContext.ApplicationUsers.Find(payment.CheckedBy);
                var rh = _dbContext.RentalHistory.Find(payment.RentalId)!;
                var customer = _dbContext.ApplicationUsers.FirstOrDefault(customer => customer.Id == rh.CustomerId);
                var car = _dbContext.Cars.FirstOrDefault(car => car.Id == rh.CarId);

                return new
                {
                    id = payment.PaymentId,
                    date = payment.PaymentDate.ToShortDateString(),
                    amount = payment.Amount,
                    paymentStatus = payment.PaymentStatus,

                    checkedBy = checkedBy == null ? null :
                    new
                    {
                        id = checkedBy.Id,
                        name = checkedBy.Name,
                        username = checkedBy.UserName,
                    }
                    ,
                    rentalDetails = new
                    {

                        id = rh.Id,
                        customer = new
                        {
                            id = customer.Id,
                            name = customer.Name,
                            username = customer.UserName
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
            });
            return new
            {
                message = "success",
                payments = paymentDetails
            };
        }

        [HttpPut("confirm_rent_payment")]
        public async Task<IActionResult> ConfirmPayment(Guid paymentId, Guid userId)
        {
            var payment = await _dbContext.RentalPayment.FindAsync(paymentId);

            if (payment == null)
            {
                return NotFound(new
                {
                    message = "Invalid payment id."
                });
            }

            var rentalHistory = await _dbContext.RentalHistory.FindAsync(payment.RentalId);

            if (rentalHistory == null)
            {
                return NotFound(
                    new
                    {
                        message = "Invalid rental history id."
                    }
                );
            }

            if (rentalHistory.RequestStatus != RequestStatus.Approved)
            {
                return BadRequest(new
                {
                    message = "Rental history request status must be set to 'approved' before payment can be confirmed."
                });
            }

            if (payment.PaymentStatus != PaymentStatus.Pending)
            {
                return BadRequest(new
                {
                    message = "Payment must be marked as 'pending' before it can be confirmed."
                });
            }

            payment.PaymentStatus = PaymentStatus.Paid;
            payment.CheckedBy = _dbContext.ApplicationUsers.Where(u => userId.ToString() == u.Id).First().Id;
            rentalHistory.RequestStatus = RequestStatus.Paid;
            payment.PaymentDate = DateTime.UtcNow;
            payment.PaymentType = PaymentType.Offline;

            _dbContext.Entry(payment).State = EntityState.Modified;
            _dbContext.Entry(rentalHistory).State = EntityState.Modified;

            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!PaymentExists(paymentId))
                {
                    return NotFound(new
                    {
                        message = ex.Message,
                    });
                }
                else
                {
                    throw;
                }
            }

            return Ok(new
            {
                message = "success"
            });
        }

        private bool PaymentExists(Guid paymentId)
        {
            return _dbContext.RentalPayment.Any(e => e.PaymentId == paymentId);
        }
    }

}
