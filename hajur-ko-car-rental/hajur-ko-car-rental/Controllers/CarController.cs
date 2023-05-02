using hajur_ko_car_rental.DTOs;
using hajur_ko_car_rental.Models;
using hajur_ko_car_rental.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace hajur_ko_car_rental.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarController : ControllerBase
    {
        private readonly CarService _carService;
        private readonly ImageService _imgService;
        public CarController(CarService carService, ImageService imgService)
        {
            _carService = carService;
            _imgService = imgService;
        }


        //[Authorize(Roles = "Admin,Staff")]
        [HttpPost]
        [Route("add_new_car")]
        public async Task<IActionResult> AddCar([FromForm] AddCarsDTO car)
        {
            var carImage = car.Image;
            var imageCheck = CheckImage(carImage);
            if (imageCheck != null)
            {
                return imageCheck;
            }

            try
            {
                var carView = await _carService.AddCar(car);
                return Ok(new
                {
                    message = "success",
                    car = carView
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

        [ApiExplorerSettings(IgnoreApi = true)]

        public IActionResult? CheckImage(IFormFile carImage)
        {
            if (carImage.Length > 5 * 1024 * 1024)
            {
                Response.StatusCode = 413; // Payload Too Large
                return Content("File size exceeds the limit of 5 mb");
            }
            if (!_imgService.IsImage(carImage))
            {
                Response.StatusCode = 415; // Unsupported Media type
                return Content("File type not supported");

            }
            return null;
        }

        [HttpGet]
        [Route("get_allcar_details")]
        public async Task<IActionResult> GetAllCars()
        {
            try
            {
                var cars = _carService.GetAllCars();
                return Ok(
                    new
                    {
                        message = "success",
                        cars = cars
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


        [HttpPut]
        //[Authorize(Roles ="Admin")]
        [Route("update_car_details")]
        public async Task<IActionResult> UpdateCar([FromForm] UpdateCarDTO car)
        {
            var carImage = car.Image;

            try

            {
                if (carImage != null)
                {
                    var imageCheck = CheckImage(carImage);

                    if (imageCheck != null)
                    {
                        return imageCheck;

                    }

                }
                Cars updatedCar = await _carService.UpdateCar(car);

                return Ok(
                    new
                    {
                        message = "success",
                        car = updatedCar
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
        [Route("car_details")]
        public async Task<IActionResult> GetCarById(Guid id)
        {
            try
            {
                var carDetail = _carService.GetCarById(id);
                return Ok(new
                {
                    message = "success",
                    car = carDetail
                });

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //[Authorize(Roles = "Admin,Staff")]
        [HttpDelete("remove_car")]
        public async Task<IActionResult> RemoveCar(String id)
        {
            try
            {
                var guId = Guid.Parse(id);
                bool success = await _carService.RemoveCar(guId);
                if (success)
                {
                    return Ok(new
                    {
                        message = "Car removed successfully."
                    });

                }
                else
                {
                    return BadRequest(new { message = "Failed to delete car image data" });
                }


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
