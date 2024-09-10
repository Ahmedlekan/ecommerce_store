import { RegisterFormDataprops } from "../pages/authentication/SignUp"
import { UserType } from "../../../backend/src/shared/types"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ""

// connecting the current user from the backend to the frontend
export const fetchCurrentUser = async ():Promise<UserType> => {
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        credentials: "include"
    })
    if(!response.ok){
        throw new Error("Error fetching user")
    }
     return response.json()
}

// register
export const register = async (formData: RegisterFormDataprops)=>{
    const response =  await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-type": "Application/json"
        },
        body: JSON.stringify(formData)
    })
    const responseBody = await response.json()
    if(!response.ok){
        throw new Error(responseBody.message)
    }
}


// get all users
export const getAllUsers = async ():Promise<UserType[]>=>{

    const response = await fetch(`${API_BASE_URL}/api/users/all-user`, {
        credentials: "include"
    })

    if(!response.ok){
        throw new Error("Error fetching users")
    }
    
    const users: UserType[] = await response.json();  // Expecting a direct array
    return users;
}

export const updateUserRole = async (userRoleFormData: FormData)=>{
    const response = await fetch(`${API_BASE_URL}/api/users/user-role`, {
        method: "POST",
        credentials: "include",
        headers : {
            "content-type" : "application/json"
        },
        body : JSON.stringify({userRoleFormData})
    })

        const body = await response.json();
        if (!response.ok) {
        throw new Error(body.message);
        }
        return body;
}



