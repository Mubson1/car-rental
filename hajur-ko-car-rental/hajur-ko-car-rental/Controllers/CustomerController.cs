using hajur_ko_car_rental.Models;
using hajur_ko_car_rental.DTOs.CustomerRequestDtos;
using hajur_ko_car_rental.DTOs.OfferDtos;
using hajur_ko_car_rental.Services;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using hajur_ko_car_rental.Models.Static;

namespace hajur_ko_car_rental.Controllers
{

    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly RequestRentService _rentService;
        private readonly UserManager<IdentityUser> _userManager;


        public CustomerController(RequestRentService rentRequestService, UserManager<IdentityUser> userManager)
        {
            _rentService = rentRequestService;
            _userManager = userManager;

        }

        [HttpPost]
        [Route("post_request")]
        public async Task<IActionResult> MakeRentRequest(MakeRequestDTO makeRequestDto)
        {
            try
            {
                var request = await _rentService.MakeRequest(makeRequestDto);
                return Ok(new
                {
                    message = "success",
                    request = request
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }

        [HttpPost]
        [Route("get_discount")]
        public async Task<IActionResult> GetTotalDiscount(CheckDiscountDTO dto)
        {
            try
            {
                var totalDiscount = await _rentService.GetTotalDiscount(dto);

                var user = _userManager.Users.Where(user => user.Id == dto.CustomerId).FirstOrDefault();
                if (user != null)
                {
                    var role = await _userManager.GetRolesAsync(user);
                    if (role[0] == UserRoles.Staff)
                    {
                        totalDiscount += 25;
                    }
                }

                return Ok(new
                {
                    message = "success",
                    discount = totalDiscount

                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpPost]
        [Route("cancel_request")]

        public async Task<IActionResult> CancelRequest(Guid id)
        {
            try
            {
                RentalHistory updatedData = await _rentService.CancelReq(id);

                return Ok(
                     new
                     {
                         message = "success"
                     }
                     );

            }
            catch (Exception ex)
            {
                return BadRequest(
                     new
                     {
                         message = ex.Message
                     }
                     );
            }
        }

    }
}
