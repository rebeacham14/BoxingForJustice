export const SQUARE_ENVIRONMENT =
  import.meta.env.VITE_SQUARE_ENVIRONMENT === 'production' ? 'production' : 'sandbox';

export const SQUARE_APPLICATION_ID = import.meta.env.VITE_SQUARE_APPLICATION_ID;
export const SQUARE_LOCATION_ID = import.meta.env.VITE_SQUARE_LOCATION_ID;

const SQUARE_JS_SRC =
  SQUARE_ENVIRONMENT === 'production'
    ? 'https://web.squarecdn.com/v1/square.js'
    : 'https://sandbox.web.squarecdn.com/v1/square.js';

let squareSdkPromise = null;

export function loadSquareSdk() {
  if (window.Square) {
    return Promise.resolve(window.Square);
  }

  if (!squareSdkPromise) {
    squareSdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = SQUARE_JS_SRC;
      script.async = true;
      script.onload = () => resolve(window.Square);
      script.onerror = () => {
        squareSdkPromise = null;
        reject(new Error('Failed to load the Square payment SDK.'));
      };
      document.body.appendChild(script);
    });
  }

  return squareSdkPromise;
}
