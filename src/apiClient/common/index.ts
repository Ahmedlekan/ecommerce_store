import { FeatureType } from "../../../../backend/src/shared/types"
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ""


// addFeatureImage 
export const addFeatureImage  = async (formData: FeatureType)=>{
    
    const response =  await fetch(`${API_BASE_URL}/api/common/add`, {
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

    return responseBody
}

// addFeatureImage
export const getFeatureImages = async()=>{
    const response = await fetch(`${API_BASE_URL}/api/common/get`, {
        credentials: "include",
    })

    const responseBody = await response.json();

    if (!response.ok) {
        throw new Error(responseBody.message || "Failed to fetch feature images");
    }

    return responseBody;
}