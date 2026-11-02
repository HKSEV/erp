"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { getToken, subscribeToken } from "@/app/lib/auth";
import { setLogout } from "@/store/authSlice";
import { store } from "@/store/store";

export default function ReduxProvider({children}: {children: React.ReactNode}) {
  useEffect(() => {
    const syncSession = () => {
      if (store.getState().auth.token !== getToken())
        store.dispatch(setLogout());
    };

    syncSession();
    return subscribeToken(syncSession);
  }, []);

  return(
    <Provider store={store}>
      {children}
    </Provider>
  );
};
