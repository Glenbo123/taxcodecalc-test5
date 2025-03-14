/**
 * Creates a safe requestAnimationFrame that automatically cleans up
 * @param callback Function to execute
 * @returns Cleanup function
 */
export function safeRequestAnimationFrame(
  callback: FrameRequestCallback
): () => void {
  if (typeof callback !== 'function') {
    console.error('Invalid callback provided to safeRequestAnimationFrame');
    return () => {};
  }

  let frameId: number | null = null;

  try {
    frameId = requestAnimationFrame((timestamp) => {
      try {
        callback(timestamp);
      } catch (error) {
        console.error('Error in animation frame callback:', error);
      }
    });
  } catch (error) {
    console.error('Error requesting animation frame:', error);
    return () => {};
  }

  return () => {
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
    }
  };
}
