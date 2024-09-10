// import { createSlice } from '@reduxjs/toolkit'

// export interface UserState {
//     user: {
//       _id: string;
//       name: string;
//       role: string;
//       profilePic?: string;
//     } | null;
//   }

// const initialState : UserState = {
//     user : null
// }
  
//   export const userSlice = createSlice({
//     name: 'user',
//     initialState,
//     reducers: {
//       setUserDetails : (state,action)=>{
//         state.user = action.payload
//       }
//     },
//   })
  
//   // Action creators are generated for each case reducer function
//   export const { setUserDetails } = userSlice.actions
  
//   export default userSlice.reducer