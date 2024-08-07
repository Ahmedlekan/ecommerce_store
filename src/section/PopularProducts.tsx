import { products } from "../constant"
import PopularProductCard from "../component/PopularProductCard"

const PopularProducts = () => {
  return (
    <section id="products" className="max-container max-sm:mt-12">
      <div className="flex flex-col gap-5 justify-start">
        <h1 className="text-4xl font-palanquin font-bold">
          Our <span className="text-coral-red">Popular</span> Products
        </h1>
        <p className="lg:max-w-lg mt-2 font-montserrat text-slate-gray">
          Experience top-notch quality and style with our south-after selections. 
          Discover a world of comfort, design and value
        </p>
      </div>

      <div className="mt-16 grid lg:grid-cols-4 md:grid-cols-3 
        sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-14"
      >
        {products.map((product)=>(
          <div key={product.name}>
            <PopularProductCard {...product} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default PopularProducts