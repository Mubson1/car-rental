using hajur_ko_car_rental.DTOs.OfferDtos;
using hajur_ko_car_rental.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace hajur_ko_car_rental.Controllers
{
    [Route("api/[controller]")]

    public class SpecialOfferController : ControllerBase
    {

        private readonly ISpecialOffer _publishOffers;
        public SpecialOfferController(ISpecialOffer publishOffers)
        {
            _publishOffers = publishOffers;
        }

        [Authorize(Roles = "Admin,Staff")]
        [HttpPost]
        [Route("add_new_offer")]
        public async Task<IActionResult> AddOffer([FromBody] AddOfferDTO offer)
        {
            try
            {
                var offerView = _publishOffers.AddOffer(offer);
                return Ok(new
                {
                    message = "success",
                    offer = offerView
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
        [Route("get_offers")]
        public async Task<IActionResult> GetUserOffers()
        {
            try
            {
                var offers = _publishOffers.ViewValidOffers();
                return Ok(
                    new
                    {
                        message = "success",
                        offer = offers
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

        [Route("view_cars")]
        [Authorize(Roles = "Staff,Admin")]
        [HttpGet]
        public async Task<IActionResult> GetCarList()
        {

            try
            {
                var carList = _publishOffers.GetCarList();
                return Ok(
                    new
                    {
                        message = "success",
                        cars = carList
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

        [Route("get_all_offers")]
        [Authorize(Roles = "Staff,Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllOffers()
        {
            try
            {
                var offers = _publishOffers.ViewAllOffers();
                return Ok(
                    new
                    {
                        message = "success",
                        offer = offers
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


        [HttpGet]
        [Route("offer_detail/{Id}")]
        public async Task<IActionResult> GetOfferById(Guid Id)
        {
            try
            {
                var offerDetails = _publishOffers.GetOfferByCarId(Id);
                return Ok(new
                {
                    message = "success",
                    offer = offerDetails
                });

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


        [Authorize(Roles = "Admin,Staff")]
        [HttpPatch]
        [Route("change_offer")]
        public async Task<IActionResult> UpdateOffer([FromBody] UpdateOfferDTO offer)
        {
            try
            {
                var updatedOffer = _publishOffers.UpdateOffer(offer);
                return Ok(new
                {
                    message = "success",
                    offer = updatedOffer

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


        [Authorize(Roles = "Admin,Staff")]
        [HttpDelete("delete_offer")]
        public async Task<IActionResult> RemoveOffer(Guid id)
        {
            try
            {
                _publishOffers.RemoveOffer(id);
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
