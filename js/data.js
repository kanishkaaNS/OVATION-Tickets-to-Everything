// ==========================================================================
// OVATION - Events Data & Helpers
// ==========================================================================

const CATEGORIES = [
  "Music",
  "Comedy",
  "Arts",
  "Food",
  "Sports",
  "Movies",
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
  Comedy: "images/event-comedy.png",
  Arts: "images/event-art.png",
  Food: "images/event-food.png",
  Sports: "images/event-basketball.png",
  Movies: "images/event-theater.png",
};

const CITY_VENUES = {
  Ahmedabad: {
    Music: ["GMDC Ground", "Sabarmati Riverfront", "Karnavati Club Lawns"],
    Comedy: ["Karnavati Club Auditorium", "Natrani Amphitheatre", "HK Hall"],
    Arts: ["Karnavati Club Convention Centre", "Amdavad ni Gufa", "CEPT Exhibition Gallery"],
    Food: ["Sabarmati Riverfront", "Manek Chowk Food Street", "Riverfront Event Centre"],
    Sports: ["Narendra Modi Stadium", "EKA Arena", "Sabarmati Sports Park"],
    Movies: ["PVR Acropolis", "Drive-In Cinema Ahmedabad", "Cinepolis Ahmedabad One"],
  },
  Bengaluru: {
    Music: ["Jayamahal Palace Grounds", "Phoenix Marketcity Arena", "Manpho Convention Centre"],
    Comedy: ["Good Shepherd Auditorium", "Jagriti Theatre", "Koramangala Comedy Club"],
    Arts: ["KTPO Convention Centre", "Karnataka Chitrakala Parishath", "Bangalore International Centre"],
    Food: ["Palace Grounds", "Indiranagar Social Street", "UB City Amphitheatre"],
    Sports: ["M. Chinnaswamy Stadium", "Sree Kanteerava Stadium", "Padukone-Dravid Centre"],
    Movies: ["PVR Orion Mall", "Bangalore International Centre", "VR Bengaluru Open Air"],
  },
  Chennai: {
    Music: ["Music Academy", "YMCA Grounds", "Sir Mutha Venkatasubba Rao Concert Hall"],
    Comedy: ["Museum Theatre", "Medai - The Stage", "Alliance Francaise Auditorium"],
    Arts: ["Chennai Trade Centre", "Lalit Kala Akademi", "DakshinaChitra"],
    Food: ["Besant Nagar Beach", "Phoenix Marketcity Courtyard", "Island Grounds"],
    Sports: ["M. A. Chidambaram Stadium", "Jawaharlal Nehru Stadium", "SDAT Tennis Stadium"],
    Movies: ["Sathyam Cinemas", "PVR Palazzo", "Prarthana Beach Drive-In"],
  },
  "Delhi NCR": {
    Music: ["Jawaharlal Nehru Stadium", "DLF CyberHub Amphitheatre", "Garden of Five Senses"],
    Comedy: ["Kamani Auditorium", "The Laugh Store Gurgaon", "Akshara Theatre"],
    Arts: ["NSIC Exhibition Ground", "India Habitat Centre", "Bikaner House"],
    Food: ["Major Dhyan Chand National Stadium", "Dilli Haat INA", "CyberHub Food Street"],
    Sports: ["Arun Jaitley Stadium", "Thyagaraj Sports Complex", "Jawaharlal Nehru Stadium"],
    Movies: ["PVR Director's Cut", "Siri Fort Auditorium", "Sunset Cinema Club Gurgaon"],
  },
  Hyderabad: {
    Music: ["Gachibowli Stadium", "Hitex Open Grounds", "Shilpakala Vedika"],
    Comedy: ["Shilpakala Vedika", "Heart Cup Coffee Gachibowli", "Ravindra Bharathi"],
    Arts: ["Hitex Exhibition Centre", "State Gallery of Art", "Lamakaan"],
    Food: ["People's Plaza", "Charminar Precinct", "Necklace Road"],
    Sports: ["Rajiv Gandhi International Stadium", "Gachibowli Indoor Stadium", "LB Stadium"],
    Movies: ["Prasads Multiplex", "AMB Cinemas", "Open Air Cinema Hitec City"],
  },
  Kolkata: {
    Music: ["Nicco Park Big Lawn", "Nazrul Mancha", "Science City Auditorium"],
    Comedy: ["Kala Mandir", "The Saturday Club", "Gyan Manch"],
    Arts: ["Biswa Bangla Mela Prangan", "Academy of Fine Arts", "Kolkata Centre for Creativity"],
    Food: ["Eco Park", "Park Street Food Walk", "Milan Mela Grounds"],
    Sports: ["Eden Gardens", "Salt Lake Stadium", "Netaji Indoor Stadium"],
    Movies: ["Nandan", "INOX Quest Mall", "Rabindra Sadan Open Air"],
  },
  Mumbai: {
    Music: ["Jio World Garden", "Mahalaxmi Racecourse", "NESCO Grounds"],
    Comedy: ["The Habitat", "Tata Theatre NCPA", "Royal Opera House"],
    Arts: ["NESCO Convention Centre", "Jehangir Art Gallery", "Jio World Convention Centre"],
    Food: ["Mahalaxmi Racecourse", "Bandra Fort Amphitheatre", "Jio World Drive"],
    Sports: ["Wankhede Stadium", "Mumbai Football Arena", "Dome NSCI"],
    Movies: ["PVR Juhu", "NCPA Open Air", "Regal Cinema"],
  },
  Pune: {
    Music: ["Amanora Park Town", "Phoenix Marketcity Arena", "Royal Palms Lawns"],
    Comedy: ["Balgandharva Rangmandir", "The Box Pune", "Jawaharlal Nehru Memorial Hall"],
    Arts: ["Deccan College Grounds", "Monalisa Kalagram", "Raja Ravi Varma Art Gallery"],
    Food: ["FC Road Social Street", "Amanora Mall Grounds", "Koregaon Park Food Lane"],
    Sports: ["Shiv Chhatrapati Sports Complex", "MCA Stadium", "Balewadi Stadium"],
    Movies: ["PVR Pavilion Mall", "NFAI Auditorium", "Rooftop Cinema Koregaon Park"],
  },
};

