// import {useEffect, useState} from 'react'
// import { useQuery } from '@tanstack/react-query'
// import * as apiClient from "../api-client"
// import { useAppContext } from '../contexts/AppContext'
// import { UserType } from '../../../backend/src/shared/types'
// import moment from 'moment'
// import { MdModeEdit } from "react-icons/md";
// import ChangeUserRole from '../component/ChangeUserRole'

// type UpdateUserDetailsProps = {
//   email: string
//   name: string
//   role: string
//   _id: string
// }

// const AllUsers = () => {
//   const {showToast} = useAppContext()

//   const [allUser,setAllUsers] = useState<UserType[] | []>([])
//     const [openUpdateRole,setOpenUpdateRole] = useState<boolean>(true)
//     const [updateUserDetails,setUpdateUserDetails] = useState<UpdateUserDetailsProps>({
//         email : "",
//         name : "",
//         role : "",
//         _id  : "",
//     })

//     const { data, error, isSuccess } = useQuery<UserType[]>({
//       queryKey: ["allUsers"],
//       queryFn: () => apiClient.getAllUsers(),
//     });

//     useEffect(() => {
//       if (isSuccess ) {
//         console.log("all users", data);
//         setAllUsers(data);
//       } else if (error) {
//         showToast({ message: error.message, type: "ERROR" });
//       }
//     }, [isSuccess, error, data, showToast]);



//   return (
//     <div className='bg-gray-100 pb-4'>
//       <table className='w-full'>
//             <thead className=' p-10'>
//                 <tr className='bg-black text-white'>
//                     <th >Sr.</th>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Role</th>
//                     <th>Created Date</th>
//                     <th>Action</th>
//                 </tr>
//             </thead>

//             <tbody className=''>
//                 {
//                     allUser.map((user,index) => {
//                         return(
//                             <tr>
//                                 <td>{index+1}</td>
//                                 <td>{user?.name}</td>
//                                 <td>{user?.email}</td>
//                                 <td>{user?.role}</td>
//                                 <td>{moment(user?.createdAt).format('LL')}</td>
//                                 <td>
//                                     <button className='bg-green-100 p-2 rounded-full cursor-pointer 
//                                       hover:bg-green-500 hover:text-white' 
//                                       onClick={()=>{
//                                         setUpdateUserDetails(user)
//                                         setOpenUpdateRole(true)

//                                     }}
//                                     >
//                                         <MdModeEdit/>
//                                     </button>
//                                 </td>
//                             </tr>
//                         )
//                     })
//                 }
//             </tbody>
//       </table>

//       {
//         openUpdateRole && (
//             <ChangeUserRole 
//                 onClose={()=>setOpenUpdateRole(false)} 
//                 name={updateUserDetails.name}
//                 email={updateUserDetails.email}
//                 role={updateUserDetails.role}
//                 userId={updateUserDetails._id}
//                 callFunc={()=> {}}
//             />
//         )      
//       }

//     </div>
//   )
// }

// export default AllUsers