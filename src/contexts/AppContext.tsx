import React, {createContext, useContext, useState} from 'react'
import Toast from '../component/Toast';
// import * as apiClient from "../api-client";
import { useQuery } from '@tanstack/react-query'

type ToastMessage = {
    message: string;
    type: "SUCCESS" | "ERROR";
}

type AppContextProps = {
    showToast: (toastMessage: ToastMessage)=> void
    isLoggedIn: boolean
}

const AppContext = createContext<AppContextProps | undefined>(undefined)

export const AppContextProvider = ({children}:{children: React.ReactNode}) => {
    
    const [toast, setToast] = useState<ToastMessage | undefined>(undefined)
    const {isError} = useQuery({
        queryKey: ["validateToken"],
        queryFn: ()=>{}
    })

  return (
    <AppContext.Provider value={{
        showToast: (toastMessage) => setToast(toastMessage),
        isLoggedIn: !isError,
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