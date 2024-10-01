// import { useState } from 'react'
import AdminEditProduct from "./AdminEditProduct";
import { ProductsType } from '../../../../backend/src/shared/types';
import { useState } from "react";
import { CardContent, Card, CardFooter } from "../ui/Card";
import Button from "../ui/Button";

type AdminProductProps = {
    data: ProductsType 
}

const AdminProductCard = ({data}: AdminProductProps) => {
    const [editProduct,setEditProduct] = useState<boolean>(false)

  return (
    <Card className='w-full max-w-sm mx-auto'>
       
       <div>
            {/* <div className='w-32 h-32 flex justify-center items-center'>
              <img src={data?.imageUrls[0] }  className='mx-auto object-fill h-full'/>   
            </div> */}
          <div className="relative">
            <img
              src={data?.imageUrls[0]}
              alt={data.title}
              className="w-full h-[200px] object-fill rounded-t-lg mx-auto"
            />
          </div>

          <CardContent>
            <h2 className="text-xl font-bold mb-2 mt-2">{data.title}</h2>
            <div className="flex justify-between items-center mb-2">
              <span
                className={`${
                  data.salePrice > 0 ? "line-through" : ""
                } text-lg font-semibold text-primary`}
              >
                ${data.price}
              </span>
              {data.salePrice > 0 ? (
                <span className="text-lg font-bold">${data.salePrice}</span>
              ) : null}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between items-center">

            <Button onClick={()=>setEditProduct(true)}>
              Edit
            </Button>
            
            <Button onClick={()=>setEditProduct(true)}>
              Edit
            </Button>
          </CardFooter>
          
       </div>
        
        {
          editProduct && (
            <AdminEditProduct productData={data} onClose={()=>setEditProduct(false)} />
          )
        }
    
    </Card>
  )
}

export default AdminProductCard