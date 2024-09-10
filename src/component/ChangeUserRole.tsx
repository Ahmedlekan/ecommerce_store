import React, {useState} from 'react'
import { IoMdClose } from "react-icons/io";
import ROLE from '../constant/role';
import * as apiClient from "../api-client"
import { useMutation } from '@tanstack/react-query';
import { useAppContext } from '../contexts/AppContext';

type ChangeUserRoleProps = {
    onClose?: () => void;
    name?: string;
    email?: string;
    role: string;
    userId: string;
    callFunc?: () => void;
};

const ChangeUserRole = ({onClose, name, email, role}: ChangeUserRoleProps) => {
    
    const [userRole,setUserRole] = useState<string>(role)
    const {showToast} = useAppContext()

    // update the hotel after editing
    const {mutate} = useMutation( {
        mutationFn: apiClient.updateUserRole,
        onSuccess: async () => {
          showToast({ message: "User Role Updated!", type: "SUCCESS" });
        },
        onError: (error: Error) => {
          showToast({ message: error.message, type: "ERROR" });
        },
      });
  
      const handleSave = (userRoleFormData: FormData)=>{
        mutate(userRoleFormData)
      }

      const handleOnChangeSelect = (e) => {
        setUserRole(e.target.value)
        console.log(e.target.value)
        handleSave(userRoleFormData);
    }

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 w-full h-full z-10 
        flex justify-between items-center bg-slate-200 bg-opacity-50'
    >
       <div className='mx-auto bg-white shadow-md p-4 w-full max-w-sm'>

            <button className='block ml-auto' onClick={onClose}>
                <IoMdClose/>
            </button>

            <h1 className='pb-4 text-lg font-medium'>Change User Role</h1>

             <p>Name : {name}</p>   
             <p>Email : {email}</p> 

            <div className='flex items-center justify-between my-4'>
                <p>Role :</p>  
                <select className='border px-4 py-1' value={userRole} onChange={handleSave}>
                    {
                        Object.values(ROLE).map(el => {
                            return(
                                <option value={el} key={el}>{el}</option>
                            )
                        })
                    }
                </select>
            </div>


            <button className='w-fit mx-auto block  py-1 px-3 rounded-full 
                bg-red-600 text-white hover:bg-red-700'
                onClick={()=>{}}
            >
                Change Role
            </button>
       </div>
    </div>
  )
}

export default ChangeUserRole