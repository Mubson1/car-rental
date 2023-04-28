using hajur_ko_car_rental.DTOs.AdminDtos;

namespace hajur_ko_car_rental.Interface
{
    public interface IAdminService
    {
        Task<StaffMemberDTO> GetStaffMemberById(string id);
        Task<UpdateStaffDTO> UpdateStaffMember(UpdateStaffDTO staffUpdateDto);
        Task<bool> DeleteStaffMember(string id);

        void ValidateAdmin();

    }
}
