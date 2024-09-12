import React from 'react'
import { AlignJustify, LogOut } from "lucide-react";
import Button from '../ui/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppContext } from '../../contexts/AppContext';
import * as authClient from "../../apiClient/auth"
import { useNavigate } from 'react-router';

type AdminHeaderProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminHeader = ({setOpen}: AdminHeaderProps) => {

  const {showToast, setUser} = useAppContext()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

const mutation = useMutation({
    mutationFn: authClient.signOut,
    onSuccess: async ()=>{
        await queryClient.invalidateQueries({queryKey: ["validateToken"]});
        setUser(null)
        navigate("/")
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
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleClick}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  )
}

export default AdminHeader
