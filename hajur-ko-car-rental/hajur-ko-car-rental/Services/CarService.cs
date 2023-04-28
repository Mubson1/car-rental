using hajur_ko_car_rental.Data;
using hajur_ko_car_rental.DTOs.UserAuthDtos;
using hajur_ko_car_rental.DTOs;
using hajur_ko_car_rental.Models;
using Microsoft.EntityFrameworkCore;

namespace hajur_ko_car_rental.Services
{
    public class CarService
    {
        private readonly AppDbContext _dbContext;
        private readonly ImageService _imgService;

        public CarService(AppDbContext dbContext, ImageService imgService)
        {
            _dbContext = dbContext;
            _imgService = imgService;
        }

        public async Task<Cars> AddCar(AddCarsDTO car)
        {
            ValidateData(car.FuelType, car.SafetyRating);
            var imgUrl = await _imgService.UploadImage(car.Image, isUser: false);

            var CarId = Guid.NewGuid();
            var carStatus = "Available";
            var newCar = new Cars
            {
                Id = CarId,
                CarName = car.CarName,
                Description = car.Description,
                Brand = car.Brand,
                RatePerDay = car.RatePerDay,
                Color = car.Color,
                Status = carStatus,
                Mileage = car.Mileage,
                FuelType = car.FuelType,
                SafetyRating = car.SafetyRating,
                ImageUrl = imgUrl,
            };
            _dbContext.Cars.Add(newCar);
            _dbContext.SaveChanges();

            return newCar;
        }

        public List<Cars> GetAllCars()
        {
            var cars = _dbContext.Cars
                .ToList();

            return cars;
        }

        public Cars GetCarById(Guid id)
        {

            var data = _dbContext.Cars.FirstOrDefault(x => x.Id == id);
            return data;
        }


        public async Task<bool> RemoveCar(Guid id)
        {
            var car = _dbContext.Cars.FirstOrDefault(x => x.Id == id);
            if (car == null)
            {
                throw new Exception("Invalid car id!");
            }

            _dbContext.Cars.Remove(car);

            var success = await _imgService.RemoveImage(car.ImageUrl);
            if (success)
            {
                _dbContext.SaveChanges();
            }

            return success;
        }

        private void ValidateData(string fuelType, string safetyRating)
        {
            var validFuelTypes = new List<String> { "Petrol", "Diesel", "Electric", "Hybrid" };
            if (!validFuelTypes.Contains(fuelType))
            {
                throw new Exception("Invalid fuel type!");
            }
            var validRatings = new List<String> { "A", "B", "C", "D", "E" };

            if (!validRatings.Contains(safetyRating))
            {
                throw new Exception("Invalid safety rating!");
            }
        }

        public async Task<Cars> UpdateCar(UpdateCarDTO car)
        {
            //var imgUrl = car.ImageUrl.S

            var carId = Guid.Parse(car.Id);
            var prevCar = CarExists(carId);
            if (prevCar == null)
            {
                throw new Exception("Invalid car id!");
            }
            _dbContext.Entry(prevCar).State = EntityState.Detached;
            ValidateData(car.FuelType, car.SafetyRating);


            var updatedCar = new Cars
            {
                Id = prevCar.Id,
                CarName = car.CarName,
                Description = car.Description,
                Brand = car.Brand,
                RatePerDay = car.RatePerDay,
                Color = car.Color,
                Status = prevCar.Status,
                Mileage = car.Mileage,
                FuelType = car.FuelType,
                SafetyRating = car.SafetyRating,
                ImageUrl = car.Image == null ? prevCar.ImageUrl : _imgService.UploadImage(car.Image, isUser: false).Result,
            };

            bool isDeleted = await _imgService.RemoveImage(prevCar.ImageUrl);
            if (!isDeleted)
            {
                throw new Exception("Failed to update the image.");

            }
            _dbContext.Cars.Update(updatedCar);
            _dbContext.SaveChanges();

            return updatedCar;

        }

        private Cars? CarExists(Guid id)
        {
            return (_dbContext.Cars?.FirstOrDefault(e => e.Id == id));
        }
    }
}
