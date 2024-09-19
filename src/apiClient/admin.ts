import { ProductsType } from "../../../backend/src/shared/types"

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

//fetch all product from the backend and connect to the front-end

export const fetchAllProduct = async (): Promise<ProductsType[]>=>{
    const response = await fetch(`${API_BASE_URL}/api/admin`, {
        credentials: "include",
    })

    if(!response.ok){
        console.log("Error fetchinh Products")
    }

    return response.json()
}

// for editing a product
export const updateMyHotelById = async (productFormData: FormData) =>{
    const response =  await fetch(`${API_BASE_URL}/api/admin/${productFormData.get("hotelId")}`, {
        method: "PUT",
        body: productFormData,
        credentials:"include"
    })

    if(!response.ok){
        throw new Error("Failed to edit a product")
    }
    return response.json()
}

// for deleting a product

export const deleteProduct = async (productId: string)=>{
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/${productId}`, {
          method: "DELETE",
          credentials: "include"
        });
    
        if (!response.ok) {
          throw new Error("Error deleting product");
        }
        console.log("Product deleted successfully");
      } catch (error) {
        console.error("Error in deleteProduct:", error);
      }
}