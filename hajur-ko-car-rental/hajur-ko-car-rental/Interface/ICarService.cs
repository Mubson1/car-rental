using hajur_ko_car_rental.DTOs.UserAuthDtos;
using hajur_ko_car_rental.DTOs;
using hajur_ko_car_rental.Models;

namespace hajur_ko_car_rental.Interface
{
    public interface ICarService
    {
        Task<Cars> AddCar(AddCarsDTO car);
        Cars UpdateCar(UpdateCarDTO car);
        List<Cars> GetAllCars();
        Cars GetCarById(Guid Id);
        Task<bool> RemoveCar(Guid id);
    }
}
