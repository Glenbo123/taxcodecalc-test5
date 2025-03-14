@@ .. @@
     const handleTouchStart = (e: TouchEvent) => {
       if (e.touches.length !== 1) return;
       const touch = e.touches[0];
+      e.preventDefault();
 
       dragStateRef.current = {
         isDragging: true,
         startX: touch.clientX,
         startY: touch.clientY,
         dragOffset: {
           x: touch.clientX - position.x,
           y: touch.clientY - position.y,
         },
       };
 
-      document.addEventListener('touchmove', handleTouchMove as EventListener, {
-        passive: false,
-      });
-      document.addEventListener('touchend', handleTouchEnd as EventListener);
+      window.addEventListener('touchmove', handleTouchMove, { passive: false });
+      window.addEventListener('touchend', handleTouchEnd);
     };
 
     const handleTouchMove = (e: TouchEvent) => {
       if (!dragStateRef.current.isDragging || e.touches.length !== 1) return;
       const touch = e.touches[0];
+      e.preventDefault();
 
       const newPosition: Position = {
         x: touch.clientX - dragStateRef.current.dragOffset.x,
         y: touch.clientY - dragStateRef.current.dragOffset.y,
       };
 
       requestAnimationFrame(() => {
         onPositionChange(newPosition);
       });
-
-      e.preventDefault();
     };
 
     const handleTouchEnd = () => {
       dragStateRef.current.isDragging = false;
-      document.removeEventListener(
-        'touchmove',
-        handleTouchMove as EventListener
-      );
-      document.removeEventListener('touchend', handleTouchEnd as EventListener);
+      window.removeEventListener('touchmove', handleTouchMove);
+      window.removeEventListener('touchend', handleTouchEnd);
     };
 
     headerElement.addEventListener(
       'touchstart',
-      handleTouchStart as EventListener,
+      handleTouchStart,
       { passive: false }
     );
 
     return () => {
       headerElement.removeEventListener(
         'touchstart',
-        handleTouchStart as EventListener
+        handleTouchStart
       );
-      document.removeEventListener(
-        'touchmove',
-        handleTouchMove as EventListener
-      );
-      document.removeEventListener('touchend', handleTouchEnd as EventListener);
+      window.removeEventListener('touchmove', handleTouchMove);
+      window.removeEventListener('touchend', handleTouchEnd);
     };
   }, [enabled, position, onPositionChange]);