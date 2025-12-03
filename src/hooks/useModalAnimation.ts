import { useState, useCallback } from "react";

export function useModalAnimation(onClose: () => void, duration = 250) {
  const [closing, setClosing] = useState<boolean>(false);

  const animateClose = useCallback(() => {
    setClosing(true); // start closing animation

    setTimeout(() => {
      onClose();
      setClosing(false); // reset for next modal open
    }, duration);
  }, [onClose, duration]);

  return { closing, animateClose };
}
