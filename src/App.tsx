import HomePage from "./Pages/HomePage"
import SignUp from "./Pages/SignUp"
import SignIn from "./Pages/SignIn"
import Layout from "./component/Layout"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"


function App() {

  return (
    <div>

      <Router>
        
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/login" element={<SignIn />} />
          </Route>
        </Routes>
      
      </Router>
      
    </div>
  )
}

export default App
