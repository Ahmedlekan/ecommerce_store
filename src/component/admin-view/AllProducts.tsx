import { useQuery } from "@tanstack/react-query";
import * as adminApiClient from "../../apiClient/admin"
import AdminProductCard from './AdminProductCard';

type AllProductsProps = {
    setOpenCreateProductsDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const AllProducts = ({setOpenCreateProductsDialog}: AllProductsProps) => {

    const {data: allProduct, isLoading, isError} = useQuery({
        queryKey: ["fetchAllProducts"],
        queryFn: adminApiClient.fetchAllProduct
    })

    if(isLoading){
        return (
            <div>Loading...</div>
        )
    }

    if(isError){
      return <div> No Products Found</div>
    }

  return (
    <div>
        
        <div className='bg-gray-100 py-4 px-4 flex justify-between items-center'>
            <h2 className='font-bold text-lg'>All Product</h2>
            <button  className='border-2 border-red-600 text-red-600 hover:bg-red-600 
                hover:text-white transition-all py-1 px-3 rounded-full ' 
                onClick={()=>setOpenCreateProductsDialog(true)}>Upload Product</button>
        </div>

        {/**all product */}
        <div className='grid gap-4 md:grid-cols-3 lg:grid-cols-4 overflow-y-scroll h-[calc(100vh-190px)]'>
          {
            allProduct.map((product, index)=>{
              return(
                <AdminProductCard data={product} key={index+"allProduct"} />
                
              )
            })
          }
        </div>

        
    </div>
  )
}

export default AllProducts