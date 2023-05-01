using hajur_ko_car_rental.DTOs.DamagePaymentDtos;
using hajur_ko_car_rental.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace hajur_ko_car_rental.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class DamagePaymentController : ControllerBase
    {
        private readonly DamagePaymentService _damagePaymentService;

        public DamagePaymentController(DamagePaymentService damagePaymentService)
        {
            _damagePaymentService = damagePaymentService;
        }

        //[Authorize(Roles = "Admin,Staff")]
        [HttpPost]
        [Route("create_payment")]
        public async Task<IActionResult> CreateDamagePaymentBill(CreateDamageBillDTO damagePayment)
        {
            try
            {
                //var loggedUsername = User.Identity.Name;

                var paymentRecord = _damagePaymentService.CreateNewDamageBill(damagePayment);
                return Ok(new
                {
                    message = "success",
                    paymentRecord = paymentRecord
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

        //[Authorize(Roles = "Admin, Staff")]
        [HttpGet]
        [Route("get_damage_payments")]
        public IActionResult GetAllDamagedPaymentRecords(string? paymentStatus)
        {
            try
            {
                var payment = _damagePaymentService.GetAllPayments(paymentStatus);

                return Ok(new
                {
                    message = "success",
                    payments = payment
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



        //[Authorize(Roles = "Customer, Staff, Admin")]
        [Route("get_customer_payment")]
        [HttpGet]
        public IActionResult GetCustomerPaymentById(string customerID)
        {
            try
            {
                var paymentRecords = _damagePaymentService.GetDamagePaymentByCustomerId(customerID);
                return Ok(new
                {
                    message = "success",
                    data = paymentRecords
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


        [HttpPut("confirm_damage_payment")]
        //[Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> ConfirmPayment(Guid paymentId)
        {
            try
            {
                var loggedInUsername = User.Identity.Name!;
                var damageRecords = await _damagePaymentService.ConfirmPayment(paymentId, loggedInUsername);
                return Ok(new
                {
                    message = "success",
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


        //[Authorize(Roles = "Admin, Staff")]
        [HttpDelete]
        [Route("delete_payment")]
        public void RemoveDamgePaymentRecord([FromBody] Guid id)
        {
            try
            {
                _damagePaymentService.RemoveDamagePaymentRecord(id);

                Ok(new
                {
                    message = "success"
                });

            }

            catch (Exception ex)
            {
                BadRequest(new
                {
                    message = ex.Message
                });
            }
        }
    }
}
