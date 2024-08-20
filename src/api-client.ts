import { RegisterFormDataprops } from "./Pages/SignUp"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ""

export const register = async (formData: RegisterFormDataprops) =>{
    const response = await fetch(`${API_BASE_URL}/api/users/signUp`, {
        method: "POST",
        credentials:"include",
        headers: {
            "Content-type": "Application/json"
        },
        body: JSON.stringify(formData)
    })

    const responseBody = await response.json()
    if (!response.ok){
        throw new Error(responseBody.message);
        
    }
}

