import { useRef } from "react";
import type { MouseEvent, PointerEvent } from "react";

function isBackdropEvent(e: MouseEvent<HTMLDialogElement>) {
  if (e.target !== e.currentTarget)
    return false;

  const rect = e.currentTarget.getBoundingClientRect();

  return (
    e.clientX < rect.left ||
    e.clientX > rect.right ||
    e.clientY < rect.top ||
    e.clientY > rect.bottom
  );
}

export function useModalBackdrop(onClose: () => void) {
  const startedOnBackdropRef = useRef(false);

  return {
    onPointerDownCapture: (e: PointerEvent<HTMLDialogElement>) => {
      startedOnBackdropRef.current = e.isPrimary && e.button === 0
        && isBackdropEvent(e);
    },
    onPointerCancelCapture: () => {
      startedOnBackdropRef.current = false;
    },
    onClick: (e: MouseEvent<HTMLDialogElement>) => {
      const startedOnBackdrop = startedOnBackdropRef.current;
      startedOnBackdropRef.current = false;

      if (startedOnBackdrop && isBackdropEvent(e))
        onClose();
    },
  };
}