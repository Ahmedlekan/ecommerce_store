
import { blogs } from '../../constant'
import BlogCard from '../BlogCard'

const Blog = () => {
  return (
    <div className=' container pt-10 px-4'>
        <h3 className="text-4xl font-palanquin font-bold">
            Our <span className="text-coral-red">Latest</span> News
        </h3>

        <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {blogs.map((product, index) => (
          <BlogCard
            key={index}
            image={product.image}
            date={product.date}
            title={product.title}
            description={product.description}
          />
        ))}
      </div>
    </div>

        

    </div>
  )
}

export default Blog