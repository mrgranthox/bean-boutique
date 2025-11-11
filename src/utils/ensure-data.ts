import { adminApi, productsApi } from './api';

let dataInitialized = false;
let initializationPromise: Promise<void> | null = null;

export async function ensureDataInitialized(): Promise<void> {
  // If already initialized, return immediately
  if (dataInitialized) {
    return;
  }

  // If initialization is in progress, wait for it
  if (initializationPromise) {
    return initializationPromise;
  }

  // Start initialization
  initializationPromise = (async () => {
    try {
      console.log('Checking if products exist...');
      
      // Try to initialize data first, then check if it worked
      console.log('Initializing data...');
      const result = await adminApi.initializeData();
      
      if (result.success) {
        console.log('Data initialization successful');
        
        // Now check if products exist
        const response = await productsApi.getProducts({ limit: 1 });
        
        if (response && response.products && response.products.length > 0) {
          console.log('Products verified after initialization');
          dataInitialized = true;
        } else {
          console.warn('Products still not found after initialization');
          // Try to force re-initialize
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
          const retryResponse = await productsApi.getProducts({ limit: 1 });
          if (retryResponse && retryResponse.products && retryResponse.products.length > 0) {
            console.log('Products found after retry');
            dataInitialized = true;
          }
        }
      } else {
        console.warn('Data initialization failed:', result.error);
        // Don't throw error, allow app to continue with fallback data
      }
    } catch (error) {
      console.warn('Error during data initialization, continuing with fallback:', error);
      // Don't throw error, allow app to continue with fallback data
    }
  })();

  return initializationPromise;
}

export function resetDataInitialization() {
  dataInitialized = false;
  initializationPromise = null;
}