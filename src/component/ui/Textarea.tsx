import { useFormContext } from 'react-hook-form'
import { initialFormDataProps } from "../common/form";


const Textarea = () => {
    
    const {register, formState:{errors}} = useFormContext<initialFormDataProps>()

  return (
        <label className="text-gray-700 text-sm font-bold flex-1">
          Description
          <textarea
            rows={10}
            className="flex min-h-[80px] w-full rounded-md border border-input 
                bg-background px-3 py-2 text-sm ring-offset-background 
                placeholder:text-muted-foreground focus-visible:outline-none 
                focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            {...register("description", { required: "This field is required" })}
          ></textarea>
          {errors.description && (
            <span className="text-red-500">{errors.description.message}</span>
          )}
        </label>
  )
}

export default Textarea