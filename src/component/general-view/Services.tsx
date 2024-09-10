import { services } from "../../constant"
import ServiceCard from "../ui/ServiceCard"

const Services = () => {
  return (
    <div className="container flex justify-center bg-gray-100">
      {services.map( service =>(
        <div key={service.label}>
          <ServiceCard {...service} />
        </div>
      ) )}
    </div>
  )
}

export default Services