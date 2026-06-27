// ==========================================================================
// OVATION - Events Data & Helpers
// ==========================================================================

const CATEGORIES = [
  "Music",
  "Conference",
  "Comedy",
  "Arts",
  "Food",
  "Sports",
  "Theater",
  "Nightlife",
];

const POPULAR_CITIES = [
  "Ahmedabad",
  "Bengaluru",
  "Chennai",
  "Delhi NCR",
  "Hyderabad",
  "Kolkata",
  "Mumbai",
  "Pune",
];

const SELECTED_CITY_STORAGE_KEY = "ovation_selected_city";

const CATEGORY_IMAGES = {
  Music: "images/event-festival.png",
  Conference: "images/event-conference.png",
  Comedy: "images/event-comedy.png",
  Arts: "images/event-art.png",
  Food: "images/event-food.png",
  Sports: "images/event-basketball.png",
  Theater: "images/event-theater.png",
  Nightlife: "images/event-club.png",
};

const EVENTS = [
  {
    slug: "garba-nights-ahmedabad",
    title: "Garba Nights Ahmedabad",
    city: "Ahmedabad",
    venue: "GMDC Ground",
    category: "Music",
    date: "2026-07-18T19:00:00",
    doors: "6:30 PM",
    image: "images/event-festival.png",
    summary: "A high-energy folk music and dance night in the heart of Ahmedabad.",
    description: [
      "Garba Nights Ahmedabad brings live folk musicians, DJs, food counters, and a festive open-air dance floor to GMDC Ground.",
      "Dress comfortably, arrive early for smoother entry, and enjoy a full evening of music and celebration.",
    ],
    lineup: ["Aarohi Folk Collective", "DJ Riva", "Dhol Junction"],
    featured: true,
    tiers: [
      { id: "ga", name: "General Admission", description: "Open ground access", price: 799, available: 700 },
      { id: "premium", name: "Premium Circle", description: "Closer dance circle and fast entry", price: 1499, available: 220 },
      { id: "vip", name: "VIP Lounge", description: "Lounge access with refreshments", price: 3499, available: 60 },
    ],
  },
  {
    slug: "comic-con-ahmedabad",
    title: "Comic Con Ahmedabad",
    city: "Ahmedabad",
    venue: "Karnavati Club Convention Centre",
    category: "Arts",
    date: "2026-08-09T11:00:00",
    doors: "10:30 AM",
    image: "images/event-art.png",
    summary: "Cosplay, comics, creators, collectibles, and fan panels.",
    description: [
      "Comic Con Ahmedabad gathers artists, publishers, cosplayers, gamers, and fans for a day of panels and pop-culture shopping.",
      "Your ticket includes access to the show floor, creator sessions, and cosplay showcase areas.",
    ],
    lineup: ["Cosplay Showcase", "Indie Comics Alley", "Gaming Zone"],
    tiers: [
      { id: "day", name: "Day Pass", description: "Full-day event access", price: 999, available: 500 },
      { id: "superfan", name: "Superfan", description: "Priority entry and merch voucher", price: 1999, available: 160 },
    ],
  },
  {
    slug: "ahmedabad-food-festival",
    title: "Ahmedabad Food Festival",
    city: "Ahmedabad",
    venue: "Sabarmati Riverfront",
    category: "Food",
    date: "2026-09-20T16:00:00",
    doors: "4:00 PM",
    image: "images/event-food.png",
    summary: "Street food, regional kitchens, dessert counters, and riverfront music.",
    description: [
      "Taste Gujarati classics, modern Indian pop-ups, sweets, snacks, and seasonal drinks along the Sabarmati Riverfront.",
      "Tickets include entry and food tokens redeemable at participating stalls.",
    ],
    tiers: [
      { id: "taster", name: "Taster", description: "Entry and 6 food tokens", price: 599, available: 400 },
      { id: "feast", name: "Feast Pass", description: "Entry and 14 food tokens", price: 1299, available: 180 },
      { id: "table", name: "Reserved Table", description: "Reserved table for four", price: 3999, available: 30 },
    ],
  },
  {
    slug: "sunburn-bengaluru",
    title: "Sunburn Bengaluru",
    city: "Bengaluru",
    venue: "Jayamahal Palace Grounds",
    category: "Music",
    date: "2026-08-08T18:00:00",
    doors: "5:00 PM",
    image: "images/event-festival.png",
    summary: "A massive electronic music night with two stages and immersive lights.",
    description: [
      "Sunburn Bengaluru brings a festival-grade sound system, Indian and international DJs, food zones, and all-night energy.",
      "Your pass includes entry to both stages and access to the curated market area.",
    ],
    lineup: ["Kohra", "Nucleya", "Anish Sood", "Ritviz"],
    featured: true,
    tiers: [
      { id: "ga", name: "General Admission", description: "Main festival access", price: 2499, available: 500 },
      { id: "fanpit", name: "Fan Pit", description: "Front-stage access", price: 4999, available: 150 },
      { id: "vip", name: "VIP", description: "Fast entry and raised viewing deck", price: 8999, available: 70 },
    ],
  },
  {
    slug: "comic-con-bengaluru",
    title: "Comic Con Bengaluru",
    city: "Bengaluru",
    venue: "KTPO Convention Centre",
    category: "Arts",
    date: "2026-09-13T10:30:00",
    doors: "10:00 AM",
    image: "images/event-art.png",
    summary: "A packed fan convention for comics, cosplay, gaming, and anime.",
    description: [
      "Meet creators, browse collectibles, watch cosplay performances, and join pop-culture panels across the day.",
      "Superfan passes include early entry and a limited-edition event kit.",
    ],
    lineup: ["Creator Stage", "Cosplay Championship", "Indie Game Arena"],
    tiers: [
      { id: "day", name: "Day Pass", description: "Full-day event access", price: 1199, available: 700 },
      { id: "superfan", name: "Superfan", description: "Early entry and merch kit", price: 2499, available: 220 },
    ],
  },
  {
    slug: "bengaluru-tech-summit",
    title: "Bengaluru Tech Summit",
    city: "Bengaluru",
    venue: "BIEC",
    category: "Conference",
    date: "2026-10-16T09:00:00",
    doors: "8:00 AM",
    image: "images/event-conference.png",
    summary: "AI, SaaS, product, cloud, and startup sessions for builders.",
    description: [
      "Bengaluru Tech Summit gathers founders, engineers, product teams, and investors for a full day of talks and workshops.",
      "Passes include keynote access, networking lounges, and the evening founder mixer.",
    ],
    lineup: ["AI-Native Product Teams", "Scaling SaaS from India", "Cloud Cost at Scale"],
    featured: true,
    tiers: [
      { id: "standard", name: "Standard", description: "All talks and networking", price: 7999, available: 250 },
      { id: "pro", name: "Pro", description: "Workshop track and reserved seating", price: 12999, available: 100 },
      { id: "exec", name: "Executive", description: "Speaker dinner and lounge access", price: 24999, available: 30 },
    ],
  },
  {
    slug: "chennai-music-season-live",
    title: "Chennai Music Season Live",
    city: "Chennai",
    venue: "Music Academy",
    category: "Music",
    date: "2026-07-26T18:30:00",
    doors: "6:00 PM",
    image: "images/event-festival.png",
    summary: "A seated evening of classical, fusion, and contemporary performances.",
    description: [
      "Chennai Music Season Live presents celebrated vocalists, instrumentalists, and new fusion collaborations.",
      "Seats are reserved by tier, and doors open thirty minutes before the first performance.",
    ],
    lineup: ["Raga Collective", "Madras Strings", "Ananya Ashok"],
    tiers: [
      { id: "balcony", name: "Balcony", description: "Reserved balcony seating", price: 799, available: 180 },
      { id: "premium", name: "Premium", description: "Center auditorium seating", price: 1799, available: 120 },
      { id: "gold", name: "Gold", description: "Front rows with priority entry", price: 2999, available: 50 },
    ],
  },
  {
    slug: "comic-con-chennai",
    title: "Comic Con Chennai",
    city: "Chennai",
    venue: "Chennai Trade Centre",
    category: "Arts",
    date: "2026-08-30T10:30:00",
    doors: "10:00 AM",
    image: "images/event-art.png",
    summary: "Comics, anime, gaming, cosplay, and creator sessions.",
    description: [
      "Comic Con Chennai brings fans together for creator meetups, cosplay showcases, collectibles, and gaming tournaments.",
      "The event floor is open all day with panels running across multiple stages.",
    ],
    lineup: ["Anime Stage", "Cosplay Showcase", "Creator Alley"],
    tiers: [
      { id: "day", name: "Day Pass", description: "Full-day event access", price: 999, available: 600 },
      { id: "superfan", name: "Superfan", description: "Early entry and merch voucher", price: 2199, available: 160 },
    ],
  },
  {
    slug: "chennai-food-trail",
    title: "Chennai Food Trail",
    city: "Chennai",
    venue: "Besant Nagar Beach",
    category: "Food",
    date: "2026-09-27T17:00:00",
    doors: "4:45 PM",
    image: "images/event-food.png",
    summary: "A coastal tasting walk with local kitchens, snacks, and desserts.",
    description: [
      "Taste regional favorites, filter coffee, beach snacks, sweets, and modern pop-ups with a local food host.",
      "Small group slots keep the route easy to follow and comfortable.",
    ],
    tiers: [
      { id: "walk", name: "Food Walk", description: "Guided route and tastings", price: 999, available: 80 },
      { id: "premium", name: "Premium Walk", description: "Extra tastings and dessert stop", price: 1799, available: 40 },
    ],
  },
  {
    slug: "sunburn-delhi-ncr",
    title: "Sunburn Delhi NCR",
    city: "Delhi NCR",
    venue: "Jawaharlal Nehru Stadium",
    category: "Music",
    date: "2026-08-22T18:00:00",
    doors: "5:00 PM",
    image: "images/event-festival.png",
    summary: "A stadium-scale electronic music festival for Delhi NCR.",
    description: [
      "Sunburn Delhi NCR brings big-room sound, visual artists, food zones, and late-evening headline sets.",
      "The layout includes main-stage access, VIP decks, and quick-service bars.",
    ],
    lineup: ["Lost Stories", "Zaeden", "Teri Miko", "Progressive Brothers"],
    featured: true,
    tiers: [
      { id: "ga", name: "General Admission", description: "Main festival access", price: 2499, available: 650 },
      { id: "fanpit", name: "Fan Pit", description: "Front-stage access", price: 4999, available: 180 },
      { id: "vip", name: "VIP", description: "Fast entry and lounge deck", price: 8999, available: 80 },
    ],
  },
  {
    slug: "comic-con-delhi-ncr",
    title: "Comic Con Delhi NCR",
    city: "Delhi NCR",
    venue: "NSIC Exhibition Ground",
    category: "Arts",
    date: "2026-10-04T10:30:00",
    doors: "10:00 AM",
    image: "images/event-art.png",
    summary: "North India's biggest fan weekend for comics, cosplay, and gaming.",
    description: [
      "Explore creator booths, merch stores, cosplay contests, panel sessions, and gaming zones across the exhibition ground.",
      "Superfan passes include early access and a limited-edition kit.",
    ],
    lineup: ["Cosplay Championship", "Creator Stage", "Gaming Arena"],
    tiers: [
      { id: "day", name: "Day Pass", description: "Full-day event access", price: 1299, available: 900 },
      { id: "superfan", name: "Superfan", description: "Early entry and merch kit", price: 2799, available: 300 },
    ],
  },
  {
    slug: "delhi-food-festival",
    title: "Delhi Food Festival",
    city: "Delhi NCR",
    venue: "Major Dhyan Chand National Stadium",
    category: "Food",
    date: "2026-11-08T16:00:00",
    doors: "4:00 PM",
    image: "images/event-food.png",
    summary: "A city-wide tasting fair with street food, chefs, and dessert counters.",
    description: [
      "The Delhi Food Festival features old-city favorites, modern Indian kitchens, regional stalls, and live cooking demos.",
      "Tickets include entry and food tokens redeemable at partner stalls.",
    ],
    tiers: [
      { id: "taster", name: "Taster", description: "Entry and 8 food tokens", price: 999, available: 500 },
      { id: "gourmet", name: "Gourmet", description: "Entry, 16 tokens, and demo access", price: 1999, available: 220 },
      { id: "table", name: "Chef's Table", description: "Reserved tasting table", price: 5999, available: 30 },
    ],
  },
  {
    slug: "hyderabad-biryani-festival",
    title: "Hyderabad Biryani Festival",
    city: "Hyderabad",
    venue: "People's Plaza",
    category: "Food",
    date: "2026-07-19T13:00:00",
    doors: "12:30 PM",
    image: "images/event-food.png",
    summary: "A lunch-to-evening biryani showcase with iconic city kitchens.",
    description: [
      "Taste dum biryani, haleem-style snacks, Irani chai, kebabs, and desserts from Hyderabad favorites.",
      "The festival includes seating zones, live music, and tasting counters throughout the day.",
    ],
    featured: true,
    tiers: [
      { id: "entry", name: "Entry", description: "Festival access", price: 499, available: 700 },
      { id: "taster", name: "Taster", description: "Entry and 8 food tokens", price: 1299, available: 350 },
      { id: "feast", name: "Feast Pass", description: "Entry and 18 food tokens", price: 2499, available: 120 },
    ],
  },
  {
    slug: "comic-con-hyderabad",
    title: "Comic Con Hyderabad",
    city: "Hyderabad",
    venue: "Hitex Exhibition Centre",
    category: "Arts",
    date: "2026-08-16T10:30:00",
    doors: "10:00 AM",
    image: "images/event-art.png",
    summary: "A fan convention with anime, comics, cosplay, and gaming.",
    description: [
      "Meet artists, shop collectibles, watch cosplay showcases, and join interactive sessions across the day.",
      "Superfan tickets include early entry and an event merchandise kit.",
    ],
    lineup: ["Cosplay Showcase", "Creator Alley", "Tabletop Arena"],
    tiers: [
      { id: "day", name: "Day Pass", description: "Full-day event access", price: 999, available: 650 },
      { id: "superfan", name: "Superfan", description: "Early entry and merch kit", price: 2199, available: 180 },
    ],
  },
  {
    slug: "hyderabad-tech-expo",
    title: "Hyderabad Tech Expo",
    city: "Hyderabad",
    venue: "HICC",
    category: "Conference",
    date: "2026-10-10T09:30:00",
    doors: "8:45 AM",
    image: "images/event-conference.png",
    summary: "Cloud, cybersecurity, AI, and startup demos for technology teams.",
    description: [
      "Hyderabad Tech Expo brings engineering leaders, founders, IT teams, and product companies into a single showcase.",
      "Tickets include all keynote sessions, expo access, lunch, and evening networking.",
    ],
    lineup: ["Cloud Platforms", "AI Operations", "Secure by Design"],
    tiers: [
      { id: "delegate", name: "Delegate", description: "Talks, expo, and lunch", price: 5999, available: 280 },
      { id: "pro", name: "Pro", description: "Workshop access and reserved seating", price: 9999, available: 100 },
      { id: "exec", name: "Executive", description: "Roundtables and lounge access", price: 19999, available: 25 },
    ],
  },
  {
    slug: "kolkata-theatre-festival",
    title: "Kolkata Theatre Festival",
    city: "Kolkata",
    venue: "Academy of Fine Arts",
    category: "Theater",
    date: "2026-09-05T19:30:00",
    doors: "7:00 PM",
    image: "images/event-theater.png",
    summary: "A contemporary Bengali theatre evening with live music.",
    description: [
      "A celebrated ensemble stages a modern Bengali production with new design, live musicians, and a post-show conversation.",
      "Performances are seated and begin promptly at showtime.",
    ],
    tiers: [
      { id: "balcony", name: "Balcony", description: "Upper-level seating", price: 699, available: 180 },
      { id: "orchestra", name: "Orchestra", description: "Main floor seating", price: 1499, available: 130 },
      { id: "patron", name: "Patron", description: "Front rows and program booklet", price: 2999, available: 36 },
    ],
  },
  {
    slug: "comic-con-kolkata",
    title: "Comic Con Kolkata",
    city: "Kolkata",
    venue: "Biswa Bangla Mela Prangan",
    category: "Arts",
    date: "2026-10-18T10:30:00",
    doors: "10:00 AM",
    image: "images/event-art.png",
    summary: "Comics, cosplay, anime, gaming, and creator booths.",
    description: [
      "Comic Con Kolkata celebrates fandom through creator sessions, cosplay showcases, merchandise stalls, and gaming zones.",
      "The event is suitable for fans, families, collectors, and first-time visitors.",
    ],
    lineup: ["Creator Stage", "Cosplay Runway", "Gaming Zone"],
    tiers: [
      { id: "day", name: "Day Pass", description: "Full-day event access", price: 999, available: 620 },
      { id: "superfan", name: "Superfan", description: "Priority entry and merch voucher", price: 2199, available: 170 },
    ],
  },
  {
    slug: "kolkata-food-carnival",
    title: "Kolkata Food Carnival",
    city: "Kolkata",
    venue: "Eco Park",
    category: "Food",
    date: "2026-11-22T16:00:00",
    doors: "4:00 PM",
    image: "images/event-food.png",
    summary: "Street food, sweets, bakeries, and live music at Eco Park.",
    description: [
      "Taste kathi rolls, puchka, sweets, bakery classics, regional dishes, and modern pop-ups in one open-air carnival.",
      "Tickets include entry and redeemable tasting tokens.",
    ],
    tiers: [
      { id: "taster", name: "Taster", description: "Entry and 8 tasting tokens", price: 799, available: 420 },
      { id: "feast", name: "Feast Pass", description: "Entry and 16 tasting tokens", price: 1499, available: 200 },
      { id: "family", name: "Family Table", description: "Reserved table for four", price: 3999, available: 35 },
    ],
  },
  {
    slug: "sunburn-mumbai",
    title: "Sunburn Mumbai",
    city: "Mumbai",
    venue: "Jio World Garden",
    category: "Music",
    date: "2026-07-25T19:00:00",
    doors: "6:00 PM",
    image: "images/event-festival.png",
    summary: "A headline electronic music festival in Bandra Kurla Complex.",
    description: [
      "Sunburn Mumbai combines big-stage electronic music, immersive lighting, food counters, and high-energy festival zones.",
      "Passes include access to the main stage and all public festival areas.",
    ],
    lineup: ["Nikhil Chinapa", "Lost Stories", "Ritviz", "Teri Miko"],
    featured: true,
    tiers: [
      { id: "ga", name: "General Admission", description: "Main festival access", price: 2499, available: 600 },
      { id: "fanpit", name: "Fan Pit", description: "Front-stage access", price: 4999, available: 180 },
      { id: "lounge", name: "Lounge", description: "Elevated deck and private bar", price: 9999, available: 60 },
    ],
  },
  {
    slug: "comic-con-mumbai",
    title: "Comic Con Mumbai",
    city: "Mumbai",
    venue: "NESCO Convention Centre",
    category: "Arts",
    date: "2026-09-06T10:30:00",
    doors: "10:00 AM",
    image: "images/event-art.png",
    summary: "A fan weekend for comics, cosplay, gaming, anime, and collectibles.",
    description: [
      "Comic Con Mumbai brings creator panels, cosplay competitions, gaming zones, and limited-edition merchandise.",
      "Superfan passes include early entry and an exclusive merch kit.",
    ],
    lineup: ["Cosplay Championship", "Creator Alley", "Gaming Arena"],
    tiers: [
      { id: "day", name: "Day Pass", description: "Full-day event access", price: 1299, available: 850 },
      { id: "superfan", name: "Superfan", description: "Early entry and merch kit", price: 2799, available: 260 },
    ],
  },
  {
    slug: "mumbai-food-festival",
    title: "Mumbai Food Festival",
    city: "Mumbai",
    venue: "Mahalaxmi Racecourse",
    category: "Food",
    date: "2026-10-03T16:00:00",
    doors: "4:00 PM",
    image: "images/event-food.png",
    summary: "Food trucks, chef counters, desserts, drinks, and live sets.",
    description: [
      "Mumbai Food Festival gathers street food legends, new restaurants, dessert kitchens, and regional pop-ups at Mahalaxmi.",
      "Tickets include entry and redeemable food tokens.",
    ],
    tiers: [
      { id: "taster", name: "Taster", description: "Entry and 8 food tokens", price: 999, available: 500 },
      { id: "gourmet", name: "Gourmet", description: "Entry, 16 tokens, and demo access", price: 1999, available: 220 },
      { id: "table", name: "Chef's Table", description: "Reserved tasting table", price: 6999, available: 28 },
    ],
  },
  {
    slug: "pune-marathon-expo",
    title: "Pune Marathon Expo",
    city: "Pune",
    venue: "Shiv Chhatrapati Sports Complex",
    category: "Sports",
    date: "2026-08-02T07:00:00",
    doors: "6:00 AM",
    image: "images/event-basketball.png",
    summary: "Race bib collection, fitness workshops, brand stalls, and a community 5K.",
    description: [
      "A weekend sports expo with running brands, recovery sessions, nutrition talks, and a timed community 5K.",
      "Passes include expo access and participation in selected race-day activities.",
    ],
    tiers: [
      { id: "expo", name: "Expo Entry", description: "Expo and talks access", price: 299, available: 1000 },
      { id: "fivek", name: "5K Run", description: "Expo plus timed 5K entry", price: 999, available: 500 },
      { id: "runner", name: "Runner Pack", description: "5K entry, tee, and medal", price: 1799, available: 250 },
    ],
  },
  {
    slug: "comic-con-pune",
    title: "Comic Con Pune",
    city: "Pune",
    venue: "Deccan College Grounds",
    category: "Arts",
    date: "2026-09-19T10:30:00",
    doors: "10:00 AM",
    image: "images/event-art.png",
    summary: "Cosplay, comics, anime, gaming, and creator showcases.",
    description: [
      "Comic Con Pune brings pop culture fans together for stage events, creator booths, gaming, and collectibles.",
      "Superfan tickets include early entry and a merchandise voucher.",
    ],
    lineup: ["Cosplay Showcase", "Creator Stage", "Gaming Arena"],
    tiers: [
      { id: "day", name: "Day Pass", description: "Full-day event access", price: 999, available: 520 },
      { id: "superfan", name: "Superfan", description: "Early entry and merch voucher", price: 1999, available: 150 },
    ],
  },
  {
    slug: "pune-tech-meet",
    title: "Pune Tech Meet",
    city: "Pune",
    venue: "JW Marriott Pune",
    category: "Conference",
    date: "2026-11-14T09:30:00",
    doors: "8:45 AM",
    image: "images/event-conference.png",
    summary: "A compact conference for product teams, engineers, and founders.",
    description: [
      "Pune Tech Meet focuses on AI workflows, developer tools, design systems, and startup operating lessons.",
      "Tickets include all talks, lunch, workshop access, and networking sessions.",
    ],
    lineup: ["AI Workflows", "Developer Velocity", "Product-Led Growth"],
    tiers: [
      { id: "standard", name: "Standard", description: "Talks and lunch", price: 3999, available: 180 },
      { id: "workshop", name: "Workshop", description: "Talks, lunch, and workshop track", price: 7999, available: 70 },
      { id: "founder", name: "Founder Table", description: "Roundtable and networking dinner", price: 14999, available: 20 },
    ],
  },
];

