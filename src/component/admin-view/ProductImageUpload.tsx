import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Label } from "../ui/Label";
import Button from "../ui/Button";
import { useState, useRef } from "react";
import { Skeleton } from "../ui/Skeleton";
import { useFormContext } from "react-hook-form";
import { initialFormDataProps } from "../common/form";

interface ImageHandlerProps {
  // isEditMode: boolean;
  isCustomStyling?: boolean; // Optional, defaults to false
  isLoading: boolean
}

function ProductImageUpload({isEditMode, isLoading, isCustomStyling = false}: ImageHandlerProps) {

  const inputRef = useRef(null);

  const formContext = useFormContext<initialFormDataProps>();

  console.log("FormContext: ", formContext); // Check if this logs the correct form context.

  if (!formContext) {
    throw new Error("useFormContext is returning null.");
  }

  const {register, formState: { errors }, watch, setValue} = formContext
  
  const existingImageUrls = watch("imageUrls")

  const [imageFile, setImageFile] = useState<File | null>(null);


  // function handleImageFileChange(event: React.ChangeEvent<HTMLInputElement>) {
  //   // console.log(event.target.files, "event.target.files");
  //   const selectedFile = event.target.files?.[0];
  //   // console.log(selectedFile);
  //   if (selectedFile) setImageFile(selectedFile);
  // }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  }

  // function handleRemoveImage() {
  //   setImageFile(null);
  //   if (inputRef.current) {
  //     inputRef.current.value = "";
  //   }
  // }

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
        <input 
          type="file"
          id="image-upload"
          accept="image/*"
          className="hidden"
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
              onClick={()=>{}}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
  
      </div>

      {errors.imageFiles && (
        <span className="text-red-500 text-sm font-bold">
          {errors.imageFiles.message}
        </span>
      )}

    </div>
  );
}

export default ProductImageUpload;

