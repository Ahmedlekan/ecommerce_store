import ProductImageUpload from "../../component/admin-view/ProductImageUpload";
import Button from "../../component/ui/Button";
// import { addFeatureImage, getFeatureImages } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient  } from "@tanstack/react-query";
import * as commonApiClent from "../../apiClient/common/index"
import { useAppContext } from "../../contexts/AppContext";
import { FeatureType } from "../../../../backend/src/shared/types";

function AdminDashboard() {
  const queryClient = useQueryClient();
  const {showToast} = useAppContext()

  const [imageFile, setImageFile] = useState<File | Blob | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>("");
  const [imageLoadingState, setImageLoadingState] = useState<boolean>(false);

  // Mutation for adding a feature image
  const mutation = useMutation({
    mutationFn: commonApiClent.addFeatureImage,
    onSuccess: async ()=> {
        showToast({ message: "Login Successful", type: "SUCCESS" })
        await queryClient.invalidateQueries({ queryKey: ["getFeatureImages"] })
    },
    onError: (error: Error)=> {
        showToast({ message: error.message, type: "ERROR"})
    }
  })

  const onSubmit = (uploadedImageUrl: FeatureType)=>{
    mutation.mutate(uploadedImageUrl, {
      onSuccess: async ()=>{
        setImageFile(null);
        setUploadedImageUrl("");
      }
    })
  }

  // Fetch feature images using react-query
  function useFeatureImages() {
    const { data, isLoading, error } = useQuery({
      queryKey: ["getFeatureImages"],
      queryFn: commonApiClent.getFeatureImages
    });

    return {
      featureImages: data,
      isLoading,
      error,
    };

  }

  // function handleUploadFeatureImage() {
  //   dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
  //     if (data?.payload?.success) {
  //       dispatch(getFeatureImages());
  //       setImageFile(null);
  //       setUploadedImageUrl("");
  //     }
  //   });
  // }

  // useEffect(() => {
  //   dispatch(getFeatureImages());
  // }, [dispatch]);

  // console.log(featureImageList, "featureImageList");

  return (
    <div>
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
        // isEditMode={currentEditedId !== null}
      />
      
      {/* <Button onClick={handleUploadFeatureImage} className="mt-5 w-full">
        Upload
      </Button> */}
      <Button onClick={()=>{}} className="mt-5 w-full">
        Upload
      </Button>

      {/* <div className="flex flex-col gap-4 mt-5">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((featureImgItem) => (
              <div className="relative">
                <img
                  src={featureImgItem.image}
                  className="w-full h-[300px] object-cover rounded-t-lg"
                />
              </div>
            ))
          : null}
      </div> */}

    </div>
  );
}

export default AdminDashboard;