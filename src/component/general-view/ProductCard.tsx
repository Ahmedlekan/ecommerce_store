import { Link } from "react-router-dom"
import { ProductsType } from "../../../../backend/src/shared/types";


type ProductCardProps = {
    product: ProductsType
}

const ProductCard: React.FC<ProductCardProps> = ({ product}) => {


    return (
        <div className='scrollbar-none transition-all bg-white shadow-md rounded-lg overflow-hidden'>

            <Link to={"/product/"+product?._id} className='w-full min-w-[280px]  
                md:min-w-[300px] max-w-[280px] md:max-w-[300px] bg-white rounded-sm shadow'
                onClick={()=>{}}
            >
                    <div className='bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] 
                        flex justify-center items-center'
                    >
                        <img src={product?.imageUrls[0]} 
                        className='object-scale-down h-full hover:scale-110 
                        transition-all mix-blend-multiply' alt={product.title}
                        />
                    </div>

                </Link>

                    <div className='p-4 grid gap-3'>
                        <h2 className='font-medium text-base md:text-lg text-ellipsis 
                            line-clamp-1 text-black'>
                                {product?.title}
                        </h2>
                        <p className='capitalize text-slate-500'>{product?.category}</p>
                        
                        <div className='flex justify-between items-center mt-2'>
                            <span className="text-lg font-semibold text-indigo-600">
                                ${product.price.toFixed(2)}
                            </span>
                            {product.salePrice && (
                                <span className="text-sm line-through text-gray-400">
                                    ${product.salePrice.toFixed(2)}
                                </span>
                            )}
                        </div>

                        <button className='text-sm bg-coral-red hover:bg-red-500 
                            text-white px-3 py-0.5 rounded-full' onClick={()=>{}}
                        >
                                Add to Cart
                        </button>
                    </div>

        </div>

    );
  };

  export default ProductCard
  