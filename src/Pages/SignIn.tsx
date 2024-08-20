import {useForm} from "react-hook-form"
// import * as apliClient from "../api-client"
import { useAppContext } from "../contexts/AppContext";
import {Link} from "react-router-dom";

export type RegisterFormDataprops = {
    email: string;
    password: string;
  };

const SignIn = () => {
    const {register, watch, handleSubmit, formState:{errors}} = useForm<RegisterFormDataprops>()
    const {showToast} = useAppContext()

    const onSubmit = handleSubmit((data)=>{
        
    })

  return (
    <div className="mx-auto container p-4 bg-gray-100">
        <div className="bg-white p-5 w-full max-w-sm mx-auto">
            <form className="flex flex-col gap-5" onSubmit={onSubmit}>
                <h2 className="text-3xl font-bold">Create an Account</h2>

                <label className="text-gray-700 text-sm font-bold">
                    Email
                    <input
                        type="email"
                        className="border rounded w-full py-1 px-2 font-normal"
                        {...register("email", {required:"This field is required"})}
                    />
                    {errors.email && (
                        <span className="text-red-500">{errors.email.message}</span>
                    )}
                </label>

                <label className="text-gray-700 text-sm font-bold">
                    Password
                    <input
                        type="password"
                        className="border rounded w-full py-1 px-2 font-normal"
                        {...register("password", {required:"This field is required", minLength:{
                            value: 6,
                            message: "Password must be atleast 6 characters"
                        }})}
                    />
                    {errors.password && (
                        <span className="text-red-500">{errors.password.message}</span>
                    )}
                </label>

                <span>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white p-2 font-bold 
                        hover:bg-blue-500 text-xl"
                    >
                        Sign In
                    </button>
                </span>

            </form>
            <p className='my-5'>Don't have an account ?
                <Link to={"/sign-up"} className=' text-coral-red hover:text-red-700 
                    hover:underline'>
                    Sign Up
                </Link>
            </p>
        </div>
    </div>
  )
}

export default SignIn



