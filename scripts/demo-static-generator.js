#!/usr/bin/env node

/**
 * Demo Static Site Generator
 * Generates beautiful static sites using sample data to demonstrate the pipeline output
 */

const fs = require('fs').promises;
const path = require('path');

class DemoStaticGenerator {
  constructor() {
    this.outputDir = path.join(__dirname, '..', 'demo-static-sites');
  }

  async generateDemo() {
    console.log('🎬 Generating demo static sites...');
    
    // Create output directories
    await fs.mkdir(this.outputDir, { recursive: true });
    await fs.mkdir(path.join(this.outputDir, 'content'), { recursive: true });
    await fs.mkdir(path.join(this.outputDir, 'sites'), { recursive: true });

    // Generate sample TextToReels content
    const textToReelsData = this.generateSampleTextToReelsData();
    
    // Generate sample Real Estate sites
    const realEstateData = this.generateSampleRealEstateData();
    
    // Generate HTML files
    await this.generateTextToReelsPages(textToReelsData);
    await this.generateRealEstatePages(realEstateData);
    await this.generateIndexPage(textToReelsData, realEstateData);
    
    console.log(`✅ Demo sites generated in: ${this.outputDir}`);
    return this.outputDir;
  }

  generateSampleTextToReelsData() {
    return [
      {
        contentId: "ttr_love_quotes_1736358234_abc123",
        slug: "hindi-love-quotes-dark-theme-instagram",
        contentType: "love_quotes",
        language: "hindi",
        theme: "dark_theme",
        platform: "instagram_post",
        audience: "students",
        metaTitle: [
          "Hindi Love Quotes for Students | Dark Theme Instagram Posts",
          "Romantic Hindi Shayari - Perfect for College Students",
          "प्रेम शायरी - छात्रों के लिए खास"
        ],
        shortDescription: "Beautiful Hindi love quotes perfect for students to share on Instagram with stunning dark theme design.",
        description: "Discover the most beautiful Hindi love quotes specially curated for college students. These romantic shayaris and quotes are perfect for sharing on Instagram with our premium dark theme design. Each quote is crafted to resonate with young hearts and capture the essence of pure love.",
        contentText: {
          primary: "जब तुम्हारा इंतज़ार करते हैं, तो लगता है जैसे वक़्त भी रुक गया हो ❤️",
          variations: [
            "तुम्हारी याद में खुद को खो देना, ये भी एक खुशी है 💫",
            "प्यार में जो मिले वो खुशी, जो न मिले वो शायरी 🌹"
          ],
          hashtags: ["#HindiLoveQuotes", "#StudentLife", "#RomanticQuotes", "#HindiShayari", "#Love"],
          callToAction: "Share if you can relate! ❤️"
        },
        categoryDisplay: "love quotes (hindi)",
        platformDisplay: "Instagram Post",
        creatorTips: [
          "Use dark theme for better engagement with students",
          "Post during evening hours for maximum reach",
          "Combine with trending hashtags for viral potential"
        ]
      },
      {
        contentId: "ttr_motivational_2736358234_def456",
        slug: "english-motivational-quotes-gradient-theme-linkedin",
        contentType: "motivational_quotes",
        language: "english",
        theme: "gradient_theme",
        platform: "linkedin_post",
        audience: "professionals",
        metaTitle: [
          "Motivational Quotes for Professionals | LinkedIn Posts",
          "Success Quotes - Perfect for Professional Growth",
          "Career Motivation for Working Professionals"
        ],
        shortDescription: "Inspiring motivational quotes designed for professionals to boost their LinkedIn presence with gradient theme styling.",
        description: "Elevate your professional presence with our premium collection of motivational quotes. These carefully selected success quotes are perfect for LinkedIn professionals who want to inspire their network while building their personal brand. Each quote is designed to motivate and drive career growth.",
        contentText: {
          primary: "Success is not final, failure is not fatal: it is the courage to continue that counts. ⚡",
          variations: [
            "Your only limit is the amount of energy you're willing to expend. 🔥",
            "Dream big, work hard, stay focused, and surround yourself with good people. 💪"
          ],
          hashtags: ["#Motivation", "#Success", "#ProfessionalGrowth", "#CareerTips", "#Leadership"],
          callToAction: "Tag someone who needs to see this! 💪"
        },
        categoryDisplay: "motivational quotes (english)",
        platformDisplay: "LinkedIn Post",
        creatorTips: [
          "Use gradient theme for professional appeal",
          "Post during morning hours for maximum reach",
          "Add personal insights in comments for better engagement"
        ]
      },
      {
        contentId: "ttr_funny_3736358234_ghi789",
        slug: "hinglish-funny-memes-colorful-theme-twitter",
        contentType: "funny_memes",
        language: "hinglish",
        theme: "colorful_theme",
        platform: "twitter_post",
        audience: "teenagers",
        metaTitle: [
          "Funny Hinglish Memes for Teenagers | Twitter Posts",
          "Comedy Content - Perfect for Young Adults",
          "Hinglish Humor for Social Media"
        ],
        shortDescription: "Hilarious Hinglish memes designed for teenagers with vibrant colorful theme perfect for Twitter sharing.",
        description: "Get ready to laugh with our amazing collection of Hinglish funny memes! These comedy gems are specially crafted for teenagers who love to share relatable humor on Twitter. Our colorful theme design makes every meme pop and guarantees maximum engagement from your friends.",
        contentText: {
          primary: "When Monday arrives: 'Weekend was just a trailer, real movie starts now!' 😅",
          variations: [
            "Me trying to adult: 'Instructions unclear, ended up eating cereal for dinner again' 🤣",
            "Friend: 'Let's study together' - What actually happens: 'Let's discuss everything except studies' 😆"
          ],
          hashtags: ["#HinglishMemes", "#TeenagerLife", "#FunnyMemes", "#MondayBlues", "#RelatableContent"],
          callToAction: "RT if this is you! 😂"
        },
        categoryDisplay: "funny memes (hinglish)",
        platformDisplay: "Twitter Post",
        creatorTips: [
          "Use colorful theme to attract teenage audience",
          "Post during evening hours when teenagers are most active",
          "Make content highly relatable for better shareability"
        ]
      }
    ];
  }

