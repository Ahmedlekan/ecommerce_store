
interface ServiceCardProps {
    imgURL: any;
    label: string;
    subtext: string;
}

const ServiceCard = ({imgURL, label, subtext}: ServiceCardProps) => {
  return (
    <div className="flex gap-8 items-center justify-center mt-5
     py-16 px-4 "
    >
        <div className="w-11 h-11 flex justify-center 
         items-center bg-coral-red rounded-full"
         >
            <img src={imgURL} alt={label} width={24} height={24} />
        </div>
        
        <div className=" flex flex-col justify-center items-start">
            <h3 className="mt-5 font-bold text-xl leading-normal font-palanquin">
                {label}
            </h3>
            <p className="mt-3 break-words font-montserrat text-base 
                leading-normal text-slate-gray"
            >
                {subtext}
            </p>
        </div>
            
    </div>
  )
}

export default ServiceCard