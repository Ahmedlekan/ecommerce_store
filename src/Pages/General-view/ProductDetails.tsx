import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as generalApiClient from "../../apiClient/general"
import { FaStar } from "react-icons/fa";
import { FaStarHalf } from "react-icons/fa";

const ProductDetails = () => {
    const {productId} = useParams<{ productId: string }>()
    
    // Set the first image as the active image initially
  const [activeImage, setActiveImage] = useState<string | null>(null);

    const productImageListLoading = new Array(4).fill(null)

    const {data : product, isLoading, isError, error} = useQuery({
        queryKey:["fetchProductById", productId],
        queryFn: ()=> generalApiClient.fetchProductById(productId || ""),
        enabled: !!productId,
    })


    // Handle loading state
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Handle error state
    if (isError) {
        return <div>Error: {error?.message || "Failed to fetch product"}</div>;
    }

    // Handle case where product is not found
    if (!product) {
        return <div>No product found</div>;
    }

    // Set the first image as the active image if not already set
  if (!activeImage && product.imageUrls && product.imageUrls.length > 0) {
    setActiveImage(product.imageUrls[0]);
  }

  return (
    <div className='container mx-auto p-4'>

      <div className='min-h-[200px] flex flex-col lg:flex-row gap-4'>
          {/***product Image */}
          <div className='h-96 flex flex-col lg:flex-row-reverse gap-4'>

            <div className='h-[300px] w-[300px] lg:h-96 lg:w-96 
            bg-slate-200 relative p-2'
            >
                <img src={activeImage || undefined} className='h-full w-full 
                    object-scale-down mix-blend-multiply' alt={product.title}
                />
            </div>

            <div className='h-full'>
                {
                isLoading ? (
                    <div className='flex gap-2 lg:flex-col overflow-scroll
                        scrollbar-none h-full'
                    >
                    {
                        productImageListLoading.map((el,index) =>{
                        return(
                            <div className='h-20 w-20 bg-slate-200 rounded animate-pulse' 
                                key={"loadingImage"+index}
                            >
                            </div>
                        )
                        })
                    }
                    </div>
                    
                ) : (
                    
                    <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                    {
                        product?.imageUrls?.map((imgURL) =>{
                        return(
                            <div className='h-20 w-20 bg-slate-200 rounded p-1'
                                key={imgURL}
                                onClick={()=> setActiveImage(imgURL)}
                            >
                            <img src={imgURL} className='w-full h-full object-scale-down 
                                mix-blend-multiply cursor-pointer' 
                                
                            />
                            </div>
                        )
                        })
                    }
                    </div>
                )
                }
            </div>
          </div>

           {/***product details */}
           {
            isLoading ? (
              <div className='grid gap-1 w-full'>
                <p className='bg-slate-200 animate-pulse h-6 lg:h-8 w-full 
                rounded-full inline-block'>
                </p>
                <h2 className='text-2xl lg:text-4xl font-medium h-6 lg:h-8  
                    bg-slate-200 animate-pulse w-full'>
                </h2>
                <p className='capitalize text-slate-400 bg-slate-200 
                    min-w-[100px] animate-pulse h-6 lg:h-8  w-full'>
                </p>

                <div className='text-coral-red bg-slate-200 h-6 lg:h-8 
                    animate-pulse flex items-center gap-1 w-full'
                >
                </div>

                <div className='flex items-center gap-2 text-2xl lg:text-3xl 
                    font-medium my-1 h-6 lg:h-8  animate-pulse w-full'
                >
                  <p className='text-coral-red bg-slate-200 w-full'></p>
                  <p className='text-slate-400 line-through bg-slate-200 w-full'></p>
                </div>

                <div className='flex items-center gap-3 my-2 w-full'>
                  <button className='h-6 lg:h-8  bg-slate-200 rounded animate-pulse w-full'></button>
                  <button className='h-6 lg:h-8  bg-slate-200 rounded animate-pulse w-full'></button>
                </div>

                <div className='w-full'>
                  <p className='text-slate-600 font-medium my-1 h-6 lg:h-8 
                  bg-slate-200 rounded animate-pulse w-full'>
                  </p>
                  <p className=' bg-slate-200 rounded animate-pulse 
                    h-10 lg:h-12  w-full'>
                  </p>
                </div>
              </div>
            ) : 
            (
              <div className='flex flex-col gap-1'>
                <p className='bg-red-200 text-coral-red px-2 rounded-full 
                    inline-block w-fit'
                >
                    {product.brand}
                </p>
                <h2 className='text-2xl lg:text-4xl font-medium'>{product.title}</h2>
                <p className='capitalize text-slate-400'>{product.category}</p>

                <div className='text-coral-red flex items-center gap-1'>
                    <FaStar/>
                    <FaStar/>
                    <FaStar/>
                    <FaStar/>
                    <FaStarHalf/>
                </div>

                <div className='flex items-center gap-2 text-2xl 
                    lg:text-3xl font-medium my-1'
                >
                    <span className="text-lg font-semibold text-indigo-600">
                        ${product.price.toFixed(2)}
                    </span>
                    {product.salePrice && (
                        <span className="text-sm line-through text-gray-400">
                            ${product.salePrice.toFixed(2)}
                        </span>
                    )}
                </div>

                <div className='flex items-center gap-3 my-2'>
                  <button className='border-2 border-coral-red rounded 
                    px-3 py-1 min-w-[120px] text-coral-red font-medium 
                    hover:bg-coral-red hover:text-white' 
                    onClick={()=>{}}
                  >
                    Checkout
                  </button>
                  
                  <button className='border-2 border-coral-red rounded 
                    px-3 py-1 min-w-[120px] font-medium text-white 
                    bg-coral-red hover:text-coral-red hover:bg-white' 
                    onClick={()=>{}}
                  >
                        Add To Cart
                  </button>
                </div>

                <div>
                  <p className='text-slate-600 font-medium my-1'>Description : </p>
                  <p className=' max-w-2xl'>{product.description}</p>
                </div>
              </div>
            )
           }

      </div>

      {/* {
        data.category && (
          <CategroyWiseProductDisplay category={data?.category} heading={"Recommended Product"}/>
        )
      } */}
     



    </div>
  )
}

export default ProductDetails