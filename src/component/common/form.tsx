import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Select, SelectContent,SelectItem,SelectTrigger, SelectValue } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import Button from "../ui/Button";
import { useForm } from 'react-hook-form';
import { initialFormDataProps } from "../../pages/admin-view/Products";

type FormElementOption = {
    id: string;
    label: string;
};

export interface FormControl {
    label: string;
    name: string;
    componentType: "input" | "textarea" | "select"; // Restrict component types
    type?: string; // Optional for inputs
    placeholder?: string;
    options?: FormElementOption[]; // Optional for select elements
}

type CommonFormProps = {
    onSave: (productFormData: FormData) => void;
    isLoading?: boolean;
    formControls?: FormControl[] 
    formData: initialFormDataProps
    setFormData: React.Dispatch<React.SetStateAction<initialFormDataProps>>;
}

function CommonForm({formControls, onSave, isLoading, formData, setFormData}: CommonFormProps) {

    const formMethods = useForm<initialFormDataProps>()
    const {handleSubmit} = formMethods

    const onSubmit = handleSubmit(()=> {
        const formData = new FormData()



        onSave(formData)
    })
        

    function renderInputsByComponentType(getControlItem: FormControl) {
    let element = null;
    const value = String(formData[getControlItem.name as keyof initialFormDataProps]) || "";

    switch (getControlItem.componentType) {
      case "input":
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
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls?.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1">{controlItem.label}</Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>

      <Button disabled={isLoading} type="submit" className="mt-2 w-full">
      {isLoading ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;