import RenderInputComponents from "../ui/RenderInputComponents";
import Button from "../ui/Button";
import { useForm, FormProvider } from 'react-hook-form';
import ProductImageUpload from "../../component/admin-view/ProductImageUpload";

export type initialFormDataProps = {
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
}

function CommonForm({onSave, isLoading}: CommonFormProps) {

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
       
       <form onSubmit={onSubmit}>
        <ProductImageUpload
          isLoading={isLoading}
          // isEditMode={currentEditedId !== null}
        />
        <div className="flex flex-col gap-3 mt-10">
          <RenderInputComponents />
        </div>

        <Button disabled={isLoading} type="submit" className="mt-2 w-full">
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    
    </FormProvider>
  );
}

export default CommonForm;