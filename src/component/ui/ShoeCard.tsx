
interface imgURLProps{
    thumbnail: string,
    bigShoe: string
}

interface ShoeCardProps{
    imgURL: imgURLProps
    changeBigShoeImg: (shoe: string)=> void 
    bigShoeImg: string
}

const ShoeCard = ({imgURL, changeBigShoeImg, bigShoeImg}: ShoeCardProps) => {
    
    const {thumbnail, bigShoe} = imgURL
    
    const handleClick = ()=>{
        if(bigShoeImg !== bigShoe){
            changeBigShoeImg(bigShoe)
        }
    }

  return (
    <div className={`border-2 rounded-xl ${bigShoeImg === bigShoe ? "border-coral-red"
        : "border-transparent"} cursor-pointer max-sm:flex-1`}
        onClick={handleClick}
    >
        <div className=" flex justify-center items-center bg-card bg-center
         bg-cover sm:w-40 sm:h-40 max-sm:p-4 rounded-xl"
        >
            <img src={thumbnail} 
            alt="shoe collection"
            width={127}
            height={103}
            className="object-contain" 
            />
        </div>
    </div>
  )
}

export default ShoeCard