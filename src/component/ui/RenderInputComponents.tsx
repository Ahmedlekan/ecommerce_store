import { useFormContext } from 'react-hook-form'
import { initialFormDataProps } from "../common/form";
import { category, brand } from '../../constant';

type Option = {
  id: string;
  label: string;
};

export type FormControl = {
  label: string;
  name: string;
  componentType: string;
  options: Option[];
};

const RenderInputComponents = () => {

  const {register, formState:{errors}} = useFormContext<initialFormDataProps>()


  return (
    <div className="flex flex-col gap-4">
      
      <label className="text-gray-700 text-lg font-bold">
        Title
        <input
          type="text"
          placeholder='Enter product title'
          className="flex h-10 w-full rounded-md border border-input 
            px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
            focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 my-2"
          {...register("title", { required: "This field is required" })}
        ></input>
        {errors.title && (
          <span className="text-red-500">{errors.title.message}</span>
        )}
      </label>

      <label className="text-gray-700 text-lg font-bold flex-1">
          Description
          <textarea
            placeholder='Enter product description'
            className="flex min-h-[80px] w-full rounded-md border border-input 
              px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 
              focus-visible:ring-offset-2 disabled:cursor-not-allowed 
              disabled:opacity-50 my-2"
            {...register("description", { required: "This field is required" })}
          ></textarea>
          {errors.description && (
            <span className="text-red-500">{errors.description.message}</span>
          )}
      </label>

      <label className="text-gray-700 text-lg font-bold ">
        Category
        <select
          {...register("category", {
            required: "This field is required",
          })}
          className="flex h-10 w-full items-center justify-between 
            rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 
            focus:ring-offset-2 disabled:cursor-not-allowed 
            disabled:opacity-50 [&>span]:line-clamp-1 my-2"
        >
          <option value="" className="text-sm font-bold">
            Category
          </option>
          
          {category.options && category.options.length > 0
          ? category.options.map((cat)=>(
            <option value={cat.label}>{cat.label}</option>
          )) : null
          }
        </select>
        {errors.category && (
          <span className="text-red-500">{errors.category.message}</span>
        )}
      </label>

      <label className="text-gray-700 text-lg font-bold ">
        Brand
        <select
          {...register("brand", {
            required: "This field is required",
          })}
          className="flex h-10 w-full items-center justify-between 
            rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 
            focus:ring-offset-2 disabled:cursor-not-allowed 
            disabled:opacity-50 [&>span]:line-clamp-1 my-2"
        >
          <option value="" className="text-sm font-bold">
            Brand
          </option>
          
          {brand.options && brand.options.length > 0
          ? brand.options.map((bra)=>(
            <option value={bra.label}>{bra.label}</option>
          )) : null
          }
        </select>
        {errors.brand && (
          <span className="text-red-500">{errors.brand.message}</span>
        )}
      </label>

      <label className="text-gray-700 text-lg font-bold">
        Price
        <input
          type="number"
          placeholder='Enter product price'
          min={0}
          className="flex h-10 w-full rounded-md border border-input 
            px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
            focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 my-2"
          {...register("price", { required: "This field is required" })}
        ></input>
        {errors.price && (
          <span className="text-red-500">{errors.price.message}</span>
        )}
      </label>

      <label className="text-gray-700 text-lg font-bold">
        Sale Price
        <input
          type="number"
          placeholder='Enter product sales price'
          min={0}
          className="flex h-10 w-full rounded-md border border-input 
            px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
            focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 my-2"
          {...register("salePrice", { required: "This field is required" })}
        ></input>
        {errors.salePrice && (
          <span className="text-red-500">{errors.salePrice.message}</span>
        )}
      </label>

      <label className="text-gray-700 text-lg font-bold">
        Total Stock
        <input
          type="number"
          placeholder='Enter product total stock'
          min={0}
          className="flex h-10 w-full rounded-md border border-input 
            px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
            focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 my-2"
          {...register("totalStock", { required: "This field is required" })}
        ></input>
        {errors.totalStock && (
          <span className="text-red-500">{errors.totalStock.message}</span>
        )}
      </label>

    </div>
  )
}

export default RenderInputComponents