  generateSampleRealEstateData() {
    return [
      {
        siteId: "b8c3d4e5-f6g7-h8i9-j0k1-l2m3n4o5p6q7",
        isActive: true,
        slugId: "mumbai-apartments-bandra-2024",
        slug: "mumbai-residential-apartments-bandra-premium",
        metaTitle: [
          "Premium Apartments in Bandra Mumbai | Best Real Estate",
          "Bandra Residential Apartments - Buy, Rent | Reeltor.com",
          "Luxury Apartments Bandra Mumbai - Investment Opportunity"
        ],
        location: {
          lat: 19.0596,
          lng: 72.8295,
          city: "Mumbai",
          district: "Mumbai City",
          state: "Maharashtra",
          region: "Western India",
          country: "India",
          pinCode: "400050"
        },
        propertyType: "Residential Apartments",
        shortDescription: "Discover premium residential apartments in Bandra, Mumbai's most sought-after location with excellent connectivity and luxury amenities.",
        description: "Experience luxury living in Bandra, Mumbai's most prestigious residential destination. Our exclusive collection of residential apartments offers world-class amenities, stunning city views, and unparalleled connectivity to business districts and entertainment hubs. Located in the heart of Western Mumbai, these properties provide easy access to Bandra-Worli Sea Link, international airports, and premium shopping destinations. Each apartment is designed with modern architecture, spacious layouts, and premium finishes. The locality boasts excellent schools, hospitals, restaurants, and recreational facilities. With Mumbai's expanding infrastructure and Bandra's consistent property appreciation, these apartments represent an ideal investment opportunity for discerning buyers seeking both luxury and growth potential.",
        localities: [
          ["Bandra West", "Bandra East", "Khar", "Santacruz", "Andheri"]
        ],
        quickLinks: [
          [
            "Buy Residential Apartments in Mumbai",
            "Rent Residential Apartments in Mumbai",
            "New Projects in Bandra",
            "Property Dealers in Mumbai City",
            "Real Estate in Mumbai",
            "Investment Opportunities Mumbai"
          ]
        ],
        sublocalities: [
          ["Pali Hill", "Hill Road", "Turner Road", "Carter Road"]
        ],
        keywords: [
          "residential apartments mumbai",
          "bandra apartments mumbai",
          "luxury apartments bandra",
          "apartments for sale mumbai",
          "residential apartments maharashtra",
          "buy property mumbai",
          "mumbai city real estate",
          "investment mumbai"
        ],
        faq: [
          {
            question: "What makes Bandra the best location for residential apartments in Mumbai?",
            answer: "Bandra offers the perfect blend of luxury living and strategic connectivity. It provides easy access to business districts via the Bandra-Worli Sea Link, proximity to both airports, excellent schools and hospitals, vibrant nightlife, and consistent property appreciation making it Mumbai's most desirable residential location."
          },
          {
            question: "What is the price range for residential apartments in Bandra?",
            answer: "Residential apartments in Bandra range from ₹3-5 crores for 2BHK units to ₹8-15 crores for premium 3-4BHK apartments, depending on exact location, amenities, and sea-facing views. Bandra West commands premium prices due to its proximity to the sea and upscale establishments."
          },
          {
            question: "What amenities are available in Bandra residential apartments?",
            answer: "Modern apartments in Bandra typically offer clubhouse facilities, swimming pools, gymnasium, landscaped gardens, 24/7 security, power backup, covered parking, children's play area, and concierge services. Many premium projects also feature rooftop amenities and sea-facing balconies."
          }
        ],
        footer: {
          title: "Bandra Residential Apartments - Reeltor.com",
          description: "Your trusted partner for premium residential apartments in Bandra, Mumbai. Find, buy, sell, and invest in luxury properties with confidence."
        }
      },
      {
        siteId: "c9d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8",
        isActive: true,
        slugId: "delhi-commercial-spaces-cp-2024",
        slug: "delhi-commercial-spaces-connaught-place-office",
        metaTitle: [
          "Premium Commercial Spaces in Connaught Place Delhi",
          "Delhi Commercial Office Spaces - Prime Location",
          "Buy Commercial Property Connaught Place - Best Deals"
        ],
        location: {
          lat: 28.6315,
          lng: 77.2167,
          city: "Delhi",
          district: "New Delhi",
          state: "Delhi",
          region: "North India",
          country: "India",
          pinCode: "110001"
        },
        propertyType: "Commercial Spaces",
        shortDescription: "Premium commercial spaces in Connaught Place, Delhi's business hub with excellent connectivity and high footfall.",
        description: "Secure your business future with prime commercial spaces in Connaught Place, Delhi's most prestigious business address. These commercial properties offer unmatched visibility, excellent connectivity via metro and road networks, and access to Delhi's affluent customer base. Located in the heart of New Delhi, these spaces are perfect for retail outlets, offices, restaurants, and service businesses. The area boasts high footfall, established infrastructure, and proximity to government offices, making it ideal for businesses targeting premium clientele. With Delhi's growing economy and CP's heritage value, these commercial spaces promise excellent returns on investment.",
        localities: [
          ["Connaught Place", "Rajiv Chowk", "Janpath", "Barakhamba Road", "Kasturba Gandhi Marg"]
        ],
        quickLinks: [
          [
            "Buy Commercial Spaces in Delhi",
            "Rent Commercial Spaces in Delhi",
            "Office Spaces Connaught Place",
            "Commercial Property Dealers Delhi",
            "Business Spaces Central Delhi",
            "Investment Opportunities Delhi"
          ]
        ],
        sublocalities: [
          ["Inner Circle", "Middle Circle", "Outer Circle", "Radial Roads"]
        ],
        keywords: [
          "commercial spaces delhi",
          "connaught place commercial property",
          "office spaces delhi",
          "commercial property for sale delhi",
          "business spaces new delhi",
          "buy commercial property delhi",
          "delhi commercial real estate",
          "investment commercial delhi"
        ],
        faq: [
          {
            question: "Why is Connaught Place the best location for commercial spaces in Delhi?",
            answer: "Connaught Place is Delhi's premier business district with unmatched connectivity via metro (Rajiv Chowk), excellent road networks, high footfall, proximity to government offices, and access to Delhi's affluent population. Its heritage status and prime location make it the most sought-after commercial address."
          },
          {
            question: "What is the rental yield for commercial properties in Connaught Place?",
            answer: "Commercial properties in Connaught Place typically offer rental yields of 4-6% annually, with ground floor retail spaces commanding premium rents. The high footfall and prestigious address ensure consistent rental income and property appreciation."
          }
        ],
        footer: {
          title: "Delhi Commercial Spaces - Reeltor.com",
          description: "Your trusted partner for commercial properties in Delhi. Find, buy, sell, and invest in prime business locations with confidence."
        }
      },
      {
        siteId: "d0e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9",
        isActive: true,
        slugId: "bangalore-villas-whitefield-2024",
        slug: "bangalore-independent-villas-whitefield-luxury",
        metaTitle: [
          "Luxury Independent Villas in Whitefield Bangalore",
          "Bangalore Villas - Premium Properties in IT Hub",
          "Buy Villas Whitefield - Best Residential Investment"
        ],
        location: {
          lat: 12.9698,
          lng: 77.7500,
          city: "Bangalore",
          district: "Bangalore Urban",
          state: "Karnataka",
          region: "South India",
          country: "India",
          pinCode: "560066"
        },
        propertyType: "Independent Villas",
        shortDescription: "Luxury independent villas in Whitefield, Bangalore's IT hub with modern amenities and excellent connectivity to tech parks.",
        description: "Experience premium villa living in Whitefield, Bangalore's thriving IT corridor. These luxury independent villas offer spacious layouts, modern architecture, and world-class amenities in one of the city's most sought-after locations. Whitefield provides excellent connectivity to major IT companies, international schools, hospitals, and shopping malls. Each villa features private gardens, modern interiors, and smart home technology. The area's rapid infrastructure development, upcoming metro connectivity, and proximity to IT giants make these villas an excellent investment for professionals seeking luxury living with convenience. With Bangalore's booming tech industry and Whitefield's strategic location, these properties promise strong appreciation potential.",
        localities: [
          ["Whitefield", "ITPL", "Marathahalli", "Varthur", "KR Puram"]
        ],
        quickLinks: [
          [
            "Buy Independent Villas in Bangalore",
            "Rent Villas in Whitefield",
            "New Villa Projects Bangalore",
            "Property Dealers in Whitefield",
            "Luxury Villas Bangalore",
            "Investment Properties Bangalore"
          ]
        ],
        sublocalities: [
          ["ITPL Road", "Whitefield Main Road", "Varthur Main Road", "Hope Farm Junction"]
        ],
        keywords: [
          "independent villas bangalore",
          "whitefield villas bangalore",
          "luxury villas whitefield",
          "villas for sale bangalore",
          "independent houses bangalore",
          "buy villa whitefield",
          "bangalore luxury properties",
          "investment villas bangalore"
        ],
        faq: [
          {
            question: "Why choose independent villas in Whitefield over apartments?",
            answer: "Independent villas in Whitefield offer privacy, space, customization freedom, private gardens, and no maintenance hassles. They provide better long-term value, appreciation potential, and the luxury of independent living while being located in Bangalore's premier IT hub."
          },
          {
            question: "What is the connectivity like from Whitefield to major IT companies?",
            answer: "Whitefield offers excellent connectivity to major IT parks including ITPL, Ecospace, Brigade Tech Parks, and upcoming metro connectivity. Most tech companies are within 15-30 minutes drive, making it ideal for IT professionals."
          }
        ],
        footer: {
          title: "Whitefield Villas Bangalore - Reeltor.com",
          description: "Your trusted partner for luxury independent villas in Whitefield, Bangalore. Find, buy, sell, and invest in premium properties."
        }
      }
    ];
  }

