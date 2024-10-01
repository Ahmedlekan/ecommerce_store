import Hero from "../../component/general-view/Hero"
import Services from "../../component/general-view/Services"
import PopularProducts from "../../component/general-view/PopularProducts"
import Subscribe from "../../component/general-view/Subscribe"
import SliderSection from "../../component/general-view/Slider"
import Collection from "../../component/general-view/Collection"
import Blog from "../../component/general-view/Blog"
import CustomerReviews from "../../component/general-view/CustomerReviews"
import SuperQuality from "../../component/general-view/SuperQuality"
import CategoryList from "../../component/general-view/CategoryList"

const HomePage = () => {
  return (
    <>
      <Hero />
      <CategoryList />
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