
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ""


// connecting the backend to the frontend. Used for adding hotel to my data base
export const addProduct = async (productFormData: FormData)=>{
    const response = await fetch(`${API_BASE_URL}/api/admin`, {
        credentials: "include",
        method: "POST",
        body: productFormData,
    })

    if(!response.ok){
        throw new Error("Error adding product")
    }
    return response.json()
}