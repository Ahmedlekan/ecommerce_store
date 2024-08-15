
import { Link } from "react-router-dom"
import { FaSearch } from 'react-icons/fa';
import {compare, wishlist, user, cart} from "../../assets/images"

const Navbar = () => {
  return (
    <header className=" bg-coral-red py-3 px-4">
      
      <nav className="container mx-auto flex justify-between">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/">Diplo.com</Link>
        </span>

        {/* Search bar in the middle */}
        <div className="flex items-center w-full max-w-xl mx-4">
          <input
            type="text"
            className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-l-md focus:outline-none"
            placeholder="Search product here..."
          />
          <button className="px-4 py-2 text-white bg-yellow-500 rounded-r-md hover:bg-yellow-600 focus:outline-none">
            <FaSearch size={25} />
          </button>
        </div>

        <ul className=" flex justify-center items-center gap-16 max-lg:hidden text-white">
          
          <Link to="/">
            <div className="flex justify-center items-center gap-4">
              <img src={compare}/>
              <div className=" flex flex-col items-center">
                <p>Compare</p>
                <p>Products</p>
              </div>
            </div>
          </Link>
          <Link to="/">
            <div className="flex justify-center items-center gap-4">
              <img src={wishlist} className=" h-10 w-10"/>
              <div className=" flex flex-col items-center">
                <p>Favorite</p>
                <p>Wishlist</p>
              </div>
            </div>
          </Link>
          <Link to="/">
            <div className="flex justify-center items-center gap-4">
              <img src={user}/>
              <div className=" flex flex-col items-center">
                <p>Login</p>
                <p>My Account</p>
              </div>
            </div>
          </Link>
          <Link to="/">
            <div className="flex justify-center items-center gap-4">
            <img src={cart}/>
              <div className=" flex flex-col items-center">
                <p className=" bg-white px-1 text-black font-bold rounded-full">0</p>
                <p>$0.00</p>
              </div>
            </div>
          </Link>
        
        </ul>

        {/* <div className="hidden max-lg:block">
          <img src={hamburger} width={25} height={25} alt="hamburger" />
        </div> */}
      </nav>
    </header>
  )
}

export default Navbar