import { reviews } from "../../constant"
import ReviewCard from "../ui/ReviewCard"

const CustomerReviews = () => {
  return (
    <section className="container py-10">
      <h3 className="font-bold font-palanquin text-4xl text-center"> 
        What Our <span className="text-coral-red"> Customers </span> Says? 
      </h3>
      <p className="mt-4 info-text m-auto max-w-lg text-center">Hear genuine stories 
      from our satisfied customers about their exception experience with us
      </p>

      <div className="mt-4 flex-1 flex justify-evenly items-center 
        max-lg:flex-col gap-14"
      >
        {reviews.map( review =>(
          <div key={review.customerName}>
            <ReviewCard {...review} />
          </div>
        ) )}
      </div>

    </section>
  )
}

export default CustomerReviews