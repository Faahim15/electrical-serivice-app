import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./services/base-api";
import categoryRouteReducer from "./slices/categoryRouteSlice";

import favoritePartnersReducer from "./slices/favouritePartnerSlice";
import ceilingFanDataReducer from "./slices/globalstore/cellingfanDataSlice";
import commonContractdetails from "./slices/globalstore/commonContractdetailsStoreSlice";
import dedicatedCircuitDataReducer from "./slices/globalstore/dedicatedCircuitDataSlice";
import exhaustFanReducer from "./slices/globalstore/ExhaustFanDataSlice";
import lightingReducer from "./slices/globalstore/lightingDataSlice";
import outletsDataReducer from "./slices/globalstore/outletsDataSlice";
import starlinkDataReducer from "./slices/globalstore/StarlinkDataSlice";
import switchesDataReducer from "./slices/globalstore/switchesDataSlice";
import wholeHomeDataReducer from "./slices/globalstore/wholeHomeDataSlice";
import reminderDetailsReducer from "./slices/myReminderSlice";
import otherCategoryRouteSlice from "./slices/otherRouteSlice";
import partnerDetailsReducer from "./slices/parnerDetailsSlice";
import partnersReducer from "./slices/partnersRouterSlice";
import quoteDetailsReducer from "./slices/quoteDetailsSlice";
import safetyMaintenanceReducer from "./slices/seftymaintanceSlice";
import serviceFormReducer from "./slices/serviceFormSlice";
import starlinkRouteReducer from "./slices/starlinkTheRouteSlice";
import troubleshootRouteReducer from "./slices/troubleshootRouteSlice";
export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,

    partners: partnersReducer,
    partnerDetails: partnerDetailsReducer,
    troubleshootRoute: troubleshootRouteReducer,
    categoryRoute: categoryRouteReducer,
    safetyMaintenance: safetyMaintenanceReducer,
    serviceForm: serviceFormReducer,
    starlinkRoute: starlinkRouteReducer,
    otherCategoryRoute: otherCategoryRouteSlice,
    quoteDetails: quoteDetailsReducer,
    reminderDetails: reminderDetailsReducer,
    commonContractDetails: commonContractdetails,
    wholeHomeData: wholeHomeDataReducer,
    starlinkData: starlinkDataReducer,
    exhaustFan: exhaustFanReducer,
    switchesData: switchesDataReducer,
    lighting: lightingReducer,
    ceilingFanData: ceilingFanDataReducer,
    dedicatedCircuitData: dedicatedCircuitDataReducer,
    outletsData: outletsDataReducer,
    favoritePartners: favoritePartnersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
