using hajur_ko_car_rental.DTOs;
using hajur_ko_car_rental.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace hajur_ko_car_rental.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class DamageRequestController : ControllerBase
    {
        private readonly DamageRequestService _damageRequest;

        public DamageRequestController(DamageRequestService damageReq)
        {
            _damageRequest = damageReq;
        }


        [HttpPost]
        [Route("post_request")]
        //[Authorize]
        public IActionResult MakeDamageReq(PostDamageReqDTO damagedReqDto)
        {
            try
            {
                var rentalHistory = _damageRequest.MakeDamageRequest(damagedReqDto);
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
        [Route("get_all_request")]
        //[Authorize(Roles = "Admin,Staff")]
        public IActionResult GetAllRequest(string? requestStatus)
        {
            try
            {
                var damageRecords = _damageRequest.GetAllDamageRequests(requestStatus);
                return Ok(new
                {
                    message = "success",
                    damageRequests = damageRecords
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
