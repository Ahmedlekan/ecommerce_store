import HomePage from "./Pages/HomePage"
import SignUp from "./Pages/SignUp"
import SignIn from "./Pages/SignIn"
import Layout from "./component/Layout"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AdminPanel from "./Pages/AdminPanel"
import AllUsers from "./Pages/AllUsers"
import AllProducts from "./Pages/AllProducts"

function App() {

  return (
    <div>

      <Router>
        
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="sign-up" element={<SignUp />} />
            <Route path="login" element={<SignIn />} />
            <Route path="admin-panel" element={<AdminPanel />}>
              <Route path="all-users" element={<AllUsers />} />
              <Route path="all-products" element={<AllProducts />} />
            </Route>
          </Route>
        </Routes>
      
      </Router>
      
    </div>
  )
}

export default App
