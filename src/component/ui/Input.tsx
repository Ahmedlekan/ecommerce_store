import { useFormContext } from 'react-hook-form'
import { initialFormDataProps } from "../common/form";


const Input = () => {
  
  const {register, formState:{errors}} = useFormContext<initialFormDataProps>()

  return (
    <label className="text-gray-700 text-sm font-bold flex-1">
        Title
        <input
          type="text"
          className="flex h-10 w-full rounded-md border border-input 
            bg-background px-3 py-2 text-sm ring-offset-background 
            file:border-0 file:bg-transparent file:text-sm file:font-medium 
            placeholder:text-muted-foreground focus-visible:outline-none 
            focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
            disabled:cursor-not-allowed disabled:opacity-50"
          {...register("title", { required: "This field is required" })}
        ></input>
        {errors.title && (
          <span className="text-red-500">{errors.title.message}</span>
        )}
    </label>
  )
}

export default Input



