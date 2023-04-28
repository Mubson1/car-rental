using hajur_ko_car_rental.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace hajur_ko_car_rental.Controllers
{
    [Authorize(Roles = "Admin,Staff")]
    [ApiController]
    [Route("api/[controller]")]
    public class RentalHistoryController: ControllerBase
    {
        private readonly RentalService _rentalService;

        public RentalHistoryController(RentalService rentalHistory)
        {
            _rentalService = rentalHistory;
        }

        [HttpGet]
        [Route("get_rentalHistory")]
        public async Task<IActionResult> GetAllRentalHistory()
        {
            try
            {
                var rentalHistory = _rentalService.GetAllRentalHistory();
                return Ok(new
                {
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
        [Route("rentalReq_details/{Id}")]
        public async Task<IActionResult> GetRentalHistoryById(Guid Id)
        {
            try
            {
                var rentalHistory = _rentalService.GetRentalHistoryById(Id);
                return Ok(new
                {
                    message = "Success",
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

        [HttpPatch]
        [Route("approve_request")]
        public async Task<IActionResult> ApproveRequest([FromForm] Guid RequestId, string StaffId)
        {
            try
            {
                _rentalService.ApproveRequest(RequestId, StaffId);
                return Ok(new
                {
                    message = "Success"
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

        [HttpPatch]
        [Route("deny_request")]
        public async Task<IActionResult> DenyRequest([FromForm] Guid RequestId, string StaffId)
        {
            try
            {
                _rentalService.DenyRequest(RequestId, StaffId);
                return Ok(new
                {
                    message = "Success"
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
