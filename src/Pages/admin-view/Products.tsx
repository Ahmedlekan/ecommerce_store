import ProductImageUpload from "../../component/admin-view/ProductImageUpload";
import AdminProductTile from "../../component/admin-view/ProductTile";
import CommonForm from "../../component/common/form";
import Button from "../../component/ui/Button";
import {Sheet,SheetContent,SheetHeader,SheetTitle} from "../../component/ui/Sheet"
import { useAppContext } from "../../contexts/AppContext";
import { useMutation } from "@tanstack/react-query";
import * as adminApiClient from "../../apiClient/admin"
import { Fragment, useEffect, useState } from "react";
import { addProductFormElements } from "../../constant";

export type initialFormDataProps = {
  image: string[]
  title: string
  description: string
  category: string
  brand: string
  price: number
  salePrice: number
  totalStock: number
  averageReview: number
};

const initialFormData: initialFormDataProps = {
  image: [],
  title: "",
  description: "",
  category: "",
  brand: "",
  price: 0,
  salePrice: 0,
  totalStock: 0,
  averageReview: 0,
};

function AdminProducts() {
  const {showToast} = useAppContext()

  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState<initialFormDataProps>(initialFormData);
  // const [imageFile, setImageFile] = useState(null);
  // const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  // const [imageLoadingState, setImageLoadingState] = useState(false);
  // const [currentEditedId, setCurrentEditedId] = useState(null);
  // const [productList, setProductList] = useState([]);

  // const { productList } = useSelector((state) => state.adminProducts);
  // const dispatch = useDispatch();

  
  const {mutate, isPending} = useMutation( {
    mutationFn: adminApiClient.addProduct,
    onSuccess: async () => {
      showToast({ message: "Product Saved!", type: "SUCCESS" });
      },
      onError: (error: Error) => {
        showToast({ message: error.message, type: "ERROR" });
      },
  });

  const handleSave = (productFormData: FormData)=>{
    mutate(productFormData)
  }

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>
      
      {/* <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div> */}

      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          // setCurrentEditedId(null);
          // setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto bg-gray-100">
          {/* <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader> */}

          {/* <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          /> */}

          <div className="py-6">
            <CommonForm
              onSave={handleSave}
              isLoading={isPending}
              // buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={addProductFormElements}
              formData={formData}
              setFormData={setFormData}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;