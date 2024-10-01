import { ProductsType } from "../../../backend/src/shared/types"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ""


export const CategoryList = async (): Promise<ProductsType[]>=>{
    const response = await fetch(`${API_BASE_URL}/api/general`, {
        credentials: "include",
    })

    if(!response.ok){
        throw new Error("Error fetching products");
    }

    const result = await response.json()

    return result.data
}

export const fetchRandomProduct = async (): Promise<ProductsType[]>=>{
    const response = await fetch(`${API_BASE_URL}/api/general`, {
        credentials: "include",
    })

    if(!response.ok){
        console.log("Error fetchinh Products")
    }

    return response.json()
}