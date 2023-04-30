using hajur_ko_car_rental.Data;
using hajur_ko_car_rental.DTOs.RentalHistoryDtos;
using hajur_ko_car_rental.Models.Static;
using hajur_ko_car_rental.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace hajur_ko_car_rental.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("api/[controller]")]

    public class RentalHistoryController : ControllerBase
    {
        private readonly RentalHistoryService _rentalService;
        private readonly AppDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public RentalHistoryController(RentalHistoryService rentalHistory, AppDbContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
            _rentalService = rentalHistory;
        }


        [HttpGet]
        [Route("get_rental_history")]
        public async Task<IActionResult> GetAllRentalHistory([FromQuery] string? status, [FromQuery] string? userId)
        {
            try
            {
                var rentalHistory = _rentalService.GetRentalHistory(status, userId);
                return Ok(new
                {
                    message = "success",
                    history = rentalHistory
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

        [HttpGet]
        [Route("rent_request_details/{Id}")]
        public async Task<IActionResult> GetRentalHistoryById(Guid Id)
        {
            try
            {
                var rentalHistory = _rentalService.GetRentalHistoryById(Id);
                return Ok(new
                {
                    message = "success",
                    history = rentalHistory
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

        //[Authorize(Roles = "Admin,Staff")]
        [HttpPut]
        [Route("confirm_request")]
        public async Task<IActionResult> ApproveRequest(Guid requestId)
        {
            try
            {
                var authUsername = User.Identity.Name!;
                _rentalService.ApproveRequest(requestId, authUsername);
                return Ok(new
                {
                    message = "success"
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

        //[Authorize(Roles = "Admin,Staff")]
        [HttpPut]
        [Route("get_bill_status")]
        public async Task<IActionResult> GetBillStatus(string customerId)
        {
            try
            {
                var status = _rentalService.GetBillStatus(customerId);
                return Ok(new
                {
                    message = "success",
                    billStatus = status
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

        //[Authorize(Roles = "Admin,Staff")]
        [HttpPatch]
        [Route("deny_request")]
        public async Task<IActionResult> DenyRequest(Guid requestId)
        {
            try
            {
                var authUsername = User.Identity.Name!;

                _rentalService.DenyRequest(requestId, authUsername);
                return Ok(new
                {
                    message = "success"
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

        //[Authorize(Roles = "Admin,Staff")]
        [HttpPut("return_car")]
        public async Task<IActionResult> ReturnCar(ReturnCarDTO dto)
        {
            var rentalId = dto.RentalId;
            try
            {
                var returnDate = DateTime.Parse(dto.ReturnDate);

                var rental = _context.RentalHistory.Where(rh => rh.Id == rentalId && rh.RequestStatus == RequestStatus.Paid).FirstOrDefault();

                if (rental == null)
                {
                    return NotFound(
                        new
                        {
                            message = "Invalid request"
                        }
                        );
                }

                // Check if the user is authorized to update the rental
                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                {
                    return Unauthorized();
                }
                var roles = await _userManager.GetRolesAsync(user);
                rental.ReturnDate = returnDate;
                rental.RequestStatus = RequestStatus.Returned;

                var carReturn = await _context.Cars.FindAsync(rental.CarId);

                carReturn.Status = CarStatus.Available;
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "success"
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
