import { useCallback, useRef, useEffect } from 'react';
import { Position } from '../../../types/Calculator';

interface UseDraggableOptions {
  enabled: boolean;
  position: Position;
  onPositionChange: (position: Position) => void;
}

export const useDraggable = (options: UseDraggableOptions) => {
  const { enabled, position, onPositionChange } = options;
  const dragStateRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    dragOffset: { x: 0, y: 0 },
  });

  const dragRef = useRef<HTMLDivElement | null>(null);

  const handleMouseDown = useCallback(
    (event: MouseEvent) => {
      if (!enabled) return;

      dragStateRef.current = {
        isDragging: true,
        startX: event.clientX,
        startY: event.clientY,
        dragOffset: {
          x: event.clientX - position.x,
          y: event.clientY - position.y,
        },
      };

      document.addEventListener('mousemove', handleMouseMove as EventListener);
      document.addEventListener('mouseup', handleMouseUp as EventListener);
    },
    [enabled, position]
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!dragStateRef.current.isDragging) return;

      requestAnimationFrame(() => {
        const newPosition: Position = {
          x: event.clientX - dragStateRef.current.dragOffset.x,
          y: event.clientY - dragStateRef.current.dragOffset.y,
        };
        onPositionChange(newPosition);
      });
    },
    [onPositionChange]
  );

  const handleMouseUp = useCallback(() => {
    dragStateRef.current.isDragging = false;
    document.removeEventListener('mousemove', handleMouseMove as EventListener);
    document.removeEventListener('mouseup', handleMouseUp as EventListener);
  }, []);

  const initDrag = useCallback(
    (element: HTMLDivElement | null) => {
      dragRef.current = element;
      if (element && enabled) {
        const headerElement = element.querySelector(
          '.calculator-header'
        ) as HTMLElement | null;
        if (headerElement) {
          headerElement.style.cursor = 'grab';
          headerElement.addEventListener(
            'mousedown',
            handleMouseDown as EventListener
          );
        }
      }
    },
    [enabled, handleMouseDown]
  );

  useEffect(() => {
    return () => {
      document.removeEventListener(
        'mousemove',
        handleMouseMove as EventListener
      );
      document.removeEventListener('mouseup', handleMouseUp as EventListener);
    };
  }, [handleMouseMove, handleMouseUp]);

  // 🔥 Fix for Touch Support (Mobile)
  useEffect(() => {
    const element = dragRef.current;
    if (!element || !enabled) return;

    const headerElement = element.querySelector(
      '.calculator-header'
    ) as HTMLElement | null;
    if (!headerElement) return;

    headerElement.style.cursor = 'grab';

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];

      dragStateRef.current = {
        isDragging: true,
        startX: touch.clientX,
        startY: touch.clientY,
        dragOffset: {
          x: touch.clientX - position.x,
          y: touch.clientY - position.y,
        },
      };

      document.addEventListener('touchmove', handleTouchMove as EventListener, {
        passive: false,
      });
      document.addEventListener('touchend', handleTouchEnd as EventListener);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!dragStateRef.current.isDragging || e.touches.length !== 1) return;
      const touch = e.touches[0];

      const newPosition: Position = {
        x: touch.clientX - dragStateRef.current.dragOffset.x,
        y: touch.clientY - dragStateRef.current.dragOffset.y,
      };

      requestAnimationFrame(() => {
        onPositionChange(newPosition);
      });

      e.preventDefault();
    };

    const handleTouchEnd = () => {
      dragStateRef.current.isDragging = false;
      document.removeEventListener(
        'touchmove',
        handleTouchMove as EventListener
      );
      document.removeEventListener('touchend', handleTouchEnd as EventListener);
    };

    headerElement.addEventListener(
      'touchstart',
      handleTouchStart as EventListener,
      { passive: false }
    );

    return () => {
      headerElement.removeEventListener(
        'touchstart',
        handleTouchStart as EventListener
      );
      document.removeEventListener(
        'touchmove',
        handleTouchMove as EventListener
      );
      document.removeEventListener('touchend', handleTouchEnd as EventListener);
    };
  }, [enabled, position, onPositionChange]);

  return {
    dragRef: initDrag,
  };
};

export default useDraggable;