const CATEGORY_BLUEPRINTS = {
  Music: [
    {
      title: "Sunburn {city}",
      summary: "A high-energy electronic music festival with immersive lights and headline DJs.",
      lineup: ["Lost Stories", "Nucleya", "Anish Sood"],
      tiers: [
        ["General Admission", "Main festival access", 2499, 600],
        ["Fan Pit", "Front-stage access", 4999, 180],
        ["VIP", "Fast entry and raised viewing deck", 8999, 70],
      ],
    },
    {
      title: "{city} Indie Weekender",
      summary: "A weekend of indie bands, fusion artists, food stalls, and relaxed festival energy.",
      lineup: ["Parvaaz", "Easy Wanderlings", "Mali"],
      tiers: [
        ["Day Pass", "Single-day access", 1499, 420],
        ["Weekend Pass", "Both festival days", 2799, 260],
        ["VIP", "Priority entry and viewing zone", 5499, 80],
      ],
    },
    {
      title: "{city} Classical Nights",
      summary: "A seated evening of classical, ghazal, and contemporary Indian performances.",
      lineup: ["Raga Collective", "Swar Ensemble", "Aarohi Quartet"],
      tiers: [
        ["Balcony", "Reserved balcony seating", 799, 180],
        ["Premium", "Center auditorium seating", 1799, 120],
        ["Gold", "Front rows with priority entry", 2999, 50],
      ],
    },
  ],
  Comedy: [
    {
      title: "{city} Comedy Roast",
      summary: "A sharp stand-up and roast night with crowd work and guest comics.",
      lineup: ["Rahul Dua", "Prashasti Singh", "Gaurav Kapoor"],
      tiers: [
        ["Silver", "Rear auditorium seating", 799, 220],
        ["Gold", "Middle section seating", 1499, 140],
        ["Platinum", "Front section seating", 2499, 60],
      ],
    },
    {
      title: "Midnight Laughs {city}",
      summary: "A late-night lineup of quick sets, surprise drop-ins, and intimate comedy room energy.",
      lineup: ["Azeem Banatwalla", "Urooj Ashfaq", "Local Openers"],
      tiers: [
        ["General Seating", "First-come table seating", 699, 120],
        ["Front Row", "Reserved seats by the stage", 1299, 30],
      ],
    },
    {
      title: "{city} Improv Night",
      summary: "Fast, chaotic, audience-powered improv with sketches built live on stage.",
      lineup: ["The Suggestion Box", "City Improv Collective"],
      tiers: [
        ["Standard", "Open seating", 599, 110],
        ["Supporter", "Best rows and cast meet-and-greet", 1199, 24],
      ],
    },
  ],
  Arts: [
    {
      title: "Comic Con {city}",
      summary: "Cosplay, comics, anime, gaming, collectibles, and creator panels.",
      lineup: ["Cosplay Championship", "Creator Alley", "Gaming Arena"],
      tiers: [
        ["Day Pass", "Full-day event access", 999, 650],
        ["Superfan", "Early entry and merch kit", 2199, 180],
      ],
    },
    {
      title: "{city} Art Walk",
      summary: "A guided contemporary art walk through galleries, installations, and heritage spaces.",
      lineup: ["Curator Walkthrough", "Artist Studio Visit"],
      tiers: [
        ["Guided Walk", "Two-hour guided art walk", 799, 90],
        ["Walk Plus", "Guided walk and catalog", 1499, 45],
      ],
    },
    {
      title: "{city} Design Fair",
      summary: "A showcase of textiles, ceramics, printmaking, illustration, and contemporary Indian craft.",
      lineup: ["Maker Demos", "Design Talks", "Craft Market"],
      tiers: [
        ["Entry", "Fair and talks access", 499, 500],
        ["Workshop Pass", "Entry plus one workshop", 1599, 100],
        ["Patron", "Preview hour and catalog", 2999, 35],
      ],
    },
  ],
  Food: [
    {
      title: "{city} Food Festival",
      summary: "Street food, chef counters, desserts, drinks, and live music in one open-air fair.",
      tiers: [
        ["Taster", "Entry and 8 food tokens", 999, 500],
        ["Gourmet", "Entry, 16 tokens, and demo access", 1999, 220],
        ["Chef's Table", "Reserved tasting table", 5999, 30],
      ],
    },
    {
      title: "{city} Street Food Crawl",
      summary: "A guided tasting route through local food lanes, iconic snacks, and dessert stops.",
      tiers: [
        ["Food Walk", "Guided route and tastings", 999, 80],
        ["Premium Walk", "Extra tastings and dessert stop", 1799, 40],
      ],
    },
    {
      title: "{city} Dessert Carnival",
      summary: "A sweet-focused evening of bakeries, mithai makers, patisserie counters, and coffee bars.",
      tiers: [
        ["Entry", "Carnival access", 499, 350],
        ["Sampler", "Entry and 10 tasting tokens", 1299, 160],
        ["Family Table", "Reserved table for four", 3999, 35],
      ],
    },
  ],
  Sports: [
    {
      title: "{city} Cricket Classic",
      summary: "A floodlit T20 exhibition with fan zones, warmups, and reserved seating.",
      tiers: [
        ["Upper Stand", "Elevated stadium seating", 999, 900],
        ["Lower Stand", "Lower bowl seating", 2499, 480],
        ["Hospitality Box", "Premium box with refreshments", 9999, 80],
      ],
    },
    {
      title: "{city} Football Derby",
      summary: "A packed football night with chants, city pride, and end-to-end action.",
      tiers: [
        ["East Stand", "General reserved seating", 499, 1200],
        ["West Stand", "Central reserved seating", 999, 650],
        ["Premium", "Best view and lounge access", 2999, 120],
      ],
    },
    {
      title: "{city} Marathon Expo",
      summary: "Race bib collection, fitness workshops, brand stalls, and a community 5K.",
      tiers: [
        ["Expo Entry", "Expo and talks access", 299, 1000],
        ["5K Run", "Expo plus timed 5K entry", 999, 500],
        ["Runner Pack", "5K entry, tee, and medal", 1799, 250],
      ],
    },
  ],
  Movies: [
    {
      title: "{city} Premiere Night",
      summary: "A red-carpet movie premiere with reserved seating, fan moments, and cast conversations.",
      lineup: ["Cast Q&A", "Premiere Screening", "Photo Wall"],
      tiers: [
        ["Standard", "Reserved screening seat", 699, 220],
        ["Premium", "Prime seating and popcorn combo", 1499, 120],
        ["Premiere", "Best seats and Q&A access", 2999, 40],
      ],
    },
    {
      title: "{city} Film Festival",
      summary: "A curated day of Indian and international films, shorts, documentaries, and filmmaker talks.",
      lineup: ["Shorts Showcase", "Documentary Hour", "Director Talk"],
      tiers: [
        ["Day Pass", "All screenings for one day", 999, 300],
        ["Festival Pass", "All screenings and talks", 2499, 140],
        ["Patron", "Reserved seats and catalog", 4999, 35],
      ],
    },
    {
      title: "{city} Open Air Cinema",
      summary: "A relaxed outdoor screening with picnic seating, food counters, and pre-show music.",
      tiers: [
        ["Lawn", "Bring-your-own mat zone", 499, 300],
        ["Bean Bag", "Reserved bean bag seating", 999, 120],
        ["Couple Pod", "Reserved pod for two", 2199, 50],
      ],
    },
  ],
};

