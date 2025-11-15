import { useState } from "react";

export function useModalAnimation(onClose: () => void, duration = 250) {
    const [closing, setClosing] = useState(false)

    function animateClose(){
        setClosing(true)

        setTimeout(() => {
            onClose()
        }, duration);
    }
    return {closing, animateClose}
}