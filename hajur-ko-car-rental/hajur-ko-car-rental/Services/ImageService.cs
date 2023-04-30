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
            var allowedTypes = new[] { "application/pdf", "image/png", };
            return allowedTypes.Contains(file.ContentType);
        }

        Account account;
        Cloudinary cloudinary;

        public void initCloudinary()
        {
            var cloudName = "dcywvzzu3";
            var apiKey = "259659959121485";
            var apiSecret = "TKwqqq5i3iAIu5FEhsXRDTsIzUI";

            account = new Account { Cloud = cloudName, ApiKey = apiKey, ApiSecret = apiSecret };
            cloudinary = new Cloudinary(account);
        }

        public async Task<string> UploadImage(IFormFile formFile, bool isUser = true)
        {

            initCloudinary();
            // Convert the IFormFile to a Stream
            var stream = new MemoryStream();
            await formFile.CopyToAsync(stream);
            stream.Position = 0;

            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(formFile.FileName, stream),
                PublicId = $"hajur_ko_car_rental/{(isUser ? "user_docs" : "cars")}/{Guid.NewGuid()}",
                Transformation = new Transformation().FetchFormat("auto")
            };
            var uploadResult = cloudinary.Upload(uploadParams);
            return uploadResult.SecureUrl.ToString();
        }


        public async Task<bool> DeleteImage(string imgUrl)
        {
            initCloudinary();
            var basicUrl = imgUrl.Split("/hajur_ko_car_rental").Last().Split(".").First();
            var imgId = $"hajur_ko_car_rental{basicUrl}";
            var b = await cloudinary.DeleteResourcesAsync(imgId);
            var c = b.JsonObj["deleted_counts"][imgId]["original"];
            JToken jToken = JToken.Parse(c.ToString());
    
            int count = jToken.Value<int>();
            if (count > 0)
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
