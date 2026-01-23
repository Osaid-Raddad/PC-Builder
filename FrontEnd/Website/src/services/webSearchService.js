import axios from 'axios';

// Multiple search API options - configure one based on what you have access to

/**
 * Option 1: DuckDuckGo Instant Answer API (Free, No API Key)
 * Good for quick facts and basic information
 */
export const searchDuckDuckGo = async (query) => {
  try {
    const response = await axios.get('https://api.duckduckgo.com/', {
      params: {
        q: query,
        format: 'json',
        no_html: 1,
        skip_disambig: 1,
      },
    });

    const data = response.data;
    
    // Extract relevant information
    const results = {
      abstract: data.Abstract || '',
      abstractText: data.AbstractText || '',
      abstractSource: data.AbstractSource || '',
      abstractURL: data.AbstractURL || '',
      relatedTopics: data.RelatedTopics?.slice(0, 3).map(topic => ({
        text: topic.Text,
        url: topic.FirstURL,
      })) || [],
    };

    return results;
  } catch (error) {
    console.error('DuckDuckGo Search Error:', error);
    return null;
  }
};

/**
 * Option 2: SerpAPI (Requires API Key - has free tier)
 * Best for comprehensive search results
 */
export const searchWithSerpAPI = async (query) => {
  const SERP_API_KEY = import.meta.env.VITE_SERPAPI_KEY || '';
  
  if (!SERP_API_KEY) {
    console.warn('SerpAPI key not configured');
    return null;
  }

  try {
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        q: query,
        api_key: SERP_API_KEY,
        engine: 'google',
        num: 5,
      },
    });

    const organicResults = response.data.organic_results || [];
    
    return organicResults.slice(0, 5).map(result => ({
      title: result.title,
      snippet: result.snippet,
      link: result.link,
    }));
  } catch (error) {
    console.error('SerpAPI Search Error:', error);
    return null;
  }
};

/**
 * Option 3: Brave Search API (Requires API Key - generous free tier)
 * Good balance of quality and availability
 */
export const searchWithBrave = async (query) => {
  const BRAVE_API_KEY = import.meta.env.VITE_BRAVE_SEARCH_KEY || '';
  
  if (!BRAVE_API_KEY) {
    console.warn('Brave Search API key not configured');
    return null;
  }

  try {
    const response = await axios.get('https://api.search.brave.com/res/v1/web/search', {
      params: {
        q: query,
        count: 5,
      },
      headers: {
        'X-Subscription-Token': BRAVE_API_KEY,
        'Accept': 'application/json',
      },
    });

    const results = response.data.web?.results || [];
    
    return results.map(result => ({
      title: result.title,
      description: result.description,
      url: result.url,
    }));
  } catch (error) {
    console.error('Brave Search Error:', error);
    return null;
  }
};

/**
 * Option 4: Bing Web Search API (Requires Azure API Key)
 */
export const searchWithBing = async (query) => {
  const BING_API_KEY = import.meta.env.VITE_BING_SEARCH_KEY || '';
  
  if (!BING_API_KEY) {
    console.warn('Bing Search API key not configured');
    return null;
  }

  try {
    const response = await axios.get('https://api.bing.microsoft.com/v7.0/search', {
      params: {
        q: query,
        count: 5,
      },
      headers: {
        'Ocp-Apim-Subscription-Key': BING_API_KEY,
      },
    });

    const webPages = response.data.webPages?.value || [];
    
    return webPages.map(page => ({
      title: page.name,
      snippet: page.snippet,
      url: page.url,
    }));
  } catch (error) {
    console.error('Bing Search Error:', error);
    return null;
  }
};

/**
 * Main search function that tries multiple services
 * @param {string} query - Search query
 * @returns {Promise<Object>} - Search results
 */
export const searchInternet = async (query) => {
  // Add PC-specific context to improve results
  const pcQuery = `${query} PC computer hardware`;

  // Try DuckDuckGo first (no API key needed)
  let results = await searchDuckDuckGo(pcQuery);
  
  if (results && (results.abstractText || results.relatedTopics.length > 0)) {
    return {
      source: 'DuckDuckGo',
      data: results,
    };
  }

  // Try Brave Search if available
  results = await searchWithBrave(pcQuery);
  if (results && results.length > 0) {
    return {
      source: 'Brave',
      data: results,
    };
  }

  // Try SerpAPI if available
  results = await searchWithSerpAPI(pcQuery);
  if (results && results.length > 0) {
    return {
      source: 'SerpAPI',
      data: results,
    };
  }

  // Try Bing if available
  results = await searchWithBing(pcQuery);
  if (results && results.length > 0) {
    return {
      source: 'Bing',
      data: results,
    };
  }

  return null;
};

/**
 * Format search results into a readable response
 * @param {Object} searchResults - Results from searchInternet
 * @returns {string} - Formatted text response
 */
export const formatSearchResults = (searchResults) => {
  if (!searchResults) {
    return "I couldn't find recent information on that topic. Let me help you with general knowledge about PC building!";
  }

  const { source, data } = searchResults;

  if (source === 'DuckDuckGo') {
    let response = '';
    
    if (data.abstractText) {
      response += `${data.abstractText}\n`;
      if (data.abstractSource) {
        response += `\nSource: ${data.abstractSource}`;
      }
    }
    
    if (data.relatedTopics.length > 0) {
      response += '\n\nRelated information:\n';
      data.relatedTopics.forEach((topic, index) => {
        response += `${index + 1}. ${topic.text}\n`;
      });
    }
    
    return response || "I found some information but it's not detailed enough. Let me help you based on my PC building knowledge!";
  }

  // For other search engines (Brave, SerpAPI, Bing)
  if (Array.isArray(data) && data.length > 0) {
    let response = 'Here\'s what I found:\n\n';
    
    data.slice(0, 3).forEach((result, index) => {
      const snippet = result.snippet || result.description || '';
      response += `${index + 1}. ${result.title}\n${snippet}\n\n`;
    });
    
    return response;
  }

  return "I couldn't find specific information on that. Let me help you with my PC building knowledge!";
};

export default {
  searchInternet,
  formatSearchResults,
  searchDuckDuckGo,
  searchWithBrave,
  searchWithSerpAPI,
  searchWithBing,
};
