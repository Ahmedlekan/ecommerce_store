
type BlogCardProps = {
    image: any
    date: any
    title: string
    description: string
}

const BlogCard = ({ image, date, title, description }: BlogCardProps) => {
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <div className="p-4">
          <p className="text-gray-600 text-sm">{date}</p>
          <h3 className="text-xl font-bold my-2">{title}</h3>
          <p className="text-gray-700 mb-4">{description}</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
            Read More
          </button>
        </div>
      </div>
    );
};

export default BlogCard