const CATEGORY_DATES = {
  Music: ["2026-07-18T19:00:00", "2026-08-08T18:00:00", "2026-09-12T19:30:00"],
  Comedy: ["2026-07-25T21:00:00", "2026-08-29T20:00:00", "2026-10-03T19:30:00"],
  Arts: ["2026-08-09T11:00:00", "2026-09-27T12:00:00", "2026-11-21T10:00:00"],
  Food: ["2026-08-15T17:00:00", "2026-09-20T13:00:00", "2026-10-04T16:00:00"],
  Sports: ["2026-08-30T19:00:00", "2026-11-15T18:30:00", "2026-12-05T07:00:00"],
  Movies: ["2026-09-05T19:30:00", "2026-10-18T18:00:00", "2026-11-14T20:00:00"],
};

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function makeTiers(tiers) {
  return tiers.map(([name, description, price, available]) => ({
    id: slugify(name),
    name,
    description,
    price,
    available,
  }));
}

function buildDescription(title, city, category, summary) {
  return [
    `${title} brings a polished ${category.toLowerCase()} experience to ${city}, with smooth entry, clear ticket tiers, and a venue setup built for easy browsing and booking.`,
    `${summary} Select the tier that fits your plan and proceed directly to checkout.`,
  ];
}

function buildEvents() {
  return POPULAR_CITIES.flatMap((city) =>
    CATEGORIES.flatMap((category) =>
      CATEGORY_BLUEPRINTS[category].map((blueprint, index) => {
        const title = blueprint.title.replace("{city}", city);
        const venue = CITY_VENUES[city][category][index];
        return {
          slug: slugify(title),
          title,
          city,
          venue,
          category,
          date: CATEGORY_DATES[category][index],
          doors: category === "Sports" && index === 2 ? "6:00 AM" : category === "Arts" ? "10:00 AM" : "6:00 PM",
          image: CATEGORY_IMAGES[category],
          summary: blueprint.summary,
          description: buildDescription(title, city, category, blueprint.summary),
          lineup: blueprint.lineup,
          featured: index === 0,
          tiers: makeTiers(blueprint.tiers),
        };
      })
    )
  );
}

let selectedCityState = null;

const EVENTS = buildEvents();

function getStoredCity() {
  // 1. Check URL parameters first (most reliable on file:// protocol)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const urlCity = urlParams.get('city');
    if (urlCity && POPULAR_CITIES.includes(urlCity)) {
      return urlCity;
    }
  } catch (e) { }

  // 2. Use Centralized State Manager
  if (window.OvationState) {
    return window.OvationState.get(SELECTED_CITY_STORAGE_KEY);
  }

  return null;
}

function setStoredCity(city) {
  if (window.OvationState) {
    window.OvationState.set(SELECTED_CITY_STORAGE_KEY, city);
  }
}

function normalizeCity(city) {
  return POPULAR_CITIES.includes(city) ? city : POPULAR_CITIES[0];
}

function getSelectedCity() {
  if (!selectedCityState) {
    selectedCityState = normalizeCity(getStoredCity());
  }

  return selectedCityState;
}

function setSelectedCity(city) {
  const selectedCity = normalizeCity(city);
  selectedCityState = selectedCity;
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
