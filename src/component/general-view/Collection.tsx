import * as generalApiclient from "../../apiClient/general"
import { useQuery } from "@tanstack/react-query"
import { ProductsType } from "../../../../backend/src/shared/types";
import ProductCard from "./ProductCard";
import { Skeleton } from "../ui/Skeleton";

const Collection = () => {

    const {data: product, isLoading, isError} = useQuery({
        queryKey: ["fetchRandomProducts"],
        queryFn: generalApiclient.fetchRandomProduct
      })
    
      const shuffleArray = (array: ProductsType[]) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
      };

      // Randomize the products if they exist
  const randomizedProducts = product ? shuffleArray([...product]) : [];

  // Get the first 4 random products
  const randomProducts = randomizedProducts?.slice(0, 6) || [];

  if (isLoading){
    return <Skeleton />
  }
  if (isError || !product) return <p>No Products Found</p>;

  return (
    <div className='container pt-10 px-4'>
        <h3 className="text-4xl font-palanquin font-bold">
            Featured <span className="text-coral-red">Collection</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-4">
            {randomProducts.map((product) => (
                <ProductCard key={product._id} product={product}  />
            ))}
        </div>

    </div>
  )
}

export default Collection