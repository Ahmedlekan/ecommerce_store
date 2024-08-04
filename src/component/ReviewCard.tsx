import {star} from "../assets/icons"

interface ReviewCardPArops {
    imgURL?: string;
    customerName: string;
    rating: number;
    feedback: string;
}

const ReviewCard = ({imgURL, customerName, rating, feedback}:ReviewCardPArops) => {
  return (
    <div className="flex justify-center items-center flex-col">
        <img src={imgURL} alt={customerName}
         className="object-contain w-[120px] h-[120px] rounded-full"
         />
         <p className="max-w-sm text-center mt-6 info-text">{feedback}</p>
         <div className="mt-4 flex justify-center items-center gap-2.5">
            <img src={star} alt="star" width={24} height={24} 
                className="object-containe m-0" 
            />
            <p className="text-xl font-montserrat text-slate-gray">({rating})</p>
         </div>
         <h3 className="mt-1 font-palanquin text-3xl font-bold text-center">
            {customerName}
        </h3>
    </div>
  )
}

export default ReviewCard