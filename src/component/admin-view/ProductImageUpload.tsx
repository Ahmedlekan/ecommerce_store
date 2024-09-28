import { useFormContext } from "react-hook-form";
import { initialFormDataProps } from "../common/form"
import { useState, useEffect } from "react";

const ProductImageUpload = () => {
  const {register,formState: { errors }, watch,setValue} = useFormContext<initialFormDataProps>();

  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  //displaying each image url
  const existingImageUrls = watch("imageUrls")
  const existingImageFiles = watch("imageFiles");

  //remove imageUrl from the existingImageUrls and save it back to the form
  const handleDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, imageUrl: string)=>{
      event.preventDefault()
      setValue("imageUrls", existingImageUrls.filter((url)=> url !== imageUrl))
  }

  //remove previewImageUrl from the existingImageUrls and save it back to the form
  const handleDeleteUrl = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number)=>{
      event.preventDefault()
      // Revoke the object URL to release memory
    URL.revokeObjectURL(imagePreviewUrls[index]);
    // Remove the preview URL from the list
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
    
    // Create a DataTransfer object to hold the updated FileList
    const dataTransfer = new DataTransfer();
    
    // Add all files except the one being deleted
    Array.from(existingImageFiles).forEach((file, i) => {
        if (i !== index) {
            dataTransfer.items.add(file);
        }
    });

    // Set the value to the updated FileList
    setValue("imageFiles", dataTransfer.files);

  }

  // Generate preview URLs when new files are selected
  useEffect(() => {
    if (existingImageFiles && existingImageFiles.length > 0) {
      const filePreviews = Array.from(existingImageFiles).map(file =>
        URL.createObjectURL(file)
      );
      setImagePreviewUrls(filePreviews);
    } else {
      setImagePreviewUrls([]);
    }
  }, [existingImageFiles]);


  return (
    <div>
      <h2 className="text-gray-700 text-lg font-bold mb-2">Images</h2>
      
      <div className="border rounded p-4 flex flex-col gap-4">
        {/* Display existing image URLs */}
        { existingImageUrls && (
          <div className="grid grid-cols-6 gap-4">
            {existingImageUrls.map((url)=>(
              <div className="relative group">
              <img src={url} className="min-h-full object-cover" />
              <button
                onClick={(event) => handleDelete(event, url)}
                className="absolute inset-0 flex items-center justify-center 
                bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white"
              >
                Delete
              </button>
            </div>
            ))}
          </div>
        )}

        {/* Preview selected images */}
        {imagePreviewUrls.length > 0 && (
          <div className="grid grid-cols-6 gap-4">
            {imagePreviewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img src={url} alt="Selected image preview" className="min-h-full object-cover" />
                <button
                  onClick={(event) => handleDeleteUrl(event, index)}
                  className="absolute inset-0 flex items-center justify-center 
                  bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
        
        <input 
          type="file"
          multiple
          accept="image/*"
          className="w-full text-gray-700 font-normal"
          {...register("imageFiles", {
            validate:(imageFiles)=>{
              const totalLength = imageFiles.length + (existingImageUrls?.length || 0)
              if(totalLength === 0){
                return "Atlest one image should be added"
              }
              if(totalLength > 6){
                return "Total number of images cannot be more than 6"
              }

              return true
            }
          })} 
        />
      </div>
      
      {errors.imageFiles && (
        <span className="text-red-500 text-sm font-bold">
          {errors.imageFiles.message}
        </span>
      )}
    </div>
  )
}

export default ProductImageUpload

