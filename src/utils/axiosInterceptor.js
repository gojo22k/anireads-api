import axios from "axios";
import * as cheerio from "cheerio";

const baseUrl = "https://mangareader.to";

const axiosInterceptor = async (endpoint) => {
   console.log(baseUrl + endpoint);
   try {
      const { data } = await axios.get(baseUrl + endpoint, {
         headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1"
         },
         timeout: 10000 // 10 second timeout
      });
      const $ = cheerio.load(data);
      return $;
   } catch (error) {
      console.error("Error in axiosInterceptor:", error.message);
      throw new Error(`Failed to fetch data: ${error.message}`);
   }
};

const fetchAPI = async (Referer, endpoint) => {
   try {
      console.log(baseUrl + endpoint);

      const { data } = await axios.get(baseUrl + endpoint, {
         headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0",
            "Referer": baseUrl + Referer,
            "X-Requested-With": "XMLHttpRequest",
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive"
         },
         timeout: 10000 // 10 second timeout
      });

      if (!data || !data.html) {
         throw new Error("Invalid response format from API");
      }

      return data.html;
   } catch (error) {
      console.error("Error in fetchAPI:", error.message);
      throw new Error(`Failed to fetch API data: ${error.message}`);
   }
};

export { axiosInterceptor, fetchAPI };
