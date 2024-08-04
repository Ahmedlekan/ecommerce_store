import Button from "../component/Button"
import {shoe8} from "../assets/images"

const SuperQuality = () => {
  return (
    <section id="about-us" 
      className="flex justify-between items-center 
      max-lg:flex-col gap-10 w-full max-container"
    >
      <div className="flex flex-1 flex-col">
        <h2 className="font-palaquin text-4xl 
          font-bold capitalize lg:max-w-lg"
        >
          We privide you <span className="text-coral-red">super </span>
          <span className="text-coral-red">Quality</span> shoes
        </h2>
        <p className="mt-4 lg:max-w-lg info-text">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. 
          Iste inventore illo dolorum laudantium voluptatum modi, 
          ex consequuntur atque eaque expedita! Eveniet consequatur 
          consectetur molestias consequuntur
        </p>
        <p className="mt-6 lg:max-w-lg info-text">
          Our dedication to detail and excelence ensures your satisfaction
        </p>
        <div className="mt-11">
          <Button label="View Details" />
        </div>
      </div>

      <div className="flex-1 flex justify-center items-center">
        <img src={shoe8} width={570} height={522} alt="shoe8" className="object-contain" />
      </div>
    </section>
  )
}

export default SuperQuality