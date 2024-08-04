import {offer} from "../assets/images"
import {arrowRight} from "../assets/icons"

import Button from "../component/Button"

const SpecialOffer = () => {
  return (
    <section className="flex flex-wrap items-center 
      max-xl:flex-col-reverse gap-10 max-container"
    >
      <div className="flex-1">
        <img src={offer} width={773} height={687} alt="offer" 
          className="object-contain w-full" 
        />
      </div>

      <div className="flex flex-1 flex-col">
        <h2 className="font-palaquin text-4xl font-bold capitalize lg:max-w-lg">
          <span className="text-coral-red">Special </span>Offer
        </h2>
        <p className="mt-4 lg:max-w-lg info-text">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. 
          Iste inventore illo dolorum laudantium voluptatum modi, 
          ex consequuntur atque eaque expedita!
        </p>
        <p className="mt-6 lg:max-w-lg info-text">
          Our dedication to detail and excelence ensures your satisfaction
          voluptatum modi, ex consequuntur atque eaque expedita! Eveniet 
          consequatur
        </p>
        <div className="mt-11 flex flex-wrap gap-4">
          <Button label="Shoe now" iconURL={arrowRight} />
          <Button label="Learn more" backgroundColor="bg-white" 
            borderColor="border border-slate-gray" textColor="text-slate-gray" 
          />
        </div>
      </div>

    </section>
  )
}

export default SpecialOffer