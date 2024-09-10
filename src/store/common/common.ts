import { createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

const initialState = {
  isLoading: false,
  featureImageList: [],
};

// export const getFeatureImages = createAsyncThunk(
//   "/order/getFeatureImages",
//   async () => {
//     const response = await axios.get(
//       `http://localhost:5000/api/common/feature/get`
//     );

//     return response.data;
//   }
// );

// export const addFeatureImage = createAsyncThunk(
//   "/order/addFeatureImage",
//   async (image) => {
//     const response = await axios.post(
//       `http://localhost:5000/api/common/feature/add`,
//       { image }
//     );

//     return response.data;
//   }
// );

const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {},
});

export default commonSlice.reducer;