using hajur_ko_car_rental.Data;
using hajur_ko_car_rental.DTOs.UserAuthDtos;
using hajur_ko_car_rental.Models;

namespace hajur_ko_car_rental.Services
{
    public class DocumentService
    {
        private readonly AppDbContext _context;
        public async Task AddAsync(DocumentDTO docDto)
        {
            await _context.DocumentType.AddAsync(new DocumentType
            {
                Id = docDto.Id,
                Title = docDto.Title,
            });
            await _context.SaveChangesAsync();
        }
    }
}
