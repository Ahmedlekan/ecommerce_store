import {star} from "../assets/icons"

interface PopularProductCardProps {
    imgURL: any;
    name: string;
    price: string;
}

const PopularProductCard = ({imgURL, name, price}: PopularProductCardProps) => {
  return (
    <div className="flex flex-1 flex-col w-full max-sm:w-full">
        <img 
            src={imgURL} alt={name} className="w-[280px] h-[280px]" 
        />

        <div className="flex justify-start gap-2.5 mt-8">
            <img src={star} alt="rating" width={24} height={24} />
            <p className="text-xl font-montserrat leading-normal text-slate-gray">
                (4.5)
            </p>
        </div>
        <h3 className=" mt-2 text-2xl font-semibold leading-normal font-palanquin">
            {name}
        </h3>
        <p className="mt-2 font-semibold font-montserrat 
            leading-normal text-coral-red text-2lx"
        >
            {price}
        </p>
    </div>
  )
}

export default PopularProductCard