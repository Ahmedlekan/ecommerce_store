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
    const response = await fetch(`${API_BASE_URL}/api/general/general-products`, {
        credentials: "include",
    })

    const data = await response.json();
    return data;
}

// fetch product by id
export const fetchProductById = async (productId: string):Promise<ProductsType> =>{
    const response = await fetch(`${API_BASE_URL}/api/general/${productId}`, {
        credentials: "include"
    })

    if (!response.ok) {
        throw new Error("Failed to fetch product");
    }

    const data = await response.json();

    console.log(data)
    return data;
    
}

