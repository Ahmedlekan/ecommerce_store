import CommonForm from "../../component/common/form";
import { useAppContext } from "../../contexts/AppContext";
import { useMutation} from "@tanstack/react-query";
import * as adminApiClient from "../../apiClient/admin"
import {useState } from "react";
import AllProducts from "../../component/admin-view/AllProducts";


function Products() {
  const {showToast} = useAppContext()

  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState<boolean>(false);
 
  // const [currentEditedId, setCurrentEditedId] = useState(null);
  // const [productList, setProductList] = useState([]);

  // const { productList } = useSelector((state) => state.adminProducts);
  // const dispatch = useDispatch();
  
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



      {/* <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div> */}

      {/* <CommonForm /> */}
      
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

   
    </div>
  );
}

export default Products;