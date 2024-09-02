import {useForm} from "react-hook-form"
import * as apiClient from "../api-client"
import { useAppContext } from "../contexts/AppContext";
import { useNavigate, Link} from "react-router-dom";
import { useMutation, useQueryClient} from "@tanstack/react-query";

export type RegisterFormDataprops = {
    name: string
    email: string;
    password: string;
    confirmPassword: string;
  };

const Register = () => {
    const {register, watch, handleSubmit, formState:{errors}} = useForm<RegisterFormDataprops>()
    const {showToast} = useAppContext()
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const mutation = useMutation({
        mutationFn: apiClient.register,
        onSuccess: async ()=>{
            showToast({message:"Registration Success!", type: "SUCCESS"})
            await queryClient.invalidateQueries({ queryKey: ["validateToken"] })
            navigate("/")
        },
        onError: (error: Error)=>{
            showToast({message: error.message, type: "ERROR"})
        }
    })

    const onSubmit = handleSubmit((data)=>{
        mutation.mutate(data)
    })

  return (
    <div className="mx-auto container p-4 bg-gray-100">
        <div className="bg-white p-5 w-full max-w-sm mx-auto">
            <form className="flex flex-col gap-5" onSubmit={onSubmit}>
                <h2 className="text-3xl font-bold">Create an Account</h2>

                {/* <div className='w-20 h-20 mx-auto relative overflow-hidden rounded-full'>
                
                    <div>
                        <img src="/" alt='login icons'/>
                    </div>
                    <label>
                        <div className='text-xs bg-opacity-80 bg-slate-200 pb-4 pt-2
                            cursor-pointer text-center absolute bottom-0 w-full'
                        >
                            Upload  Photo
                        </div>
                        <input type='file' className='hidden' onChange={()=>{}}/>
                    </label>
                </div> */}
                <label className="text-gray-700 text-sm font-bold">
                        Name
                        <input 
                            className="border rounded w-full py-1 px-2 font-normal"
                            {...register("name", {required:"This field is required"})}
                        />
                        {errors.name && (
                            <span className="text-red-500">{errors.name.message}</span>
                        )}
                </label>

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
                
                <label className="text-gray-700 text-sm font-bold">
                    Confirm Password
                    <input
                        type="password"
                        className="border rounded w-full py-1 px-2 font-normal"
                        {...register("confirmPassword", {
                            validate:(val)=>{
                                if(!val){
                                    return "This field is required"
                                } else if (watch("password") !== val){
                                    return "Your passwords do not match"
                                }
                            }
                        })}
                    />
                    {errors.confirmPassword && (
                        <span className="text-red-500">{errors.confirmPassword.message}</span>
                    )}
                </label>

                <span>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white p-2 font-bold 
                        hover:bg-blue-500 text-xl"
                    >
                        Create Account
                    </button>
                </span>

            </form>
            <p className='my-5'>Already have account ?
                <Link to={"/login"} className=' text-coral-red hover:text-red-700 
                    hover:underline'>
                    Login
                </Link>
            </p>
        </div>
    </div>
  )
}

export default Register


