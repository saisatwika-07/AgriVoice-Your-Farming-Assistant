import axios from "axios";
import cheerio from "cheerio";

var farmerNews = [];

async function scrapeFarmerNews() {
    try {
        // Fetch the HTML content of the Times of India page
        const response = await axios.get('https://timesofindia.indiatimes.com/topic/Farmers');
        
        // Load the HTML content into cheerio
        const $ = cheerio.load(response.data);
        
        
        // Find the news articles on the page
        $('.uwU81').each((index, element) => {
            // Check if the news article is related to farmers
            const title = $(element).find('.uwU81 .VXBf7 .fHv_i.o58kM span').text().trim();
            const url = $(element).find('a').attr('href');
            const date = $(element).find('.uwU81 .VXBf7 .ZxBIG').text().trim();
            
            // Add the news title and URL to the farmerNews array
            // if (title.toLowerCase().includes('farmer')) {
            //     farmerNews.push({ title, url });
            // }

            farmerNews.push({ title, url , date});
        });
        
        return farmerNews;
    } catch (error) {
        console.error('Error scraping farmer news:', error);
        return [];
    }
}

// Usage
scrapeFarmerNews().then(farmerNews => {
    console.log("Farmers news successfully scraped");
    // Process the farmer news as required
});


export default farmerNews;