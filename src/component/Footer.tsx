import { socialMedia, footerLinks } from "../constant"
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="px-4">
      
      <div className="flex justify-between items-start gap-20 
        flex-wrap max-lg:flex-col"
      >
  
        <div className="flex flex-col items-start">
          <span className="text-2xl font-bold tracking-tight">
            <Link to="/">Diplo.com</Link>
          </span>

          <p className="mt-6 text-lg leading-7 
            font-montserrat sm:max-w-sm"
          >
            Get shoes ready for the new term at your nearest Nike store.
            Find Your Perfect Size in Store. Get Rewards
          </p>
          
          <div className="flex items-center gap-5 mt-8">
            {socialMedia.map( icon => (
              <div className="flex items-center justify-center w-12 h-12 
                rounded-full"
              >
                <img src={icon.src} alt={icon.alt} width={24} height={24} />
              </div>
            ) )}
          </div>
        </div>

        <div className="flex flex-1 justify-between lg:gap-10 gap-20 flex-wrap">
          {footerLinks.map( section =>(
            <div key={section.title}>
              <h4 className=" font-montserrat 
                text-2xl leading-normal font-medium mb-6"
              >
                {section.title}
              </h4>
              <ul>
                { section.links.map( link =>(
                  <li key={link.name} className="mt-3 cursor-pointer
                    font-montserrat text-xl leading-normal hover:text-slate-gray"
                  > 
                    <a href={link.link}> {link.name} </a> 
                  </li>
                ) ) }
              </ul>
            </div>
          ) )}         
        </div>

      </div>

      <div className="flex justify-between mt-24 
        max-sm:flex-col max-sm:items-center"
      >
        <p>Copyright. All rights Reserved.</p>
        <p className="cursor-pointer font-montserrat">Terms & Condition</p>
      </div>

    </footer>
  )
}

export default Footer