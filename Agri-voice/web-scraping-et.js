import axios from "axios";
import cheerio from "cheerio";

var farmerNewsEt = [];

async function scrapeFarmerNews() {
    try {
        // Fetch the HTML content of the Times of India page
        const response = await axios.get('https://economictimes.indiatimes.com/topic/farmers');
        
        // Load the HTML content into cheerio
        const $ = cheerio.load(response.data);
        

        // Find the news articles on the page
        $('#categorywise .topicstry').each((index, element) => {
            // Check if the news article is related to farmers
            const title = $(element).find('a').attr('title').trim();
            const url = "https://economictimes.indiatimes.com"+ $(element).find('a').attr('href');
            const date = $(element).find('.topicstry time').text().trim();
            

            farmerNewsEt.push({ title, url , date});
        });
        
        return farmerNewsEt;
    } catch (error) {
        console.error('Error scraping farmer news:', error);
        return [];
    }
}

// Usage
scrapeFarmerNews().then(farmerNews => {
    console.log("Farmers news successfully scraped");
    console.log(farmerNewsEt);
});


export default farmerNewsEt;