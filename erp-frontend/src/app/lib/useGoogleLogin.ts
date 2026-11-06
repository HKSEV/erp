"use client";

import { useEffect, useRef, useState } from "react";
import {
  GoogleOptions,
  getGoogleError,
  startGoogleLogin,
} from "./google";
import useModal from "@/components/contexts/ModalContext";

export default function useGoogleLogin() {
  const {openAlertModal} = useModal();
  const [isGoogleStarting, setIsGoogleStarting] = useState(false);
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const reset = () => {
      requestRef.current?.abort();
      requestRef.current = null;
      setIsGoogleStarting(false);
    };

    window.addEventListener("pageshow", reset);

    return () => {
      requestRef.current?.abort();
      window.removeEventListener("pageshow", reset);
    };
  }, []);

  const startGoogle = async (options: GoogleOptions) => {
    if (requestRef.current)
      return;

    const controller = new AbortController();
    requestRef.current = controller;
    setIsGoogleStarting(true);

    try {
      await startGoogleLogin(options, controller.signal);
    } catch (err: unknown) {
      if (controller.signal.aborted)
        return;

      requestRef.current = null;
      setIsGoogleStarting(false);

      openAlertModal(
        getGoogleError(err),
        undefined,
        {variant: "error"}
      );
    }
  };

  return {startGoogle, isGoogleStarting};
};
