using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using Newtonsoft.Json.Linq;

namespace hajur_ko_car_rental.Services
{
    public class ImageService
    {
        public bool IsImage(IFormFile file)
        {
            var allowedTypes = new[] { "image/jpeg", "image/png", "image/jpg" };
            return allowedTypes.Contains(file.ContentType);
        }

        public bool IsDoc(IFormFile file)
        {
            var allowedTypes = new[] { "application/pdf", "image/png" };
            return allowedTypes.Contains(file.ContentType); 
        }

        Account account;
        Cloudinary cloudinary;

        public void initCloudinary()
        {
            var cloudName = "dcywvzzu3";
            var apiKey = "259659959121485";
            var apiSecret = "TKwqqq5i3iAIu5FEhsXRDTsIzUI";

            account = new Account (cloudName, apiKey, apiSecret );
            cloudinary = new Cloudinary(account);
        }

        public async Task<string> UploadImage(IFormFile formFile, bool isUser = true)
        {
            initCloudinary();
            //converting IFormFile to stream using MemoryStream()
            var fileStream = new MemoryStream();
            await formFile.CopyToAsync(fileStream);
            fileStream.Position = 0;

            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(formFile.FileName, fileStream),
                PublicId = $"hajur-ko-car-rental/{(isUser ? "user_docs" : "cars")}"
            };

            var uploadResult = await cloudinary.UploadAsync(uploadParams);
            return uploadResult.SecureUrl.ToString();
        }

        public async Task<bool> RemoveImage(string image)
        {
            initCloudinary();

            var remove = await cloudinary.DeleteResourcesAsync(image);
            var json = remove.JsonObj["deleted_counts"][image]["original"];

            JToken jToken = JToken.Parse(json.ToString());
            int count = jToken.Value<int>();
            if(count > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
