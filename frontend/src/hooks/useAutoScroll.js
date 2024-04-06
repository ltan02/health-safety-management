import { useEffect } from "react";

function useAutoScroll(ref, isDragging) {
    useEffect(() => {
        if (!isDragging) return;

        const interval = setInterval(() => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                const scrollLeft = ref.current.scrollLeft;
                const scrollWidth = ref.current.scrollWidth;
                const width = rect.width;

                // Distance from the edge to start scrolling
                const threshold = 50;
                const speed = 50; // Scroll speed

                // Mouse position
                const mouseX = window.mouseX;

                if (mouseX < rect.left + threshold) {
                    // Scroll Left
                    ref.current.scrollLeft = scrollLeft - speed;
                } else if (mouseX > rect.right - threshold) {
                    // Scroll Right
                    if (scrollLeft + width < scrollWidth) {
                        ref.current.scrollLeft = scrollLeft + speed;
                    }
                }
            }
        }, 100);

        return () => clearInterval(interval);
    }, [isDragging, ref]);
}

export default useAutoScroll;
