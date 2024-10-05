import React from 'react'

const Listing = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
        
        {/* filter */}
        <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
            <div className="space-y-5">
                <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
                    Filter By:
                </h3>
                
                <span>Brand</span>
                <span>Brand</span>
                <span>Brand</span>
                <span>Brand</span>
                <span>Brand</span>

            </div>
        </div>

        <div className="flex flex-col gap-5">
            
            <div className="flex justify-between items-center">
                <span className='text-xl font-bold'>
                    All products
                </span>

                <select 
                    className="p-2 border rounded-md"
                    value=""
                    onChange={()=> ()=>{} }
                >
                    <option value="">Sort By</option>
                    <option value="starRating">Star Rating</option>
                    <option value="pricePerNightAsc">
                        Price Per Night (low to high)
                    </option>
                    <option value="pricePerNightDesc">
                        Price Per Night (high to low)
                    </option>
                </select>
            </div>

            <div>Search Card</div>

            <div>
              Pagination
            </div>

        </div>

    </div>
  )
}

export default Listing