
import { Link } from "react-router-dom"
import { FaSearch } from 'react-icons/fa';
import {compare, wishlist, userImg, cart} from "../../assets/images"
import { useAppContext } from "../../contexts/AppContext";
import * as apiClient from "../../api-client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useDispatch, useSelector } from 'react-redux';
import { UserState } from "../../store/userSlice";
import { setUserDetails } from "../../store/userSlice";
import ROLE from "../../constant/role";
// import { FaRegCircleUser } from "react-icons/fa6";

interface RootState {
  user: UserState;
}

const Navbar = () => {
  const user = useSelector((state: RootState) => state?.user?.user)
  const dispatch = useDispatch()
  
  const {isLoggedIn} = useAppContext()
  const {showToast} = useAppContext()
  const queryClient = useQueryClient()

  const mutation = useMutation({
      mutationFn: apiClient.signOut,
      onSuccess: async ()=>{
          await queryClient.invalidateQueries({queryKey: ["validateToken"]});
          dispatch(setUserDetails(null))
          showToast({ message: "Signed Out!", type: "SUCCESS" });
      },
      onError: (error: Error) => {
          showToast({ message: error.message, type: "ERROR" });
        },
  })

  const handleClick = ()=>{
      mutation.mutate()
  }

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
          
          <Link to="/compare">
            <div className="flex justify-center items-center gap-4">
              <img src={compare}/>
              <div className=" flex flex-col items-center">
                <p>Compare</p>
                <p>Products</p>
              </div>
            </div>
          </Link>

          <Link to="/favorite">
            <div className="flex justify-center items-center gap-4">
              <img src={wishlist} className=" h-10 w-10"/>
              <div className=" flex flex-col items-center">
                <p>Favorite</p>
                <p>Wishlist</p>
              </div>
            </div>
          </Link>

          {isLoggedIn ? 
            (<div className="flex justify-center items-center">
                <div>
                    {
                      user?.profilePic ? (
                        <img src={user?.profilePic} className='w-10 h-10 rounded-full' alt={user?.name} />
                      ) : (
                        <img src={userImg} alt="" />
                      )
                    }
                </div>

                <div className=" flex flex-col items-center">
                  <button
                    onClick={handleClick}
                    className="px-3 hover:text-cyan-950 "
                  >
                    Sign Out
                  </button>

                  {user?.role === ROLE.ADMIN && (
                    <Link to={"/admin-panel/all-products"}>
                    <div className=" px-3 hover:text-cyan-950 "
                    >
                      Admin Panel
                    </div>
                  </Link>
                  )}
            
                </div>
              </div>
            ) 
            : (
              <div className="flex justify-center items-center gap-4">
                <div className=" flex items-center">
                  <Link to="/login">
                    <p>Login</p>
                  </Link>
                  <img src={userImg} alt="" />
                </div>
              </div>
            )
          }

          <Link to="/cart">
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
