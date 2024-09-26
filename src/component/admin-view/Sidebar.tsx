import {BadgeCheck,ChartNoAxesCombined,LayoutDashboard,ShoppingBasket,} from "lucide-react";
import { Fragment } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/Sheet";
import ROLE from "../../constant/role";
import { useAppContext } from "../../contexts/AppContext";
import { FaRegCircleUser } from "react-icons/fa6";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck />,
  },
];

interface SidebarProps {
  open?: boolean;
  setOpen?: (value: boolean) => void;
}

function MenuItems({ setOpen }: SidebarProps) {
  const navigate = useNavigate();

  return (
    <nav className="mt-8 flex-col flex gap-2">
      {adminSidebarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path);
            setOpen ? setOpen(false) : null;
          }}
          className="flex cursor-pointer text-xl items-center gap-2 rounded-md 
            px-3 py-2 text-muted-foreground hover:bg-gray-100 hover:text-foreground"
          >
          {menuItem.icon}
          <span>{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }: SidebarProps) {
  const navigate = useNavigate();

  const {user} = useAppContext()


  useEffect(()=>{
      if(user?.role === ROLE.ADMIN){
          navigate("/")
      }
  },[user, navigate])

  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-2 mt-5 mb-5">
                <ChartNoAxesCombined size={30} />
                <h1 className="text-2xl font-extrabold">Admin Panel</h1>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      
      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-2"
        >
          <ChartNoAxesCombined size={30} />
          <h1 className="text-2xl font-extrabold">Admin Panel</h1>
        </div>

        <div className='h-32 flex justify-center items-center gap-2 flex-col mt-2'>
          <div className='text-5xl cursor-pointer relative flex justify-center'>
              {
              user?.profilePic ? (
                  <img src={user?.profilePic} className='w-50 h-50 rounded-full' alt={user?.name} />
              ) : (
                  <FaRegCircleUser size={50}/>
              )
              }
          </div>
          <p className='capitalize text-black text-lg font-semibold'>{user?.name}</p>
          <p className='text-sm'>{user?.role}</p>
        </div>

        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;