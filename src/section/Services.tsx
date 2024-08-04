import { services } from "../constant"
import ServiceCard from "../component/ServiceCard"

const Services = () => {
  return (
    <section className="max-container flex justify-center flex-wrap gap-9">
      {services.map( service =>(
        <div key={service.label}>
          <ServiceCard {...service} />
        </div>
      ) )}
    </section>
  )
}

export default Services