function getStoredCity() {
  try {
    return localStorage.getItem(SELECTED_CITY_STORAGE_KEY);
  } catch (e) {
    return null;
  }
}

function setStoredCity(city) {
  try {
    localStorage.setItem(SELECTED_CITY_STORAGE_KEY, city);
  } catch (e) {
    // Ignore storage failures so browsing still works in restricted contexts.
  }
}

function normalizeCity(city) {
  return POPULAR_CITIES.includes(city) ? city : POPULAR_CITIES[0];
}

function getSelectedCity() {
  return normalizeCity(getStoredCity());
}

function setSelectedCity(city) {
  const selectedCity = normalizeCity(city);
  setStoredCity(selectedCity);
  window.dispatchEvent(new CustomEvent("ovation:city-change", { detail: { city: selectedCity } }));
  return selectedCity;
}

function getEventsForCity(city = getSelectedCity()) {
  const selectedCity = normalizeCity(city);
  return EVENTS.filter((event) => event.city === selectedCity);
}

function getCurrentCityEvents() {
  return getEventsForCity(getSelectedCity());
}

function formatCurrency(amount) {
  return `INR ${Math.round(amount).toLocaleString("en-IN")}`;
}

function getEvent(slug) {
  return EVENTS.find((e) => e.slug === slug);
}

function getFeaturedEvents(city = getSelectedCity()) {
  return getEventsForCity(city).filter((e) => e.featured);
}

function formatEventDate(iso) {
  const d = new Date(iso);
  return {
    weekday: d.toLocaleDateString("en-IN", { weekday: "short" }),
    day: d.toLocaleDateString("en-IN", { day: "2-digit" }),
    month: d.toLocaleDateString("en-IN", { month: "short" }).toUpperCase(),
    full: d.toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
    time: d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
  };
}

window.OvationData = {
  CATEGORIES,
  POPULAR_CITIES,
  CATEGORY_IMAGES,
  EVENTS,
  formatCurrency,
  getEvent,
  getFeaturedEvents,
  getSelectedCity,
  setSelectedCity,
  getEventsForCity,
  getCurrentCityEvents,
  formatEventDate,
};
