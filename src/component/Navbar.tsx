import { headerLogo } from "../assets/images"
import {hamburger} from "../assets/icons"
import { navLinks } from "../constant"

const Navbar = () => {
  return (
    <header className="padding-x py-8 absolute w-full z-10">
      
      <nav className="flex justify-between items-start max-container">
        <a href="/"> 
          <img src={headerLogo} 
          width={129} height={29} 
          alt="header logo" 
        /> 
        </a>

        <ul className=" flex-1 flex justify-center items-start gap-16 max-lg:hidden">
          { navLinks.map( item => (
            <li key={item.label}>
              <a href={item.href} 
                className="font-monserrat leading-normal text-slate-gray"
              >
                {item.label}
              </a>
            </li>
          ) ) }
        </ul>

        <div className="hidden max-lg:block">
          <img src={hamburger} width={25} height={25} alt="hamburger" />
        </div>
      </nav>
    </header>
  )
}

export default Navbar