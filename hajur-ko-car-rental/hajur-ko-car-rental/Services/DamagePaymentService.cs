using hajur_ko_car_rental.Data;
using hajur_ko_car_rental.DTOs.DamagePaymentDtos;
using hajur_ko_car_rental.Models.Static;
using hajur_ko_car_rental.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace hajur_ko_car_rental.Services
{
    public class DamagePaymentService
    {
        private readonly AppDbContext _dbContext;
        private readonly UserManager<IdentityUser> _userManager;

        public DamagePaymentService(AppDbContext dbContext, UserManager<IdentityUser> userManager)
        {
            _dbContext = dbContext;
        }
        public dynamic CreateNewDamageBill(CreateDamageBillDTO dto)
        {

            var paymentId = Guid.NewGuid();
            var dmgRecord = _dbContext.DamageRecord.Find(dto.DamageRecordId);
            if (dmgRecord == null)
            {
                throw new Exception("Invalid record id");
            }
            if (dmgRecord.RequestStatus != RequestStatus.Pending)
            {
                throw new Exception("Damage record status must be pending to create repair bill");
            }
            else
            {
                var checkedBy = dto.CheckedBy;
                var dmgPayment = new DamagePayment
                {
                    PaymentId = paymentId,
                    PaymentStatus = PaymentStatus.Pending,
                    Amount = dto.Amount,
                    CheckedBy = checkedBy.ToString(),
                    DamageRecordId = dto.DamageRecordId
                };
                dmgRecord.RequestStatus = RequestStatus.Approved;

                _dbContext.DamagePayment.Add(dmgPayment);
                _dbContext.DamageRecord.Update(dmgRecord);

                _dbContext.SaveChanges();

                return new
                {
                    paymentId = paymentId,
                    paymentStatus = dmgPayment.PaymentStatus,
                    amount = dmgPayment.Amount,
                    checkedBy = dmgPayment.CheckedBy,
                    damageRecordId = dmgPayment.DamageRecordId

                };
            }


        }

        public async Task<bool> ConfirmPayment(Guid paymentId, Guid userId)
        {
            var payment = await _dbContext.DamagePayment.FindAsync(paymentId);

            if (payment == null)
            {
                throw new Exception("Invalid payment id."
                 );
            }

            var dmgRecord = await _dbContext.DamageRecord.FindAsync(payment.DamageRecordId);

            if (dmgRecord == null)
            {
                throw new Exception("Invalid damage record id.");
            }

            if (dmgRecord.RequestStatus != RequestStatus.Approved)
            {
                throw new Exception("Damage record status must be set to 'approved' before payment can be confirmed.");
            }

            if (payment.PaymentStatus != PaymentStatus.Pending)
            {
                throw new Exception("Payment must be marked as 'pending' before it can be confirmed.");
            }
            //var username = User.Identity.Name;

            payment.PaymentStatus = PaymentStatus.Paid;
            payment.CheckedBy = _dbContext.ApplicationUsers.Where(u => userId.ToString() == u.Id).First().Id;
            dmgRecord.RequestStatus = RequestStatus.Paid;
            payment.PaymentDate = DateTime.UtcNow;
            payment.PaymentType = PaymentType.Offline;
            // rentalHistory.NotificationStatus = "confirmed";

            _dbContext.Entry(payment).State = EntityState.Modified;
            _dbContext.Entry(dmgRecord).State = EntityState.Modified;

            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!DmgPaymentExists(paymentId))
                {
                    throw new Exception(ex.Message
                    );
                }
                else
                {
                    throw;
                }
            }

            return true;
        }


        private bool DmgPaymentExists(Guid paymentId)
        {
            return _dbContext.DamagePayment.Any(e => e.PaymentId == paymentId);
        }

        public DamagePayment GetDamagePaymentByCustomerId(string customerId)
        {
            var paymentRecord = _dbContext.DamagePayment.FirstOrDefault(x => x.CheckedBy == customerId);
            return paymentRecord;
        }


        public async Task<DamagePayment> UpdateDamagePayment(UpdateDamagePayment damagePayment)
        {
            var prevPaymentId = Guid.Parse(damagePayment.Id);
            var prevPayment = PaymentExists(prevPaymentId);

            if (prevPayment == null)
            {
                throw new Exception("Invalid payment records");
            }

            var damageRecordId = _dbContext.DamageRecord.FirstOrDefault(x => x.Id == damagePayment.DamageRecordId);
            if (damageRecordId == null)
            {
                throw new Exception("Invalud damage record");
            }

            _dbContext.Entry(prevPayment).State = EntityState.Detached;

            var updatedPayment = new DamagePayment
            {
                PaymentId = prevPaymentId,
                PaymentDate = damagePayment.PaymentDate,
                Amount = damagePayment.Amount,
                PaymentType = damagePayment.PaymentType,
                PaymentStatus = damagePayment.PaymentStatus,
                CheckedBy = damagePayment.CheckedBy,
                DamageRecordId = damagePayment.DamageRecordId
            };

            _dbContext.DamagePayment.Update(updatedPayment);
            _dbContext.SaveChanges();

            return updatedPayment;

        }

        public void RemoveDamagePaymentRecord(Guid id)
        {
            var damageRecords = _dbContext.DamagePayment.FirstOrDefault(x => x.PaymentId == id);

            if (damageRecords == null)
            {
                throw new Exception("Payment Id doesn't exists");
            }

            _dbContext.DamagePayment.Remove(damageRecords);
            _dbContext.SaveChanges();

            //return damagerecords;
        }


        public dynamic GetAllPayments(string? paymentStatus)
        {
            var paymentData = _dbContext.DamagePayment.ToList();
            var validStatus = new List<string> { PaymentStatus.Paid, PaymentStatus.Pending };

            if (paymentStatus != null)
            {
                if (!validStatus.Contains(paymentStatus))
                {
                    throw new Exception("Invalid payment status");
                }

                paymentData = paymentData
                    .Where(p => p.PaymentStatus == paymentStatus)
                    .ToList();
            }

            var paymentDatas = paymentData.Select(data =>
            {
                var damageRecord = _dbContext.DamageRecord.Include(dr => dr.RentalHistory).FirstOrDefault(dr => dr.Id == data.DamageRecordId);
                var checkedBy = _dbContext.ApplicationUsers.Find(data.CheckedBy);
                var rentalHistory = damageRecord != null ? _dbContext.RentalHistory.Find(damageRecord.RentalId) : null;
                var car = damageRecord != null ? _dbContext.Cars.Find(damageRecord.RentalHistory.CarId) : null;
                var customer = damageRecord != null ? _dbContext.ApplicationUsers.Find(damageRecord.RentalHistory.CustomerId) : null;

                return new
                {
                    id = data.PaymentId,
                    paymentDate = data.PaymentDate,
                    paymentStatus = data.PaymentStatus,
                    amount = data.Amount,
                    paymentType = data.PaymentType,
                    checkedBy = new
                    {
                        id = checkedBy.Id,
                        name = checkedBy.Name,
                        username = checkedBy.UserName
                    },

                    rentalDetails = new
                    {
                        id = rentalHistory.Id,
                        car = car != null ? new
                        {
                            id = car.Id,
                            name = car.CarName,
                            brand = car.Brand,
                        } : null,
                        customer = customer != null ? new
                        {
                            id = customer.Id,
                            name = customer.Name,
                            username = customer.UserName

                        } : null

                    }

                };
            });

            return paymentDatas;
        }

        public DamagePayment GetDamagePaymentById(Guid id)
        {
            var data = _dbContext.DamagePayment.FirstOrDefault(x => x.PaymentId == id);

            if (data == null)
            {
                throw new Exception("Invalid payment id");
            }
            return data;
        }

        private DamagePayment? PaymentExists(Guid id)
        {
            return (_dbContext.DamagePayment?.FirstOrDefault(x => x.PaymentId == id));
        }
    }
}
