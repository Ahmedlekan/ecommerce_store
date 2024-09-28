import CommonForm from "../../component/common/form";
import { useAppContext } from "../../contexts/AppContext";
import { useMutation} from "@tanstack/react-query";
import * as adminApiClient from "../../apiClient/admin"
import {useState } from "react";
import AllProducts from "../../component/admin-view/AllProducts";


function Products() {
  const {showToast} = useAppContext()

  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState<boolean>(false);
 
  const {mutate, isPending} = useMutation({
    mutationFn: adminApiClient.addProduct,
    onSuccess: async (responseData) => {
      console.log("Mutation Result:", responseData); 
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
    <div>
        <AllProducts
          setOpenCreateProductsDialog={setOpenCreateProductsDialog}
        />

        {/**upload product component */}
        {
          openCreateProductsDialog && (
            <CommonForm 
              isLoading={isPending} 
              onSave={handleSave} 
              onClose={()=>setOpenCreateProductsDialog(false)}/>
          )
        }
    </div>
  );
}

export default Products;