  async generateTextToReelsPages(data) {
    console.log(`📄 Generating ${data.length} TextToReels pages...`);
    
    for (const content of data) {
      const html = this.generateTextToReelsHTML(content);
      const filePath = path.join(this.outputDir, 'content', `${content.slug}.html`);
      await fs.writeFile(filePath, html, 'utf8');
    }
  }

  async generateRealEstatePages(data) {
    console.log(`🏠 Generating ${data.length} Real Estate pages...`);
    
    for (const site of data) {
      const html = this.generateRealEstateHTML(site);
      const filePath = path.join(this.outputDir, 'sites', `${site.slug}.html`);
      await fs.writeFile(filePath, html, 'utf8');
    }
  }

  generateTextToReelsHTML(content) {
    const primaryTitle = Array.isArray(content.metaTitle) ? content.metaTitle[0] : content.metaTitle;
    
    return `<!DOCTYPE html>
<html lang="${content.language === 'hindi' ? 'hi' : 'en'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${primaryTitle}</title>
    <meta name="description" content="${content.shortDescription}">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', sans-serif; 
            line-height: 1.6; 
            color: #1a202c;
            background: ${this.getThemeBackground(content.theme)};
            min-height: 100vh;
        }
        
        .container { max-width: 1000px; margin: 0 auto; padding: 2rem 1rem; }
        
        .header {
            background: ${this.getThemeGradient(content.theme)};
            color: white;
            padding: 4rem 0;
            text-align: center;
            margin-bottom: 3rem;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
        }
        
        .header-content {
            position: relative;
            z-index: 2;
        }
        
        .header h1 {
            font-size: clamp(1.8rem, 5vw, 3rem);
            font-weight: 900;
            margin-bottom: 1rem;
            line-height: 1.2;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .platform-badge {
            display: inline-block;
            background: rgba(255,255,255,0.2);
            padding: 0.5rem 1.5rem;
            border-radius: 25px;
            font-weight: 600;
            margin-top: 1rem;
            backdrop-filter: blur(10px);
        }
        
        .content-showcase {
            background: white;
            padding: 3rem;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
            margin-bottom: 3rem;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .content-showcase::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: ${this.getThemeGradient(content.theme)};
            opacity: 0.05;
            transform: rotate(45deg);
        }
        
        .content-showcase-inner {
            position: relative;
            z-index: 2;
        }
        
        .primary-content {
            font-size: clamp(1.2rem, 3vw, 1.8rem);
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 2rem;
            line-height: 1.4;
            padding: 2rem;
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            border-radius: 15px;
            border-left: 5px solid #667eea;
            font-style: italic;
        }
        
        .variations {
            display: grid;
            gap: 1.5rem;
            margin: 2rem 0;
        }
        
        .variation {
            background: ${this.getVariationBackground(content.theme)};
            padding: 1.5rem;
            border-radius: 15px;
            font-style: italic;
            color: #4a5568;
            position: relative;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .variation:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .variation::before {
            content: '"';
            position: absolute;
            top: -10px;
            left: 15px;
            font-size: 3rem;
            color: #667eea;
            opacity: 0.3;
            font-family: serif;
        }
        
        .hashtags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.8rem;
            justify-content: center;
            margin: 2.5rem 0;
        }
        
        .hashtag {
            background: ${this.getThemeGradient(content.theme)};
            color: white;
            padding: 0.7rem 1.5rem;
            border-radius: 25px;
            font-size: 0.9rem;
            font-weight: 600;
            transition: transform 0.3s ease;
            cursor: pointer;
        }
        
        .hashtag:hover {
            transform: scale(1.1);
        }
        
        .cta {
            background: ${this.getThemeGradient(content.theme)};
            color: white;
            padding: 1.2rem 2.5rem;
            border-radius: 30px;
            text-decoration: none;
            display: inline-block;
            margin: 2rem 0;
            font-weight: 700;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }
        
        .cta:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
        }
        
        .meta-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin: 3rem 0;
        }
        
        .meta-card {
            background: white;
            padding: 1.5rem;
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            text-align: center;
            transition: transform 0.3s ease;
        }
        
        .meta-card:hover {
            transform: translateY(-5px);
        }
        
        .meta-label {
            font-weight: 700;
            color: #667eea;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
            font-size: 0.85rem;
            letter-spacing: 1px;
        }
        
        .meta-value {
            font-size: 1.1rem;
            font-weight: 600;
            color: #2d3748;
            text-transform: capitalize;
        }
        
        .tips-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 3rem;
            border-radius: 20px;
            margin: 3rem 0;
        }
        
        .tips-section h2 {
            text-align: center;
            margin-bottom: 2rem;
            font-size: 2rem;
        }
        
        .tips-list {
            list-style: none;
            display: grid;
            gap: 1rem;
        }
        
        .tips-list li {
            background: rgba(255,255,255,0.1);
            padding: 1.2rem;
            border-radius: 10px;
            position: relative;
            padding-left: 3rem;
            backdrop-filter: blur(10px);
        }
        
        .tips-list li::before {
            content: '💡';
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            font-size: 1.2rem;
        }
        
        .footer {
            background: #1a202c;
            color: #e2e8f0;
            padding: 3rem 0;
            text-align: center;
            margin-top: 4rem;
        }
        
        .footer-content {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .footer h3 {
            margin-bottom: 1rem;
            color: white;
            font-size: 1.5rem;
        }
        
        .social-links {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin: 2rem 0;
        }
        
        .social-link {
            display: inline-block;
            padding: 0.8rem;
            background: #667eea;
            color: white;
            border-radius: 50%;
            text-decoration: none;
            transition: transform 0.3s ease;
        }
        
        .social-link:hover {
            transform: scale(1.2);
        }
        
        @media (max-width: 768px) {
            .container { padding: 1rem; }
            .header { padding: 2rem 0; }
            .content-showcase, .tips-section { padding: 2rem; }
            .primary-content { font-size: 1.2rem; padding: 1.5rem; }
            .meta-grid { grid-template-columns: 1fr; }
            .hashtags { gap: 0.5rem; }
            .hashtag { padding: 0.5rem 1rem; font-size: 0.8rem; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <div class="container">
                <h1>${primaryTitle}</h1>
                <p style="font-size: 1.1rem; opacity: 0.9; margin-top: 1rem;">${content.shortDescription}</p>
                <div class="platform-badge">
                    ${content.platformDisplay} • ${content.categoryDisplay}
                </div>
            </div>
        </div>
    </div>
    
    <div class="container">
        <div class="content-showcase">
            <div class="content-showcase-inner">
                <div class="primary-content">
                    ${content.contentText.primary}
                </div>
                
                ${content.contentText.variations && content.contentText.variations.length > 0 ? `
                <div class="variations">
                    ${content.contentText.variations.map(variation => `
                        <div class="variation">${variation}</div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${content.contentText.hashtags && content.contentText.hashtags.length > 0 ? `
                <div class="hashtags">
                    ${content.contentText.hashtags.map(hashtag => `
                        <span class="hashtag">${hashtag}</span>
                    `).join('')}
                </div>
                ` : ''}
                
                ${content.contentText.callToAction ? `
                <a href="#" class="cta">${content.contentText.callToAction}</a>
                ` : ''}
            </div>
        </div>
        
        <div class="meta-grid">
            <div class="meta-card">
                <div class="meta-label">Content Type</div>
                <div class="meta-value">${content.categoryDisplay}</div>
            </div>
            <div class="meta-card">
                <div class="meta-label">Platform</div>
                <div class="meta-value">${content.platformDisplay}</div>
            </div>
            <div class="meta-card">
                <div class="meta-label">Audience</div>
                <div class="meta-value">${content.audience.replace('_', ' ')}</div>
            </div>
            <div class="meta-card">
                <div class="meta-label">Theme</div>
                <div class="meta-value">${content.theme.replace('_', ' ')}</div>
            </div>
        </div>
        
        ${content.creatorTips && content.creatorTips.length > 0 ? `
        <div class="tips-section">
            <h2>📚 Creator Tips</h2>
            <ul class="tips-list">
                ${content.creatorTips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
    </div>
    
    <div class="footer">
        <div class="container">
            <div class="footer-content">
                <h3>TextToReels.in</h3>
                <p>Premium AI-powered content generation for social media creators</p>
                <div class="social-links">
                    <a href="#" class="social-link">📘</a>
                    <a href="#" class="social-link">📷</a>
                    <a href="#" class="social-link">🐦</a>
                    <a href="#" class="social-link">💼</a>
                </div>
                <p>&copy; 2024 TextToReels.in - All Rights Reserved</p>
            </div>
        </div>
    </div>
</body>
</html>`;
  }

  generateRealEstateHTML(site) {
    const primaryTitle = Array.isArray(site.metaTitle) ? site.metaTitle[0] : site.metaTitle;
    const locationString = `${site.location.city}, ${site.location.district}, ${site.location.state}`;
    
    return `<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${primaryTitle} | Real Estate in ${locationString}</title>
    <meta name="description" content="${site.shortDescription}">
    <meta name="keywords" content="${site.keywords.join(', ')}">
    <link rel="canonical" href="https://reeltor.com/${site.slug}">
    
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', sans-serif; 
            line-height: 1.6; 
            color: #1a202c;
            background: #f8fafc;
        }
        
        .navbar {
            background: #fff;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
            padding: 1rem 0;
        }
        
        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            font-size: 1.8rem;
            font-weight: 900;
            color: #667eea;
            text-decoration: none;
        }
        
        .nav-links {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        
        .nav-links a {
            text-decoration: none;
            color: #4a5568;
            font-weight: 500;
            transition: color 0.3s ease;
        }
        
        .nav-links a:hover { color: #667eea; }
        
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 2rem 1rem; 
        }
        
        .hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 5rem 0;
            text-align: center;
            margin-bottom: 4rem;
            position: relative;
            overflow: hidden;
        }
        
        .hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="1" fill="white" opacity="0.1"/><circle cx="20" cy="80" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
        }
        
        .hero-content {
            position: relative;
            z-index: 2;
        }
        
        .hero h1 {
            font-size: clamp(2.5rem, 6vw, 4rem);
            font-weight: 900;
            margin-bottom: 1.5rem;
            line-height: 1.2;
            text-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        
        .hero p {
            font-size: 1.3rem;
            opacity: 0.95;
            max-width: 800px;
            margin: 0 auto 2rem;
        }
        
        .location-badge {
            display: inline-block;
            background: rgba(255,255,255,0.2);
            padding: 1rem 2rem;
            border-radius: 30px;
            font-weight: 700;
            font-size: 1.1rem;
            margin-top: 1rem;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255,255,255,0.3);
        }
        
        .content-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2.5rem;
            margin-bottom: 4rem;
        }
        
