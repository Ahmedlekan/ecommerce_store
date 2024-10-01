import * as generalApiClient from "../../apiClient/general"
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ProductsType } from "../../../../backend/src/shared/types"

const CategoryList = () => {

    const {data: categoryProduct, isLoading, isError} = useQuery<ProductsType[]>({
        queryKey: ["categories"],
        queryFn: generalApiClient.CategoryList
    })

    const categoryLoading = new Array(8).fill(null)

    if(isLoading){
        return (
            <div>Loading...</div>
        )
    }

    if(isError){
      return <div> No Products Found</div>
    }


  return (
    <div className='container mx-auto pt-16 p-4 bg-gray-100 overflow-scroll scrollbar-none'>

        <div className='flex items-center gap-4 justify-between'>

            {
                isLoading ? (
                    categoryLoading.map((el,index)=>{
                        return(
                            <div className='h-16 w-16 md:w-20 md:h-20 
                                rounded-full overflow-hidden bg-slate-200 
                                animate-pulse' key={"categoryLoading"+index}
                            >
                            </div>
                        )
                }) 
                ) :
                (
                    categoryProduct?.map((product, index)=>{
                        return (
                            <Link to={"/product-category?category="+product?.category} 
                                className='cursor-pointer' key={index}
                            >
                                <div className='w-16 h-16 md:w-20 md:h-20 lg:w-40 lg:h-40 
                                    rounded-full overflow-hidden p-4 bg-slate-200 
                                    flex items-center justify-center'
                                >
                                    <img src={product?.imageUrls[0]} 
                                        alt={product?.category} 
                                        className='h-full object-scale-down mix-blend-multiply 
                                            hover:scale-125 transition-all'
                                    />
                                </div>
                                <p className='text-center text-sm md:text-base lg:text-lg
                                    font-semibold capitalize mt-2'
                                >
                                        {product?.category}
                                </p>
                            </Link>
                        )
                    })
                )
            }

        </div>
    
    </div>
  )
}

export default CategoryList