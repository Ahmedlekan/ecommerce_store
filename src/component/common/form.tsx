import Input from "../ui/Input";

import { Label } from "../ui/Label";
import { Select, SelectContent,SelectItem,SelectTrigger, SelectValue } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import Button from "../ui/Button";
import { useForm, FormProvider } from 'react-hook-form';
import ProductImageUpload from "../../component/admin-view/ProductImageUpload";

type FormElementOption = {
    id: string;
    label: string;
};

export interface FormControl {
    label: string;
    name: string;
    componentType: "input" | "textarea" | "select";
    type?: string;
    placeholder?: string;
    options?: FormElementOption[];
}

export type initialFormDataProps = {
  imageUrls: string[];
  imageFiles?: FileList;
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
    formControls?: FormControl[] 
}

function CommonForm({formControls, onSave, isLoading}: CommonFormProps) {

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
      // formData.append("description", formDataJson.description);
      // formData.append("category", formDataJson.category);
      // formData.append("brand", formDataJson.brand);

      // formData.append("price", formDataJson.price.toString());
      // formData.append("salePrice", formDataJson.salePrice?.toString());
      // formData.append("totalStock", formDataJson.totalStock?.toString() );

        onSave(formData)
    })
        

    function renderInputsByComponentType(getControlItem: FormControl) {
    let element = null;

    //    <label className="text-gray-700 text-sm font-bold flex-1">
    //       Country
    //       <input
    //         type="text"
    //         className="border rounded w-full py-1 px-2 font-normal"
    //         {...register("country", { required: "This field is required" })}
    //       ></input>
    //       {errors.country && (
    //         <span className="text-red-500">{errors.country.message}</span>
    //       )}
    //     </label>

    // <label className="text-gray-700 text-sm font-bold flex-1">
    //       Description
    //       <textarea
    //         rows={10}
    //         className="border rounded w-full py-1 px-2 font-normal"
    //         {...register("description", { required: "This field is required" })}
    //       ></textarea>
    //       {errors.description && (
    //         <span className="text-red-500">{errors.description.message}</span>
    //       )}
    //   </label>


    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input/>

        );

        break;

      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlItem.name]: value,
              })
            }
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );

        break;
        
      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );

        break;

      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;
    }

    return element;
  }

  return (
    <FormProvider {...formMethods}>
       <form onSubmit={onSubmit}>
        <ProductImageUpload
          isLoading={isLoading}
          // isEditMode={currentEditedId !== null}
        />
      
      <div className="flex flex-col gap-3 mt-10">
        <div className="grid w-full gap-1.5">
              <Input/>
        </div>
      </div>

      <Button disabled={isLoading} type="submit" className="mt-2 w-full">
        {isLoading ? "Submitting..." : "Submit"}
      </Button>
    </form>
    </FormProvider>
  );
}

export default CommonForm;