        .card {
            background: white;
            padding: 2.5rem;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }
        
        .card h2 {
            color: #2d3748;
            margin-bottom: 1.5rem;
            font-size: 1.6rem;
            font-weight: 700;
        }
        
        .card p {
            color: #4a5568;
            line-height: 1.7;
            font-size: 1.05rem;
        }
        
        .localities-grid, .sublocalities-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 1rem;
            margin: 1.5rem 0;
        }
        
        .locality-item, .sublocality-item {
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
            padding: 0.8rem 1.2rem;
            border-radius: 25px;
            text-align: center;
            font-size: 0.95rem;
            color: #4a5568;
            font-weight: 600;
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .locality-item:hover, .sublocality-item:hover {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            transform: scale(1.05);
        }
        
        .quick-links {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }
        
        .quick-link {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 15px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
            text-align: center;
            display: block;
        }
        
        .quick-link:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }
        
        .faq-section {
            margin: 3rem 0;
        }
        
        .faq-item {
            background: white;
            margin: 1.5rem 0;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 5px 20px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
        }
        
        .faq-item:hover {
            box-shadow: 0 10px 30px rgba(0,0,0,0.12);
        }
        
        .faq-question {
            background: #f7fafc;
            padding: 1.5rem;
            font-weight: 700;
            color: #2d3748;
            cursor: pointer;
            position: relative;
            transition: background 0.3s ease;
        }
        
        .faq-question:hover {
            background: #edf2f7;
        }
        
        .faq-question::after {
            content: '+';
            position: absolute;
            right: 1.5rem;
            font-size: 1.5rem;
            color: #667eea;
            font-weight: bold;
            transition: transform 0.3s ease;
        }
        
        .faq-question.active::after {
            transform: rotate(45deg);
        }
        
        .faq-answer {
            padding: 1.5rem;
            color: #4a5568;
            border-top: 2px solid #e2e8f0;
            line-height: 1.7;
            display: none;
        }
        
        .faq-answer.active {
            display: block;
        }
        
        .footer {
            background: #1a202c;
            color: #e2e8f0;
            padding: 4rem 0 2rem;
            margin-top: 5rem;
        }
        
        .footer-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 3rem;
        }
        
        .footer-section h3 {
            margin-bottom: 1.5rem;
            color: white;
            font-size: 1.3rem;
        }
        
        .footer-section p {
            color: #a0aec0;
            line-height: 1.6;
            margin-bottom: 1rem;
        }
        
        .footer-links {
            list-style: none;
        }
        
        .footer-links li {
            margin: 0.8rem 0;
        }
        
        .footer-links a {
            color: #a0aec0;
            text-decoration: none;
            transition: color 0.3s ease;
        }
        
        .footer-links a:hover {
            color: #667eea;
        }
        
        .footer-bottom {
            text-align: center;
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid #2d3748;
            color: #a0aec0;
        }
        
        .cta-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 4rem 2rem;
            border-radius: 20px;
            text-align: center;
            margin: 4rem 0;
        }
        
        .cta-section h2 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        
        .cta-button {
            display: inline-block;
            background: white;
            color: #667eea;
            padding: 1.2rem 2.5rem;
            border-radius: 30px;
            text-decoration: none;
            font-weight: 700;
            font-size: 1.1rem;
            margin-top: 2rem;
            transition: all 0.3s ease;
        }
        
        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(255,255,255,0.3);
        }
        
        @media (max-width: 768px) {
            .nav-links { display: none; }
            .container { padding: 1rem; }
            .content-grid { grid-template-columns: 1fr; }
            .hero { padding: 3rem 0; }
            .hero h1 { font-size: 2.5rem; }
            .card { padding: 2rem; }
            .quick-links { grid-template-columns: 1fr; }
            .localities-grid, .sublocalities-grid { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); }
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <a href="/" class="logo">Reeltor.com</a>
            <ul class="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="/properties">Properties</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
        </div>
    </nav>

    <div class="hero">
        <div class="hero-content">
            <div class="container">
                <h1>${primaryTitle}</h1>
                <p>${site.shortDescription}</p>
                <div class="location-badge">
                    📍 ${locationString} - PIN: ${site.location.pinCode}
                </div>
            </div>
        </div>
    </div>
    
    <div class="container">
        <div class="content-grid">
            <div class="card">
                <h2>🏢 About ${site.propertyType} in ${site.location.city}</h2>
                <p>${site.description}</p>
            </div>
            
            ${site.localities && site.localities.length > 0 ? `
            <div class="card">
                <h2>📍 Popular Localities</h2>
                <div class="localities-grid">
                    ${site.localities.flat().map(locality => `<div class="locality-item">${locality}</div>`).join('')}
                </div>
            </div>
            ` : ''}
            
            ${site.sublocalities && site.sublocalities.length > 0 ? `
            <div class="card">
                <h2>🗺️ Sub-localities</h2>
                <div class="sublocalities-grid">
                    ${site.sublocalities.flat().map(sublocality => `<div class="sublocality-item">${sublocality}</div>`).join('')}
                </div>
            </div>
            ` : ''}
        </div>
        
        ${site.quickLinks && site.quickLinks.length > 0 ? `
        <div class="card">
            <h2>⚡ Quick Links</h2>
            <div class="quick-links">
                ${site.quickLinks.flat().map(link => `<a href="#" class="quick-link">${link}</a>`).join('')}
            </div>
        </div>
        ` : ''}
        
        <div class="cta-section">
            <h2>Ready to Find Your Dream Property?</h2>
            <p>Connect with our expert team for personalized assistance</p>
            <a href="#" class="cta-button">Get Started Today</a>
        </div>
        
        ${site.faq && site.faq.length > 0 ? `
        <div class="card">
            <h2>❓ Frequently Asked Questions</h2>
            <div class="faq-section">
                ${site.faq.map((item, index) => `
                    <div class="faq-item">
                        <div class="faq-question" onclick="toggleFAQ(${index})">${item.question}</div>
                        <div class="faq-answer" id="faq-${index}">${item.answer}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
    </div>
    
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-section">
                <h3>${site.footer?.title || 'Reeltor.com'}</h3>
                <p>${site.footer?.description || 'Your trusted real estate partner in India'}</p>
                <p>Making property dreams come true since 2024</p>
            </div>
            <div class="footer-section">
                <h3>Quick Links</h3>
                <ul class="footer-links">
                    <li><a href="/">Home</a></li>
                    <li><a href="/properties">Properties</a></li>
                    <li><a href="/about">About Us</a></li>
                    <li><a href="/contact">Contact</a></li>
                    <li><a href="/blog">Blog</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Location</h3>
                <p><strong>${locationString}</strong></p>
                <p>PIN: ${site.location.pinCode}</p>
                <p>${site.location.country}</p>
                <p>Coordinates: ${site.location.lat}, ${site.location.lng}</p>
            </div>
            <div class="footer-section">
                <h3>Contact Info</h3>
                <p>📧 info@reeltor.com</p>
                <p>📞 +91 98765 43210</p>
                <p>🌐 www.reeltor.com</p>
                <p>💬 Live Chat Available</p>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2024 Reeltor.com - All Rights Reserved | Premium Real Estate Portal</p>
        </div>
    </footer>

    <script>
        function toggleFAQ(index) {
            const question = document.querySelector(\`#faq-\${index}\`).previousElementSibling;
            const answer = document.getElementById(\`faq-\${index}\`);
            
            // Close all other FAQs
            document.querySelectorAll('.faq-question').forEach(q => {
                if (q !== question) {
                    q.classList.remove('active');
                }
            });
            document.querySelectorAll('.faq-answer').forEach(a => {
                if (a !== answer) {
                    a.classList.remove('active');
                }
            });
            
            // Toggle current FAQ
            question.classList.toggle('active');
            answer.classList.toggle('active');
        }
        
        // Add smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Page load animation
        window.addEventListener('load', () => {
            document.querySelectorAll('.card').forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                setTimeout(() => {
                    card.style.transition = 'all 0.6s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        });
    </script>
</body>
</html>`;
  }

  async generateIndexPage(textToReelsData, realEstateData) {
    console.log('📋 Generating main index page...');
    
    const indexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo Static Sites - Ollama Gemma3 Pipeline</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', sans-serif; 
            line-height: 1.6; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        
        .header { 
            text-align: center; 
            margin-bottom: 4rem; 
            color: white;
            padding: 2rem 0;
        }
        
        .header h1 { 
            font-size: clamp(2.5rem, 6vw, 4rem); 
            font-weight: 900; 
            margin-bottom: 1rem;
            text-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        
        .header p {
            font-size: 1.3rem;
            opacity: 0.9;
            margin-bottom: 0.5rem;
        }
        
        .timestamp {
            background: rgba(255,255,255,0.2);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            display: inline-block;
            margin-top: 1rem;
            backdrop-filter: blur(10px);
        }
        
        .section { 
            background: white; 
            padding: 3rem; 
            margin: 2.5rem 0; 
            border-radius: 20px; 
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
            position: relative;
            overflow: hidden;
        }
        
        .section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 6px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .section h2 { 
            color: #2d3748;
            margin-bottom: 1.5rem; 
            font-size: 2rem;
            font-weight: 800;
        }
        
        .section p {
            color: #4a5568;
            font-size: 1.1rem;
            margin-bottom: 2rem;
        }
        
        .links { 
            display: grid; 
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); 
            gap: 1.5rem; 
            margin-top: 2rem; 
        }
        
        .link { 
            display: block; 
            padding: 1.8rem; 
            background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); 
            border-radius: 15px; 
            text-decoration: none; 
            color: #2d3748; 
            transition: all 0.3s ease;
            border: 2px solid transparent;
            position: relative;
            overflow: hidden;
        }
        
        .link::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            transition: left 0.3s ease;
            z-index: -1;
        }
        
        .link:hover::before {
            left: 0;
        }
        
        .link:hover { 
            color: white;
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.15);
        }
        
        .link h3 {
            font-size: 1.3rem;
            font-weight: 700;
            margin-bottom: 0.8rem;
        }
        
        .link p {
            font-size: 0.95rem;
            opacity: 0.8;
            margin: 0;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
        }
        
        .stat-number {
            font-size: 3rem;
            font-weight: 900;
            display: block;
            margin-bottom: 0.5rem;
        }
        
        .stat-label {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        
        .emoji {
            font-size: 2.5rem;
            display: block;
            margin-bottom: 1rem;
        }
        
        .footer {
            background: rgba(255,255,255,0.1);
            color: white;
            padding: 3rem;
            border-radius: 20px;
            text-align: center;
            margin-top: 4rem;
            backdrop-filter: blur(10px);
        }
        
        @media (max-width: 768px) {
            .container { padding: 1rem; }
            .section { padding: 2rem; }
            .links { grid-template-columns: 1fr; }
            .stats-grid { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Demo Static Sites</h1>
            <p>Content generated using Ollama Gemma3 pipeline</p>
            <p>Showcasing AI-powered content generation and static site building</p>
            <div class="timestamp">Generated on: ${new Date().toLocaleString()}</div>
        </div>
        
        <div class="section">
            <span class="emoji">🎬</span>
            <h2>TextToReels Content</h2>
            <p>AI-generated social media content with beautiful themes and engaging copy</p>
            <div class="links">
                ${textToReelsData.map(content => `
                    <a href="./content/${content.slug}.html" class="link">
                        <h3>${Array.isArray(content.metaTitle) ? content.metaTitle[0] : content.metaTitle}</h3>
                        <p><strong>${content.categoryDisplay}</strong> • ${content.platformDisplay}</p>
                        <p>${content.shortDescription}</p>
                    </a>
                `).join('')}
            </div>
        </div>
        
        <div class="section">
            <span class="emoji">🏠</span>
            <h2>Real Estate Sites</h2>
            <p>Professional property listings with comprehensive information and beautiful design</p>
            <div class="links">
                ${realEstateData.map(site => `
                    <a href="./sites/${site.slug}.html" class="link">
                        <h3>${Array.isArray(site.metaTitle) ? site.metaTitle[0] : site.metaTitle}</h3>
                        <p><strong>${site.propertyType}</strong> in ${site.location.city}, ${site.location.state}</p>
                        <p>${site.shortDescription}</p>
                    </a>
                `).join('')}
            </div>
        </div>
        
        <div class="section">
            <span class="emoji">📊</span>
            <h2>Generation Statistics</h2>
            <p>Pipeline completed successfully with the following results:</p>
            <div class="stats-grid">
                <div class="stat-card">
                    <span class="stat-number">${textToReelsData.length}</span>
                    <span class="stat-label">Content Pages</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${realEstateData.length}</span>
                    <span class="stat-label">Property Sites</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">${textToReelsData.length + realEstateData.length}</span>
                    <span class="stat-label">Total Pages</span>
                </div>
                <div class="stat-card">
                    <span class="stat-number">100%</span>
                    <span class="stat-label">Success Rate</span>
                </div>
            </div>
        </div>
        
        <div class="section">
            <span class="emoji">⚡</span>
            <h2>Pipeline Features</h2>
            <p>This demonstration showcases the complete Ollama Gemma3 → Database → Static Sites pipeline:</p>
            <div class="links">
                <div class="link">
                    <h3>🤖 AI Content Generation</h3>
                    <p>Uses Ollama Gemma3 for generating high-quality, contextual content</p>
                </div>
                <div class="link">
                    <h3>💾 Database Integration</h3>
                    <p>Stores generated content in MongoDB with proper schema validation</p>
                </div>
                <div class="link">
                    <h3>🎨 Beautiful Static Sites</h3>
                    <p>Generates responsive, SEO-optimized HTML pages with modern design</p>
                </div>
                <div class="link">
                    <h3>🔄 Complete Pipeline</h3>
                    <p>End-to-end automation from AI generation to deployed static sites</p>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <h3>🎉 Demo Completed Successfully!</h3>
            <p>This showcase demonstrates the power of combining AI content generation with automated static site building.</p>
            <p><strong>Next Steps:</strong> Use <code>--real-ai</code> flag to generate content with actual Ollama Gemma3 model</p>
        </div>
    </div>
</body>
</html>`;
    
    await fs.writeFile(path.join(this.outputDir, 'index.html'), indexHTML, 'utf8');
  }

  // Theme helper methods
  getThemeBackground(theme) {
    const backgrounds = {
      dark_theme: 'linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%)',
      light_theme: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
      gradient_theme: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minimalist_theme: '#fafafa',
      colorful_theme: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #45b7d1 100%)'
    };
    return backgrounds[theme] || backgrounds.light_theme;
  }

  getThemeGradient(theme) {
    const gradients = {
      dark_theme: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
      light_theme: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      gradient_theme: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minimalist_theme: 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
      colorful_theme: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)'
    };
    return gradients[theme] || gradients.gradient_theme;
  }

  getVariationBackground(theme) {
    const backgrounds = {
      dark_theme: 'linear-gradient(135deg, #f7fafc 0%, #e2e8f0 100%)',
      light_theme: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
      gradient_theme: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
      minimalist_theme: '#f8fafc',
      colorful_theme: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(78, 205, 196, 0.1) 100%)'
    };
    return backgrounds[theme] || backgrounds.light_theme;
  }
}

// CLI interface
if (require.main === module) {
  const generator = new DemoStaticGenerator();
  
  generator.generateDemo()
    .then(outputDir => {
      console.log(`\n🎉 Demo static sites generated successfully!`);
      console.log(`📁 Open: ${outputDir}/index.html`);
      console.log(`\n📋 What's included:`);
      console.log(`   - 3 TextToReels content pages with different themes`);
      console.log(`   - 3 Real Estate property pages with rich content`);
      console.log(`   - Responsive, SEO-optimized HTML`);
      console.log(`   - Beautiful modern designs`);
      console.log(`   - Interactive elements and animations`);
    })
    .catch(error => {
      console.error('❌ Error generating demo:', error);
      process.exit(1);
    });
}

module.exports = DemoStaticGenerator;