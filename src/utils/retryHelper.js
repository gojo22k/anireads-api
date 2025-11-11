// src/utils/retryHelper.js

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const retryWithBackoff = async (fn, maxRetries = 3, initialDelay = 1000) => {
   let lastError;
   
   for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
         return await fn();
      } catch (error) {
         lastError = error;
         
         // Don't retry on certain errors
         if (error.message.includes('403') || error.message.includes('404')) {
            throw error;
         }
         
         if (attempt < maxRetries - 1) {
            const delay = initialDelay * Math.pow(2, attempt);
            console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
            await sleep(delay);
         }
      }
   }
   
   throw lastError;
};
