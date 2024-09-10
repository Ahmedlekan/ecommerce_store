import React from 'react'

type AdminHeaderProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminHeader = ({setOpen}: AdminHeaderProps) => {
  return (
    <div>AdminHeader</div>
  )
}

export default AdminHeader