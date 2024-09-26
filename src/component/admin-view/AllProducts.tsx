import { useQuery } from "@tanstack/react-query";
import * as adminApiClient from "../../apiClient/admin"
import AdminProductCard from './AdminProductCard';

type AllProductsProps = {
    setOpenCreateProductsDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const AllProducts = ({setOpenCreateProductsDialog}: AllProductsProps) => {

    const {data: allProduct} = useQuery({
        queryKey: ["fetchAllProducts"],
        queryFn: adminApiClient.fetchAllProduct
    })

    console.log(allProduct)

    if(!allProduct){
        return (
            <div>No Products Dound</div>
        )
    }

  return (
    <div>
        
        <div className='bg-white py-2 px-4 flex justify-between items-center'>
            <h2 className='font-bold text-lg'>All Product</h2>
            <button  className='border-2 border-red-600 text-red-600 hover:bg-red-600 
                hover:text-white transition-all py-1 px-3 rounded-full ' 
                onClick={()=>setOpenCreateProductsDialog(true)}>Upload Product</button>
        </div>

        {/**all product */}
        {/* <div className='flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scroll'>
          {
            allProduct.map((product)=>{
              return(
                <AdminProductCard data={product} />
                
              )
            })
          }
        </div> */}

        
    </div>
  )
}

export default AllProducts