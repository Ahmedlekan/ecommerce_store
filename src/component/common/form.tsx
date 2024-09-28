import RenderInputComponents from "../ui/RenderInputComponents";
import Button from "../ui/Button";
import { useForm, FormProvider } from 'react-hook-form';
import ProductImageUpload from "../../component/admin-view/ProductImageUpload";
import { CgClose } from "react-icons/cg";

export type initialFormDataProps = {
  _id?: string;
  imageUrls: string[];
  imageFiles: FileList;
  title: string
  description: string
  category: string
  brand: string
  price: number
  salePrice: number
  totalStock: number
  averageReview: number
};

type CommonFormProps = {
    onSave: (productFormData: FormData) => void;
    isLoading: boolean;
    onClose?: ()=> void
}

function CommonForm({onSave, isLoading, onClose}: CommonFormProps) {

    const formMethods = useForm<initialFormDataProps>()
    
    const {handleSubmit} = formMethods


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

      onSave(formData)
    })

  return (
    <FormProvider {...formMethods}>

      <div className="fixed w-full h-full bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50"
      >
        <div className="bg-white p-4 rounded w-full max-w-2xl max-h-[80%] overflow-y-auto"
        >

          <div className='flex justify-between items-center pb-3'>
            <h2 className='font-bold text-lg'>Upload Product</h2>
            <div className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
                <CgClose/>
            </div>
          </div>

          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-3 mt-10">
              <RenderInputComponents />
              <ProductImageUpload />
            </div>

            <Button disabled={isLoading} type="submit" className="mt-2 w-full">
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </form>

        </div>
      </div>
    
    </FormProvider>
  );
}

export default CommonForm;