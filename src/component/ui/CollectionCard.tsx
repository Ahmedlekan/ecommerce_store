
type BlogCardProps = {
    image: any
    name: string
    title: string
    price : number
}

const CollectionCard = ({ image, name, title, price }: BlogCardProps) => {
    return (
      <div className="flex items-center flex-col shadow-lg 
        rounded-lg overflow-hidden"
      >
        <img src={image} alt={title}/>
        <div className="px-4  flex flex-col gap-2">
          <p className="text-gray-600 text-sm">{name}</p>
          <h3 className="text-xl font-bold my-2">{title}</h3>
          <p className=" text-gray-700 text-xl font-bold mb-4">${price}</p>
        </div>
      </div>
    );
};

export default CollectionCard 