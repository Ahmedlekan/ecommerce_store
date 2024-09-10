import Footer from './Footer';
import Navbar from '../navbar/Navbar';
import NavbarTop from '../navbar/NavbarTop';
import NavbarBottom from '../navbar/NavbarBottom';
import { Outlet } from 'react-router';

const Layout = () => {

  return (
    <div className="container flex flex-col mx-auto">
        <NavbarTop />
        <Navbar />
        <NavbarBottom />

        <div className='container mx-auto py-10 flex-1"'>
          <Outlet />
        </div>
        <Footer />
    </div>
  )
}

export default Layout
