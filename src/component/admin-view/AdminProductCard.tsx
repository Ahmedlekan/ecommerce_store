// import { useState } from 'react'
import { MdModeEditOutline } from "react-icons/md";
// import AdminEditProduct from './AdminEditProduct';
import displayINRCurrency from '../../lib/displayCurrency';
import { ProductsType } from '../../../../backend/src/shared/types';

type AdminProductProps = {
    data: ProductsType 
}

const AdminProductCard = ({data}: AdminProductProps) => {
    // const [editProduct,setEditProduct] = useState(false)

  return (
    <div className='bg-white p-4 rounded '>
       <div className='w-40'>
            <div className='w-32 h-32 flex justify-center items-center'>
              <img src={data?.imageUrls[0] }  className='mx-auto object-fill h-full'/>   
            </div> 
            <h1 className='text-ellipsis line-clamp-2'>{data.title}</h1>

            <div>

                <p className='font-semibold'>
                    {displayINRCurrency({ num: data.salePrice })}
                </p>

                <div className='w-fit ml-auto p-2 bg-green-100 hover:bg-green-600 
                    rounded-full hover:text-white cursor-pointer' onClick={()=>{}}>
                    <MdModeEditOutline/>
                </div>

            </div>

          
       </div>
        
        {/* {
          editProduct && (
            <AdminEditProduct productData={data} onClose={()=>setEditProduct(false)} fetchdata={fetchdata}/>
          )
        } */}
    
    </div>
  )
}

export default AdminProductCard