import { adminApi, healthApi } from './api';

export async function initializeAppData() {
  try {
    console.log('Checking backend health...');
    
    // First check if the backend is healthy
    await healthApi.check();
    console.log('Backend is healthy');

    // Initialize the data
    console.log('Initializing application data...');
    const result = await adminApi.initializeData();
    
    if (result.success) {
      console.log('Application data initialized successfully');
      return { success: true, message: 'Data initialized successfully' };
    } else {
      throw new Error(result.error || 'Failed to initialize data');
    }
  } catch (error) {
    console.error('Failed to initialize application data:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Check if data needs to be initialized (run this on app start)
export async function checkAndInitializeData() {
  try {
    // Try to fetch a sample product to see if data exists with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(`https://exufontwxqjrnpmyisso.supabase.co/functions/v1/make-server-4d0792a7/products?limit=1`, {
      signal: controller.signal,
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4dWZvbnR3eHFqcm5wbXlpc3NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2NDE2NjgsImV4cCI6MjA3MzIxNzY2OH0.adA28qo0-ZX1wiqlmxbrmG9FIimL-XPNoAYr5PvKNLM`
      }
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      
      // If no products exist, initialize data
      if (!data.products || data.products.length === 0) {
        console.log('No data found, initializing...');
        return await initializeAppData();
      } else {
        console.log('Data already exists, skipping initialization');
        return { success: true, message: 'Data already exists' };
      }
    } else {
      // If there's an error, try to initialize
      console.log('Error checking data, attempting initialization...');
      return await initializeAppData();
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn('Data check timed out, continuing without backend for now');
      return { success: true, message: 'Backend not available, using local data' };
    }
    
    console.error('Error checking data existence:', error);
    // Continue without error to allow app to work with local data
    return { success: true, message: 'Backend not available, using local data' };
  }
}