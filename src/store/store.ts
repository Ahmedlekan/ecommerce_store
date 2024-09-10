import { configureStore } from '@reduxjs/toolkit'

import commonFeatureSlice from "../store/common/common"

const store = configureStore({
  reducer: {
    commonFeature: commonFeatureSlice,
  },
});

export default store;