
import { collection } from '../../constant'
import CollectionCard from '../ui/CollectionCard'

const Collection = () => {
  return (
    <div className='container pt-10 px-4'>
        <h3 className="text-4xl font-palanquin font-bold">
            Featured <span className="text-coral-red">Collection</span>
        </h3>

        <div className="container mx-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {collection.map((product, index) => (
                <CollectionCard
                    key={index}
                    image={product.image}
                    name={product.name}
                    title={product.title}
                    price={product.price}
                />
                ))}
            </div>
        </div>

    </div>
  )
}

export default Collection