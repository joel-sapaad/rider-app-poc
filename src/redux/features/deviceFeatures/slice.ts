import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  notification: {
    supported: false,
    consent: "default",
  },
  geolocation: {
    supported: false,
    consent: false,
  },
  pushManager: {
    supported: false,
  },
  serviceWorker: {
    supported: false,
  },
};

export const userPermissionsSlice = createSlice({
  name: "device_features",
  initialState,
  reducers: {
    setNotificationConsent: (state, action: PayloadAction<string>) => {
      state.notification.consent = action.payload;
    },
    setNotificationSupport: (state, action: PayloadAction<boolean>) => {
      state.notification.supported = action.payload;
    },
    setServiceWorkerSupport: (state, action: PayloadAction<boolean>) => {
      state.serviceWorker.supported = action.payload;
    }
  },

});

export const { setNotificationConsent, setServiceWorkerSupport } =
  userPermissionsSlice.actions;
const reducer = userPermissionsSlice.reducer;
export default reducer;
