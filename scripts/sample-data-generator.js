#!/usr/bin/env node

/**
 * Sample Data Generator for Real Estate Sites
 * This script generates sample data that matches your MongoDB schema
 * You can replace the generation logic with Gemini AI calls
 */

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Sample cities and states data
const INDIAN_LOCATIONS = [
  { city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra', region: 'Western India', pinCode: '400001' },
  { city: 'Delhi', district: 'New Delhi', state: 'Delhi', region: 'North India', pinCode: '110001' },
  { city: 'Bangalore', district: 'Bangalore Urban', state: 'Karnataka', region: 'South India', pinCode: '560001' },
  { city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', region: 'South India', pinCode: '500001' },
  { city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', region: 'South India', pinCode: '600001' },
  { city: 'Kolkata', district: 'Kolkata', state: 'West Bengal', region: 'Eastern India', pinCode: '700001' },
  { city: 'Pune', district: 'Pune', state: 'Maharashtra', region: 'Western India', pinCode: '411001' },
  { city: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat', region: 'Western India', pinCode: '380001' },
  { city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan', region: 'North India', pinCode: '302001' },
  { city: 'Lucknow', district: 'Lucknow', state: 'Uttar Pradesh', region: 'North India', pinCode: '226001' }
];

const PROPERTY_TYPES = [
  'Residential Apartments',
  'Independent Houses',
  'Villas',
  'Plots',
  'Commercial Spaces',
  'Office Spaces',
  'Retail Shops',
  'Warehouses',
  'Industrial Land',
  'Agricultural Land'
];

const LOCALITIES_TEMPLATES = {
  'Mumbai': ['Bandra', 'Andheri', 'Powai', 'Malad', 'Borivali', 'Thane', 'Navi Mumbai', 'Worli'],
  'Delhi': ['Connaught Place', 'Karol Bagh', 'Lajpat Nagar', 'Dwarka', 'Gurgaon', 'Noida', 'Faridabad'],
  'Bangalore': ['Koramangala', 'Indiranagar', 'Whitefield', 'Electronic City', 'HSR Layout', 'BTM Layout'],
  'Hyderabad': ['Hitech City', 'Gachibowli', 'Jubilee Hills', 'Banjara Hills', 'Kondapur', 'Madhapur'],
  'Chennai': ['T. Nagar', 'Anna Nagar', 'OMR', 'ECR', 'Velachery', 'Adyar'],
};

class SampleDataGenerator {
  constructor() {
    this.generatedSlugs = new Set();
  }

  /**
   * Generate a unique slug
   */
  generateUniqueSlug(city, propertyType) {
    const baseSlug = `${city.toLowerCase()}-${propertyType.toLowerCase().replace(/\s+/g, '-')}`;
    let counter = 1;
    let slug = baseSlug;
    
    while (this.generatedSlugs.has(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.generatedSlugs.add(slug);
    return slug;
  }

  /**
   * Generate random coordinates near a city
   */
  generateCoordinates(baseLocation) {
    // Add small random offset to base coordinates (you can set actual coordinates for each city)
    const baseCoordinates = {
      'Mumbai': { lat: 19.0760, lng: 72.8777 },
      'Delhi': { lat: 28.7041, lng: 77.1025 },
      'Bangalore': { lat: 12.9716, lng: 77.5946 },
      'Hyderabad': { lat: 17.3850, lng: 78.4867 },
      'Chennai': { lat: 13.0827, lng: 80.2707 },
      'Kolkata': { lat: 22.5726, lng: 88.3639 },
      'Pune': { lat: 18.5204, lng: 73.8567 },
      'Ahmedabad': { lat: 23.0225, lng: 72.5714 },
      'Jaipur': { lat: 26.9124, lng: 75.7873 },
      'Lucknow': { lat: 26.8467, lng: 80.9462 }
    };

    const base = baseCoordinates[baseLocation.city] || { lat: 20.0, lng: 77.0 };
    return {
      lat: base.lat + (Math.random() - 0.5) * 0.1, // Small random offset
      lng: base.lng + (Math.random() - 0.5) * 0.1
    };
  }

  /**
   * Generate FAQ data
   */
  generateFAQ(city, propertyType) {
    const faqs = [
      {
        question: `What are the best areas for ${propertyType} in ${city}?`,
        answer: `The best areas for ${propertyType} in ${city} include prime locations with good connectivity, infrastructure, and amenities. Our expert team can guide you to the most suitable options based on your budget and preferences.`
      },
      {
        question: `What is the average price of ${propertyType} in ${city}?`,
        answer: `Property prices in ${city} vary based on location, amenities, and market conditions. Contact our team for the latest market rates and best deals on ${propertyType}.`
      },
      {
        question: `Are there any upcoming infrastructure projects in ${city}?`,
        answer: `${city} has several upcoming infrastructure projects including metro expansions, highway developments, and commercial hubs that can positively impact property values.`
      },
      {
        question: `What documents are required for buying ${propertyType}?`,
        answer: `Essential documents include title deeds, NOC from authorities, building approvals, tax receipts, and legal clearances. Our team assists with complete documentation verification.`
      }
    ];

    return faqs.slice(0, Math.floor(Math.random() * 3) + 2); // Return 2-4 FAQs randomly
  }

  /**
   * Generate a single site data object
   */
  generateSiteData(location, propertyType) {
    const { city, district, state, region, pinCode } = location;
    const coordinates = this.generateCoordinates(location);
    const slug = this.generateUniqueSlug(city, propertyType);
    const siteId = uuidv4();

    // Get localities for this city, or generate generic ones
    const cityLocalities = LOCALITIES_TEMPLATES[city] || [
      'Central Area', 'East Zone', 'West Zone', 'North Sector', 'South District'
    ];

    const localities = [
      cityLocalities.slice(0, Math.floor(Math.random() * 4) + 3)
    ];

    const sublocalities = [
      localities[0].map(locality => [`${locality} Phase 1`, `${locality} Phase 2`]).flat()
    ];

    const quickLinks = [
      [
        `${propertyType} for Sale in ${city}`,
        `${propertyType} for Rent in ${city}`,
        `New Projects in ${city}`,
        `Property Dealers in ${city}`,
        `Real Estate in ${district}`,
        `Investment Options in ${city}`
      ]
    ];

    return {
      siteId,
      isActive: true,
      slugId: siteId,
      slug,
      metaTitle: [
        `Best ${propertyType} in ${city} | Premium Real Estate Deals`,
        `${city} ${propertyType} - Buy, Sell, Rent | Reeltor.com`,
        `Top ${propertyType} Properties in ${city}, ${state}`
      ],
      location: {
        lat: coordinates.lat,
        lng: coordinates.lng,
        city,
        district,
        state,
        region,
        country: 'India',
        pinCode
      },
      propertyType,
      shortDescription: `Find the best ${propertyType} in ${city}, ${state}. Explore premium properties with excellent connectivity, modern amenities, and great investment potential in ${region}.`,
      description: `Discover exceptional ${propertyType} opportunities in ${city}, one of ${state}'s most promising real estate markets. Our curated selection of properties offers modern amenities, strategic locations, and excellent connectivity. Whether you're looking for residential comfort or commercial success, ${city} provides the perfect backdrop for your real estate investment. With proximity to business districts, educational institutions, and healthcare facilities, these properties represent the ideal blend of convenience and luxury in ${region}.`,
      localities,
      quickLinks,
      sublocalities,
      keywords: [
        `${propertyType.toLowerCase()} ${city.toLowerCase()}`,
        `real estate ${city.toLowerCase()}`,
        `property ${city.toLowerCase()}`,
        `${propertyType.toLowerCase()} for sale ${city.toLowerCase()}`,
        `${propertyType.toLowerCase()} ${state.toLowerCase()}`,
        `investment ${city.toLowerCase()}`,
        `buy property ${city.toLowerCase()}`,
        `${district.toLowerCase()} real estate`
      ],
      faq: this.generateFAQ(city, propertyType),
      footer: {
        title: `${city} Real Estate - Reeltor.com`,
        description: `Your trusted partner for ${propertyType} in ${city}, ${state}. Find, buy, sell, and invest in premium properties with confidence.`
      }
    };
  }

  /**
   * Generate multiple site data entries
   */
  generateBulkData(count = 100) {
    const sites = [];
    
    for (let i = 0; i < count; i++) {
      // Pick random location and property type
      const location = INDIAN_LOCATIONS[Math.floor(Math.random() * INDIAN_LOCATIONS.length)];
      const propertyType = PROPERTY_TYPES[Math.floor(Math.random() * PROPERTY_TYPES.length)];
      
      sites.push(this.generateSiteData(location, propertyType));
    }

    return sites;
  }

  /**
   * Generate and save to JSON file for testing
   */
  async generateAndSave(count = 10, filename = 'sample-sites-data.json') {
    console.log(`🚀 Generating ${count} sample site data entries...`);
    
    const sites = this.generateBulkData(count);
    
    const fs = require('fs').promises;
    const path = require('path');
    
    const outputPath = path.join(__dirname, filename);
    await fs.writeFile(outputPath, JSON.stringify(sites, null, 2));
    
    console.log(`✅ Generated ${sites.length} entries and saved to ${outputPath}`);
    console.log(`📁 File size: ${(JSON.stringify(sites).length / 1024).toFixed(2)} KB`);
    
    return sites;
  }

  /**
   * Generate data that mimics Gemini AI output structure
   * This is where you would integrate with Gemini AI API
   */
  async generateWithAI(prompt, location, propertyType) {
    // Placeholder for Gemini AI integration
    // You would replace this with actual Gemini AI API calls
    console.log(`🤖 Generating AI content for ${propertyType} in ${location.city}...`);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Return enhanced data structure
    const baseData = this.generateSiteData(location, propertyType);
    
    // Add AI-enhanced content
    return {
      ...baseData,
      // Enhanced meta titles from AI
      metaTitle: [
        `Premium ${propertyType} in ${location.city} - Luxury Living Redefined`,
        `${location.city}'s Most Sought-After ${propertyType} | Reeltor.com`,
        `Invest Smart: Top ${propertyType} Deals in ${location.city}, ${location.state}`
      ],
      // AI-generated description
      description: `Experience the pinnacle of modern living with our exclusive ${propertyType} collection in ${location.city}. Strategically located in ${location.district}, these premium properties offer unmatched connectivity to ${location.city}'s business hubs and entertainment centers. Each property is meticulously designed with contemporary architecture, world-class amenities, and sustainable living features. The location provides excellent access to schools, hospitals, shopping centers, and recreational facilities, making it an ideal investment opportunity in ${location.region}. With ${location.city}'s rapid infrastructure development and growing IT sector, these ${propertyType} represent not just a home, but a gateway to future prosperity.`,
      // AI-enhanced FAQ
      faq: [
        {
          question: `Why should I invest in ${propertyType} in ${location.city}?`,
          answer: `${location.city} offers exceptional growth potential with its expanding IT sector, world-class infrastructure, and strategic location in ${location.region}. The city's real estate market shows consistent appreciation, making ${propertyType} an excellent long-term investment choice.`
        },
        {
          question: `What makes this location special for ${propertyType}?`,
          answer: `Our ${propertyType} in ${location.district} benefit from proximity to major business districts, excellent transportation connectivity, and a thriving community ecosystem. The area is known for its safety, cleanliness, and quality of life.`
        },
        ...baseData.faq
      ]
    };
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const count = parseInt(args[0]) || 10;
  const filename = args[1] || 'sample-sites-data.json';
  
  const generator = new SampleDataGenerator();
  
  generator.generateAndSave(count, filename)
    .then(() => {
      console.log('✨ Sample data generation completed!');
      console.log('\n📋 Usage examples:');
      console.log('  node sample-data-generator.js 50          # Generate 50 entries');
      console.log('  node sample-data-generator.js 100 output.json  # Generate 100 entries to output.json');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error generating data:', error);
      process.exit(1);
    });
}

module.exports = SampleDataGenerator;