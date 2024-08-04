import {Hero, PopularProducts, SuperQuality, Services, 
  SpecialOffer, CustomerReviews, Subscribe, Footer} from "./section"
import Navbar from "./component/Navbar"

function App() {

  return (
    <div>
      <Navbar />

      <section className="xl:padding-l wide:padding-r padding-b">
        <Hero />
      </section>

      <section className="padding">
        <PopularProducts />
      </section>
      <section className="padding">
        <SuperQuality />
      </section>
      <section className="padding-x p-10">
        <Services />
      </section>
      <section className="padding">
        <SpecialOffer />
      </section>
      <section className="bg-pale-blue padding">
        <CustomerReviews />
      </section>
      <section className="padding-x sm:py-32 py-16 w-full">
        <Subscribe />
      </section>
      <section className="padding-x padding-t bg-black pb-8">
        <Footer />
      </section>
    </div>
  )
}

export default App
