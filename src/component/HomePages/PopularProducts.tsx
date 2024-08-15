import tv from "../../assets/images/tv.jpg"

const PopularProducts = () => {
  return (
    <div className="container bg-gray-100 pt-10 px-4">
      
      <div className="flex flex-col gap-5 justify-start">
        <h1 className="text-4xl font-palanquin font-bold">
          Our <span className="text-coral-red">Popular</span> Products
        </h1>
        <p className="lg:max-w-lg mt-2 font-montserrat text-slate-gray">
          Experience top-notch quality and style with our south-after selections. 
          Discover a world of comfort, design and value
        </p>
      </div>

      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 
        xl:grid-cols-5 gap-1 mt-2 shadow "
      >
    
        <div className="flex items-center gap-3 border p-2 bg-white">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-xl leading-normal">Smart Televisions</h3>
            <p>19 items</p>
          </div>
          <img src={tv} alt="tv" />
        </div>

        <div className="flex items-center gap-3 border p-2 bg-white">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-xl leading-normal">Cameras & Videos</h3>
            <p>19 items</p>
          </div>
          <img src={tv} />
        </div>
        <div className="flex items-center gap-3 border p-2 bg-white">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-xl leading-normal">Smart Televisions</h3>
            <p>19 items</p>
          </div>
          <img src={tv} alt="tv" />
        </div>

        <div className="flex items-center gap-3 border p-2 bg-white">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-xl leading-normal">Cameras & Videos</h3>
            <p>19 items</p>
          </div>
          <img src={tv} />
        </div>
        <div className="flex items-center gap-3 border p-2 bg-white">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-xl leading-normal">Smart Televisions</h3>
            <p>19 items</p>
          </div>
          <img src={tv} alt="tv" />
        </div>

        <div className="flex items-center gap-3 border p-2 bg-white">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-xl leading-normal">Cameras & Videos</h3>
            <p>19 items</p>
          </div>
          <img src={tv} />
        </div>
        <div className="flex items-center gap-3 border p-2 bg-white">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-xl leading-normal">Smart Televisions</h3>
            <p>19 items</p>
          </div>
          <img src={tv} alt="tv" />
        </div>

        <div className="flex items-center gap-3 border p-2 bg-white">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-xl leading-normal">Cameras & Videos</h3>
            <p>19 items</p>
          </div>
          <img src={tv} />
        </div>
        
        <div className="flex items-center gap-3 border p-2 bg-white">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-xl leading-normal">Smart Televisions</h3>
            <p>19 items</p>
          </div>
          <img src={tv} alt="tv" />
        </div>

        <div className="flex items-center gap-3 border p-2 bg-white">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-xl leading-normal">Cameras & Videos</h3>
            <p>19 items</p>
          </div>
          <img src={tv} />
        </div>

      </div>

    </div>
  )
}

export default PopularProducts