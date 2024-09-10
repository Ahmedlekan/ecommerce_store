import Button from "../ui/Button"
import camera1 from "../../assets/images/camera1.jpg"

const SuperQuality = () => {
  return (
    <div className=" pt-10 flex justify-between items-center 
      max-lg:flex-col container px-4"
    >
      <div className="flex flex-1 flex-col">
        <h2 className="font-palaquin text-4xl 
          font-bold capitalize lg:max-w-2xl"
        >
          We privide you <span className="text-coral-red">super </span>
          <span className="text-coral-red">Quality</span> products
        </h2>
        <p className="mt-4  info-text">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. 
          Iste inventore illo dolorum laudantium voluptatum modi, 
          ex consequuntur atque eaque expedita! Eveniet consequatur 
          consectetur molestias consequuntur
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. 
          Iste inventore illo dolorum laudantium voluptatum modi, 
          ex consequuntur atque eaque expedita! Eveniet consequatur 
          consectetur molestias consequuntur
        </p>
        <p className="mt-6 lg:max-w-2xl info-text">
          Our dedication to detail and excelence ensures your satisfaction
        </p>
        <div className="mt-11">
          <Button label="View Details" />
        </div>
      </div>

      <div className="flex flex-1 justify-end items-center">
        <img src={camera1} width={550} height={500} alt="camera" className="object-contain" />
      </div>
    </div>
  )
}

export default SuperQuality