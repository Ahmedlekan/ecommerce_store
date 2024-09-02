import React, {createContext, useContext, useState, useEffect} from 'react'
import Toast from '../component/Toast';
import * as apiClient from "../api-client";
import { useQuery } from '@tanstack/react-query'
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import { UserType } from '../../../backend/src/shared/types';


type ToastMessage = {
    message: string;
    type: "SUCCESS" | "ERROR";
}

type AppContextProps = {
    showToast: (toastMessage: ToastMessage)=> void
    isLoggedIn: boolean
    user: UserType | null;
    setUserDetails: (userDetails: UserType) => void
}

const AppContext = createContext<AppContextProps | undefined>(undefined)

export const AppContextProvider = ({children}:{children: React.ReactNode}) => {

    const [toast, setToast] = useState<ToastMessage | undefined>(undefined)
    const [user, setUser] = useState<UserType | null>(null);
    const dispatch = useDispatch();

    const {isError} = useQuery({
        queryKey: ["validateToken"],
        queryFn: apiClient.validateToken
    })

    const {data: currentUser, isSuccess} = useQuery({
      queryKey:["currentUser"],
      queryFn: apiClient.fetchCurrentUser
    })

      // Dispatch user details to the Redux store when the query succeeds
    useEffect(() => {
        if (isSuccess) {
        dispatch(setUserDetails(currentUser));
        }
    }, [isSuccess,currentUser, dispatch])

  return (
    <AppContext.Provider value={{
        showToast: (toastMessage) => setToast(toastMessage),
        isLoggedIn: !isError,
        user, 
        setUserDetails: (userDetails: UserType) => setUser(userDetails)
    }}>
        {toast && (
            <Toast message={toast.message} type={toast.type} onClose={ () => setToast(undefined)} />
        )}
        {children}
    </AppContext.Provider>
  )
}

export const useAppContext = ()=>{
    const context = useContext(AppContext)
    
    if (!context) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
}