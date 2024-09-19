import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
// import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { useRef} from "react";
import { useFormContext } from "react-hook-form";
import Button from "../ui/Button";
import { useState } from "react";
import { Skeleton } from "../ui/Skeleton";
import { ProductsType } from "../../../../backend/src/shared/types";

interface ImageHandlerProps {
  // isEditMode: boolean;
  isCustomStyling?: boolean; // Optional, defaults to false
  isLoading: boolean
}

function ProductImageUpload({isEditMode, isLoading, isCustomStyling = false,}: ImageHandlerProps) {

    const [imageFile, setImageFile] = useState<File | null>(null);
    // const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>("");

    // const {register,formState: { errors }, watch,setValue} = useFormContext<ProductsType>();
  
  //displaying each image url
  // const existingImageUrls = watch("imageUrls")

  //remove imageUrl from the existingImageUrls and save it back to the form
  // const handleDelete = (
  //   event: React.MouseEvent<HTMLButtonElement, MouseEvent>, 
  //   imageUrl: string)=>{
  //     event.preventDefault()
  //     setValue("imageUrls", existingImageUrls.filter((url)=> url !== imageUrl))
  // }
  
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleImageFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    // console.log(event.target.files, "event.target.files");
    const selectedFile = event.target.files?.[0];
    // console.log(selectedFile);
    if (selectedFile) setImageFile(selectedFile);
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  }

  function handleRemoveImage() {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div
      className={`w-full  mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}
    >
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-60" : ""
        } border-2 border-dashed rounded-lg p-4`}
      >
        {/* <Input
          id="image-upload"
          multiple
          accept="image/*"
          type="file"
          className="hidden"
          onChange={handleImageFileChange}
          disabled={isEditMode}
        /> */}

        
        
        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className={`${
              isEditMode ? "cursor-not-allowed" : ""
            } flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image</span>
          </Label>
        ) : isLoading ? (
          <Skeleton className="h-10 bg-gray-100" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon className="w-8 text-primary mr-2 h-8" />
            </div>
            <p className="text-sm font-medium">{imageFile.name}</p>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;


// const ImagesSection = () => {
  
//   const {register,formState: { errors }, watch,setValue} = useFormContext<HotelFormData>();
  
//   //displaying each image url
//   const existingImageUrls = watch("imageUrls")

//   //remove imageUrl from the existingImageUrls and save it back to the form
//   const handleDelete = (
//     event: React.MouseEvent<HTMLButtonElement, MouseEvent>, 
//     imageUrl: string)=>{
//       event.preventDefault()
//       setValue("imageUrls", existingImageUrls.filter((url)=> url !== imageUrl))
//   }

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-3">Images</h2>
//       <div className="border rounded p-4 flex flex-col gap-4">
//         { existingImageUrls && (
//           <div className="grid grid-cols-6 gap-4">
//             {existingImageUrls.map((url)=>(
//               <div className="relative group">
//               <img src={url} className="min-h-full object-cover" />
//               <button
//                 onClick={(event) => handleDelete(event, url)}
//                 className="absolute inset-0 flex items-center justify-center 
//                 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white"
//               >
//                 Delete
//               </button>
//             </div>
//             ))}
//           </div>
//         )}
        
//         <input 
//           type="file"
//           multiple
//           accept="image/*"
//           className="w-full text-gray-700 font-normal"
//           {...register("imageFiles", {
//             validate:(imageFiles)=>{
//               const totalLength = imageFiles.length + (existingImageUrls?.length || 0)
//               if(totalLength === 0){
//                 return "Atlest one image should be added"
//               }
//               if(totalLength > 6){
//                 return "Total number of images cannot be more than 6"
//               }

//               return true
//             }
//           })} 
//         />
//       </div>

//       {errors.imageFiles && (
//         <span className="text-red-500 text-sm font-bold">
//           {errors.imageFiles.message}
//         </span>
//       )}
//     </div>
//   )
// }