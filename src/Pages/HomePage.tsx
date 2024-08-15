import Hero from "../component/HomePages/Hero"
import Services from "../component/HomePages/Services"
import PopularProducts from "../component/HomePages/PopularProducts"
import Subscribe from "../component/HomePages/Subscribe"
import SliderSection from "../component/HomePages/Slider"
import Collection from "../component/HomePages/Collection"
import Blog from "../component/HomePages/Blog"
import CustomerReviews from "../component/HomePages/CustomerReviews"
import SuperQuality from "../component/HomePages/SuperQuality"

const HomePage = () => {
  return (
    <>
      <Hero />
      <Services />
      <PopularProducts />
      <SliderSection />
      <Collection />
      <SuperQuality />
      <Blog />
      <CustomerReviews />
      <Subscribe />
    </>
  )
}

export default HomePage