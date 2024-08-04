
interface ButtonProps {
    label:string,
    iconURL?: string,
    backgroundColor?: string,
    borderColor?: string,
    textColor?: string
    fullWidth?: boolean
}

const Button = ({label, iconURL, backgroundColor, fullWidth, borderColor, textColor}: ButtonProps ) => {
  
  return (
    <button className={`flex justify-center items-center gap-2 px-7 py-4 
     boder font-montserrat text-lg leading-none ${backgroundColor ? `${backgroundColor}
     ${borderColor} ${textColor}`: "bg-coral-red text-white border-coral-red"}
     rounded-full ${fullWidth && "w-full"}`}
    >
        {label}
        
        { iconURL && <img src={iconURL} 
            alt="right arrow"
            className="ml-2 w-5 h-5 rounded-full"    
        />}
    </button>
  )
}

export default Button