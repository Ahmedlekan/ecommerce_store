
import Slider from 'react-infinite-logo-slider';
import brand1 from "../../assets/images/brand-01.png"
import brand2 from "../../assets/images/brand-02.png"
import brand3 from "../../assets/images/brand-03.png"
import brand4 from "../../assets/images/brand-04.png"
import brand5 from "../../assets/images/brand-05.png"
import brand6 from "../../assets/images/brand-06.png"
import brand7 from "../../assets/images/brand-07.png"
import brand8 from "../../assets/images/brand-08.png"

const SliderSection = () => {
  
    return (
    <div className=' px-4 pt-10'>
        <Slider
            width='200px'
            duration={60}
        >
            <Slider.Slide>
                <img src={brand1} alt="logo"/>
            </Slider.Slide>
            
            <Slider.Slide>
                <img src={brand2} alt="logo"/>
            </Slider.Slide>
    
            <Slider.Slide>
                <img src={brand3} alt="logo"/>
           </Slider.Slide>
                
            <Slider.Slide>
                <img src={brand4} alt="logo"/>
            </Slider.Slide>
                
            <Slider.Slide>
                <img src={brand5} alt="logo"/>
            </Slider.Slide>
            
            <Slider.Slide>
                <img src={brand6} alt="logo"/>
            </Slider.Slide>
            
            <Slider.Slide>
                <img src={brand7} alt="logo"/>
            </Slider.Slide>
            
            <Slider.Slide>
                <img src={brand8} alt="logo"/>
            </Slider.Slide>

    </Slider>
    </div>
  )
}

export default SliderSection