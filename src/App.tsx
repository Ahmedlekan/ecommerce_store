import HomePage from "./pages/General-view/HomePage"
import SignUp from  "./pages/authentication/SignUp"
import SignIn from "./pages/authentication/SignIn"
import Layout from "./component/general-view/Layout"
import AdminLayout from "./component/admin-view/AdminLayout"
import AdminDashboard from "./pages/admin-view/Dashboard"
import AdminFeatures from "./pages/admin-view/Features"
import AdminOrders from "./pages/admin-view/Orders"
import AdminProducts from "./pages/admin-view/Products"
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom"
import { Skeleton } from "./component/ui/Skeleton"
import { useAppContext } from "./contexts/AppContext"
import Account from "./pages/General-view/Account"
import Checkout from "./pages/General-view/Checkout"
import Listing from "./pages/General-view/Listing"


const AuthenticatedLayout = () => (
  <>
    <Outlet />
  </>
);

function App() {

  const {isLoggedIn, isLoading, user} = useAppContext()
  if (isLoading) return <Skeleton className="w-[800] bg-black h-[600px]" />;

  if(user){
    console.log("UserName", user)
  }

  return (
    <div>

      <Router>
        
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="sign-up" element={<SignUp />} />
            <Route path="login" element={<SignIn />} />

            {isLoggedIn && (
              <Route element={<AuthenticatedLayout />}>
                <Route path="account" element={<Account/>} />
                <Route path="checkout" element={<Checkout/>} />
                <Route path="listing" element={<Listing/>} />
              </Route>
            )}
          </Route>

          {isLoggedIn && (
            <Route path="admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="features" element={<AdminFeatures />} />
            </Route>
          )}
          
        </Routes>
      
      </Router>
      
    </div>
  )
}

export default App
