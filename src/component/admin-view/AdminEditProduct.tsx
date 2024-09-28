
import { useAppContext } from '../../contexts/AppContext'
import { useMutation, useQueryClient} from '@tanstack/react-query'
import * as adminApiClient from "../../apiClient/admin"
import RenderInputComponents from "../ui/RenderInputComponents";
import Button from "../ui/Button";
import { useForm, FormProvider } from 'react-hook-form';
import ProductImageUpload from "../../component/admin-view/ProductImageUpload";
import { CgClose } from "react-icons/cg";
import { initialFormDataProps } from '../common/form';
import { ProductsType } from '../../../../backend/src/shared/types';


type AdminEditProductProps = {
    onClose: ()=> void
    productData: ProductsType
}

const AdminEditProduct = ({onClose, productData}: AdminEditProductProps) => {
    const {showToast} = useAppContext()
    const queryClient = useQueryClient()

    const formMethods = useForm<initialFormDataProps>({
        defaultValues: productData,  // Pre-fill the form with the product data
    })
    
    const {handleSubmit} = formMethods

    // update the product after editing
    const {mutate, isPending} = useMutation( {
      mutationFn: adminApiClient.updateProductById,
      onSuccess: async () => {
        showToast({ message: "Product Updated!", type: "SUCCESS" });
        queryClient.invalidateQueries()
        
      },
      onError: (error: Error) => {
        showToast({ message: error.message, type: "ERROR" });
      },
    });

    const handleSave = (productFormData: FormData)=>{
      mutate(productFormData)
    }


    const onSubmit = handleSubmit((formDataJson : initialFormDataProps)=> {
        const formData = new FormData()
        // Append image URLs. The updated imageUrls
      if (formDataJson.imageUrls){
        formDataJson.imageUrls.forEach((url, index)=>{
          formData.append(`imageUrls[${index}]`, url)
        })
      }
      // Append image Files
      if(formDataJson.imageFiles){
        Array.from(formDataJson.imageFiles).forEach((imageFile) => {
          formData.append(`imageFiles`, imageFile);
        });
      }

      formData.append("title", formDataJson.title);
      formData.append("description", formDataJson.description);
      
      formData.append("category", formDataJson.category);
      formData.append("brand", formDataJson.brand);

      formData.append("price", formDataJson.price.toString());
      formData.append("salePrice", formDataJson.salePrice?.toString());
      formData.append("totalStock", formDataJson.totalStock?.toString() );

      // **Append the product ID**
      if (formDataJson._id) {
        formData.append("productId", formDataJson._id);
        } else {
            showToast({ message: "Product ID is missing", type: "ERROR" });
            return;
        }

      handleSave(formData)
    })


  return (
    <FormProvider {...formMethods}>

      <div className="fixed w-full h-full bg-slate-200 bg-opacity-50 top-0 left-0 
        flex justify-center items-center z-50 transition-opacity duration-300 
        ease-in-out"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[80%] 
            overflow-y-auto relative animate-fade-in"
        >

          <div className='flex justify-between items-center pb-3'>
            <h2 className='font-bold text-lg'>Edit Product</h2>
            <div className='w-fit ml-auto text-2xl text-gray-500 
                hover:text-red-600 transition-colors' 
                onClick={onClose}
            >
                <CgClose/>
            </div>
          </div>

          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-3 mt-10">
              <RenderInputComponents />
              <ProductImageUpload />
            </div>

            <Button disabled={isPending} type="submit" className="w-full py-2 px-4 bg-blue-600 
            text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 
            transition-all duration-300 disabled:bg-gray-400"
            >
              {isPending ? "Updating..." : "Update"}
            </Button>
          </form>

        </div>
      </div>
    
    </FormProvider>
  )
}

export default AdminEditProduct