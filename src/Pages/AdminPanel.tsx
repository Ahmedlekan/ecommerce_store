// import { useEffect } from 'react'
// import { FaRegCircleUser } from "react-icons/fa6";
// import { Link, Outlet, useNavigate } from 'react-router-dom';
// import ROLE from '../constant/role';
// import { useSelector } from 'react-redux'
// import { UserState } from '../store/userSlice';

// interface RootState {
//     user: UserState;
//   }

// const AdminPanel = () => {
//     const user = useSelector( (state: RootState) => state?.user?.user)
    
//     // const navigate = useNavigate()

//     // useEffect(()=>{
//     //     if(user?.role !== ROLE.ADMIN){
//     //         navigate("/")
//     //     }
//     // },[user, navigate])

//   return (
//     <div className='min-h-[calc(100vh-120px)] md:flex hidden'>

//         <aside className=' bg-gray-100 min-h-full  w-full max-w-xs customShadow'>
//                 <div className='h-32 flex justify-center items-center flex-col'>
//                     <div className='text-5xl cursor-pointer relative flex justify-center'>
//                         {
//                         user?.profilePic ? (
//                             <img src={user?.profilePic} className='w-50 h-50 rounded-full' alt={user?.name} />
//                         ) : (
//                             <FaRegCircleUser size={50}/>
//                         )
//                         }
//                     </div>
//                     <p className='capitalize text-black text-lg font-semibold'>{user?.name}</p>
//                     <p className='text-sm'>{user?.role}</p>
//                 </div>

//                  {/***navigation */}       
//                 <div>   
//                     <nav className='grid p-4'>
//                         <Link to={"all-users"} className='px-2 py-1 hover:bg-slate-100'>All Users</Link>
//                         <Link to={"all-products"} className='px-2 py-1 hover:bg-slate-100'>All product</Link>
//                     </nav>
//                 </div>  
//         </aside>

//         <main className='w-full h-full p-2'>
//             <Outlet/>
//         </main>
//     </div>
//   )
// }

// export default AdminPanel