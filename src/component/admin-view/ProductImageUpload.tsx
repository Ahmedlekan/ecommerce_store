import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { useEffect, useRef, Dispatch, SetStateAction } from "react";
import Button from "../ui/Button";
// import axios from "axios";
import { Skeleton } from "../ui/Skeleton";

interface ImageHandlerProps {
  imageFile: File | Blob | null;
  setImageFile: Dispatch<SetStateAction<File | Blob | null>>;
  imageLoadingState: boolean;
  uploadedImageUrl: string | null;
  setUploadedImageUrl: Dispatch<SetStateAction<string | null>>;
  setImageLoadingState: Dispatch<SetStateAction<boolean>>;
  // isEditMode: boolean;
  isCustomStyling?: boolean; // Optional, defaults to false
}

function ProductImageUpload({imageFile,setImageFile,imageLoadingState,uploadedImageUrl,
  setUploadedImageUrl,setImageLoadingState,isEditMode,isCustomStyling = false,}: ImageHandlerProps) {
  
    const inputRef = useRef(null);

  console.log(isEditMode, "isEditMode");

  function handleImageFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.files, "event.target.files");
    const selectedFile = event.target.files?.[0];
    console.log(selectedFile);

    if (selectedFile) setImageFile(selectedFile);
  }

  // function handleDragOver(event) {
  //   event.preventDefault();
  // }

  // function handleDrop(event) {
  //   event.preventDefault();
  //   const droppedFile = event.dataTransfer.files?.[0];
  //   if (droppedFile) setImageFile(droppedFile);
  // }

  // function handleRemoveImage() {
  //   setImageFile(null);
  //   if (inputRef.current) {
  //     inputRef.current.value = "";
  //   }
  // }

  // async function uploadImageToCloudinary() {
  //   setImageLoadingState(true);
  //   const data = new FormData();
  //   data.append("my_file", imageFile);
  //   const response = await axios.post(
  //     "http://localhost:5000/api/admin/products/upload-image",
  //     data
  //   );
  //   console.log(response, "response");

  //   if (response?.data?.success) {
  //     setUploadedImageUrl(response.data.result.url);
  //     setImageLoadingState(false);
  //   }
  // }

  // useEffect(() => {
  //   if (imageFile !== null) uploadImageToCloudinary();
  // }, [imageFile]);

  return (
    <div
      className={`w-full  mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}
    >
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div
        onDragOver={()=>{}}
        onDrop={()=>{}}
        className={`${
          isEditMode ? "opacity-60" : ""
        } border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
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
        ) : imageLoadingState ? (
          <Skeleton className="h-10 bg-gray-100" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon className="w-8 text-primary mr-2 h-8" />
            </div>
            <p className="text-sm font-medium">image file name</p>
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
    </div>
  );
}

export default ProductImageUpload;