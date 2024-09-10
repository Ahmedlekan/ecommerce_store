import { LoginFormDataprops } from "../pages/authentication/SignIn";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ""

// sign in
export const signIn = async (formData: LoginFormDataprops) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
  
    const body = await response.json();
    if (!response.ok) {
      throw new Error(body.message);
    }
    return body;
  };

  // validate token
export const validateToken = async ()=>{
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
        credentials:"include"
    })
    if (!response.ok){
        throw new Error("Token Invalid");
        
    }
    return response.json()
}

// sign out
export const signOut = async ()=>{
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        credentials: "include",
        method: "POST"
    })

    if(!response.ok){
        throw new Error("Error during sign out")
    }
}