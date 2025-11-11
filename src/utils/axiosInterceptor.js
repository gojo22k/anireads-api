import axios from "axios";
import * as cheerio from "cheerio";

const baseUrl = "https://mangareader.to";

const axiosInterceptor = async (endpoint) => {
   console.log("Fetching:", baseUrl + endpoint);
   try {
      const { data, status } = await axios.get(baseUrl + endpoint, {
         headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Cache-Control": "max-age=0",
            "DNT": "1"
         },
         timeout: 8000, // Reduced to 8 seconds to avoid Vercel timeout
         maxRedirects: 5,
         validateStatus: function (status) {
            return status >= 200 && status < 500; // Accept any status less than 500
         }
      });

      console.log("Response status:", status);

      if (status !== 200) {
         throw new Error(`HTTP ${status}: Unable to fetch page`);
      }

      const $ = cheerio.load(data);
      return $;
   } catch (error) {
      console.error("Error in axiosInterceptor:", {
         message: error.message,
         code: error.code,
         status: error.response?.status,
         endpoint: endpoint
      });
      
      // More specific error messages
      if (error.code === 'ECONNABORTED') {
         throw new Error('Request timeout - server took too long to respond');
      } else if (error.code === 'ENOTFOUND') {
         throw new Error('DNS lookup failed - unable to reach server');
      } else if (error.response?.status === 403) {
         throw new Error('Access forbidden - site may be blocking requests');
      } else if (error.response?.status === 503) {
         throw new Error('Service unavailable - site may be down');
      }
      
      throw new Error(`Failed to fetch data: ${error.message}`);
   }
};

const fetchAPI = async (Referer, endpoint) => {
   try {
      console.log("Fetching API:", baseUrl + endpoint);

      const { data, status } = await axios.get(baseUrl + endpoint, {
         headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": baseUrl + Referer,
            "X-Requested-With": "XMLHttpRequest",
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "DNT": "1"
         },
         timeout: 8000,
         maxRedirects: 5,
         validateStatus: function (status) {
            return status >= 200 && status < 500;
         }
      });

      console.log("API Response status:", status);

      if (status !== 200) {
         throw new Error(`HTTP ${status}: Unable to fetch API data`);
      }

      if (!data || !data.html) {
         throw new Error("Invalid response format from API");
      }

      return data.html;
   } catch (error) {
      console.error("Error in fetchAPI:", {
         message: error.message,
         code: error.code,
         status: error.response?.status,
         endpoint: endpoint
      });
      
      if (error.code === 'ECONNABORTED') {
         throw new Error('API request timeout');
      } else if (error.response?.status === 403) {
         throw new Error('API access forbidden');
      }
      
      throw new Error(`Failed to fetch API data: ${error.message}`);
   }
};

export { axiosInterceptor, fetchAPI };
