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
  Music: "images/events/music_sunburn.png",
  Comedy: "images/events/comedy_roast.png",
  Arts: "images/events/arts_comiccon.png",
  Food: "images/events/food_festival.png",
  Sports: "images/events/sports_cricket_new.jpg",
  Movies: "images/events/movies_avengers.jpg",
};

const CITY_THEATRES = {
  Bengaluru: [
    { name: "PVR Phoenix Marketcity, Whitefield", timings: ["10:30 AM", "1:45 PM", "6:00 PM"] },
    { name: "PVR Orion Mall, Rajajinagar", timings: ["11:15 AM", "4:30 PM", "9:15 PM"] },
    { name: "PVR Nexus Mall, Koramangala", timings: ["9:00 AM", "2:00 PM", "8:30 PM"] }
  ],
  Mumbai: [
    { name: "PVR Phoenix Marketcity, Kurla", timings: ["10:00 AM", "2:30 PM", "7:00 PM"] },
    { name: "Maison PVR, Jio World Drive, BKC", timings: ["11:45 AM", "5:00 PM", "9:30 PM"] },
    { name: "INOX R-City Mall, Ghatkopar", timings: ["9:30 AM", "3:00 PM", "8:00 PM"] }
  ],
  "Delhi NCR": [
    { name: "PVR Select Citywalk, Saket", timings: ["10:15 AM", "1:30 PM", "6:45 PM"] },
    { name: "PVR Vegas Mall, Dwarka", timings: ["11:00 AM", "4:15 PM", "9:00 PM"] },
    { name: "INOX DLF Mall of India, Noida", timings: ["9:45 AM", "3:15 PM", "8:45 PM"] }
  ],
  Hyderabad: [
    { name: "AMB Cinemas, Gachibowli", timings: ["10:30 AM", "2:00 PM", "7:30 PM"] },
    { name: "PVR Next Galleria Mall, Punjagutta", timings: ["11:30 AM", "4:45 PM", "9:15 PM"] },
    { name: "Prasads Multiplex, Hussain Sagar", timings: ["9:15 AM", "1:00 PM", "6:00 PM"] }
  ],
  Chennai: [
    { name: "PVR VR Chennai", timings: ["10:00 AM", "1:45 PM", "6:30 PM"] },
    { name: "Palazzo Cinemas, The Forum Vijaya Mall", timings: ["11:15 AM", "4:00 PM", "8:45 PM"] },
    { name: "INOX Marina Mall", timings: ["9:30 AM", "2:30 PM", "8:00 PM"] }
  ],
  Pune: [
    { name: "PVR Phoenix Marketcity Pune", timings: ["10:15 AM", "3:00 PM", "7:45 PM"] },
    { name: "Cinépolis Seasons Mall", timings: ["11:00 AM", "4:30 PM", "9:00 PM"] },
    { name: "INOX Amanora Mall", timings: ["9:45 AM", "2:15 PM", "8:30 PM"] }
  ],
  Kolkata: [
    { name: "INOX South City Mall", timings: ["10:30 AM", "1:30 PM", "6:15 PM"] },
    { name: "PVR Avani Riverside Mall", timings: ["11:45 AM", "5:00 PM", "9:30 PM"] },
    { name: "Cinépolis Acropolis Mall", timings: ["9:00 AM", "2:45 PM", "8:00 PM"] }
  ],
  Ahmedabad: [
    { name: "PVR Ahmedabad One Mall", timings: ["10:00 AM", "2:30 PM", "7:00 PM"] },
    { name: "INOX Himalaya Mall", timings: ["11:15 AM", "4:45 PM", "9:15 PM"] },
    { name: "Cinépolis AlphaOne Mall", timings: ["9:30 AM", "1:15 PM", "6:30 PM"] }
  ]
};

const CITY_VENUES = {
  Ahmedabad: {
    Music: ["GMDC Ground", "Sabarmati Riverfront", "Karnavati Club Lawns"],
    Comedy: ["Karnavati Club Auditorium", "Natrani Amphitheatre", "HK Hall"],
    Arts: ["Karnavati Club Convention Centre", "Amdavad ni Gufa", "CEPT Exhibition Gallery"],
    Food: ["Sabarmati Riverfront", "Manek Chowk Food Street", "Riverfront Event Centre"],
    Sports: ["Narendra Modi Stadium", "EKA Arena", "Sabarmati Sports Park"],
    Movies: ["PVR Ahmedabad One Mall", "INOX Himalaya Mall", "Cinépolis AlphaOne Mall"],
  },
  Bengaluru: {
    Music: ["Jayamahal Palace Grounds", "Phoenix Marketcity Arena", "Manpho Convention Centre"],
    Comedy: ["Good Shepherd Auditorium", "Jagriti Theatre", "Koramangala Comedy Club"],
    Arts: ["KTPO Convention Centre", "Karnataka Chitrakala Parishath", "Bangalore International Centre"],
    Food: ["Palace Grounds", "Indiranagar Social Street", "UB City Amphitheatre"],
    Sports: ["M. Chinnaswamy Stadium", "Sree Kanteerava Stadium", "Padukone-Dravid Centre"],
    Movies: ["PVR Phoenix Marketcity, Whitefield", "PVR Orion Mall, Rajajinagar", "PVR Nexus Mall, Koramangala"],
  },
  Chennai: {
    Music: ["Music Academy", "YMCA Grounds", "Sir Mutha Venkatasubba Rao Concert Hall"],
    Comedy: ["Museum Theatre", "Medai - The Stage", "Alliance Francaise Auditorium"],
    Arts: ["Chennai Trade Centre", "Lalit Kala Akademi", "DakshinaChitra"],
    Food: ["Besant Nagar Beach", "Phoenix Marketcity Courtyard", "Island Grounds"],
    Sports: ["M. A. Chidambaram Stadium", "Jawaharlal Nehru Stadium", "SDAT Tennis Stadium"],
    Movies: ["PVR VR Chennai", "Palazzo Cinemas, The Forum Vijaya Mall", "INOX Marina Mall"],
  },
  "Delhi NCR": {
    Music: ["Jawaharlal Nehru Stadium", "DLF CyberHub Amphitheatre", "Garden of Five Senses"],
    Comedy: ["Kamani Auditorium", "The Laugh Store Gurgaon", "Akshara Theatre"],
    Arts: ["NSIC Exhibition Ground", "India Habitat Centre", "Bikaner House"],
    Food: ["Major Dhyan Chand National Stadium", "Dilli Haat INA", "CyberHub Food Street"],
    Sports: ["Arun Jaitley Stadium", "Thyagaraj Sports Complex", "Jawaharlal Nehru Stadium"],
    Movies: ["PVR Select Citywalk, Saket", "PVR Vegas Mall, Dwarka", "INOX DLF Mall of India, Noida"],
  },
  Hyderabad: {
    Music: ["Gachibowli Stadium", "Hitex Open Grounds", "Shilpakala Vedika"],
    Comedy: ["Shilpakala Vedika", "Heart Cup Coffee Gachibowli", "Ravindra Bharathi"],
    Arts: ["Hitex Exhibition Centre", "State Gallery of Art", "Lamakaan"],
    Food: ["People's Plaza", "Charminar Precinct", "Necklace Road"],
    Sports: ["Rajiv Gandhi International Stadium", "Gachibowli Indoor Stadium", "LB Stadium"],
    Movies: ["AMB Cinemas, Gachibowli", "PVR Next Galleria Mall, Punjagutta", "Prasads Multiplex, Hussain Sagar"],
  },
  Kolkata: {
    Music: ["Nicco Park Big Lawn", "Nazrul Mancha", "Science City Auditorium"],
    Comedy: ["Kala Mandir", "The Saturday Club", "Gyan Manch"],
    Arts: ["Biswa Bangla Mela Prangan", "Academy of Fine Arts", "Kolkata Centre for Creativity"],
    Food: ["Eco Park", "Park Street Food Walk", "Milan Mela Grounds"],
    Sports: ["Eden Gardens", "Salt Lake Stadium", "Netaji Indoor Stadium"],
    Movies: ["INOX South City Mall", "PVR Avani Riverside Mall", "Cinépolis Acropolis Mall"],
  },
  Mumbai: {
    Music: ["Jio World Garden", "Mahalaxmi Racecourse", "NESCO Grounds"],
    Comedy: ["The Habitat", "Tata Theatre NCPA", "Royal Opera House"],
    Arts: ["NESCO Convention Centre", "Jehangir Art Gallery", "Jio World Convention Centre"],
    Food: ["Mahalaxmi Racecourse", "Bandra Fort Amphitheatre", "Jio World Drive"],
    Sports: ["Wankhede Stadium", "Mumbai Football Arena", "Dome NSCI"],
    Movies: ["PVR Phoenix Marketcity, Kurla", "Maison PVR, Jio World Drive, BKC", "INOX R-City Mall, Ghatkopar"],
  },
  Pune: {
    Music: ["Amanora Park Town", "Phoenix Marketcity Arena", "Royal Palms Lawns"],
    Comedy: ["Balgandharva Rangmandir", "The Box Pune", "Jawaharlal Nehru Memorial Hall"],
    Arts: ["Deccan College Grounds", "Monalisa Kalagram", "Raja Ravi Varma Art Gallery"],
    Food: ["FC Road Social Street", "Amanora Mall Grounds", "Koregaon Park Food Lane"],
    Sports: ["Shiv Chhatrapati Sports Complex", "MCA Stadium", "Balewadi Stadium"],
    Movies: ["PVR Phoenix Marketcity Pune", "Cinépolis Seasons Mall", "INOX Amanora Mall"],
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
      title: "{city} Basketball Showdown",
      summary: "A packed basketball night with chants, city pride, and end-to-end action on the court.",
      tiers: [
        ["Upper Stand", "General reserved seating", 499, 1200],
        ["Lower Stand", "Central reserved seating", 999, 650],
        ["Courtside Premium", "Best view and lounge access", 2999, 120],
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
      title: "Avengers: Doomsday",
      summary: "The Avengers assemble once again to face an unprecedented threat from the multiverse.",
      genre: "Action / Sci-Fi",
      duration: "2h 45m",
      rating: "UA",
      releaseDate: "2026-12-18",
      languages: ["English", "Hindi", "Tamil", "Telugu"],
      tiers: [
        ["Economy", "Front rows", 300, 100],
        ["Standard", "Middle rows", 400, 200],
        ["Premium", "Back rows", 500, 50],
      ],
    },
    {
      title: "Resident Evil",
      summary: "A terrifying return to the survival horror franchise with new mutations and terrifying encounters.",
      genre: "Horror / Action",
      duration: "2h 15m",
      rating: "A",
      releaseDate: "2026-09-18",
      languages: ["English", "Hindi"],
      tiers: [
        ["Economy", "Front rows", 300, 100],
        ["Standard", "Middle rows", 400, 200],
        ["Premium", "Back rows", 500, 50],
      ],
    },
    {
      title: "Dune: Part Three",
      summary: "The final chapter of the saga as Paul Atreides' holy war spreads across the galaxy.",
      genre: "Sci-Fi / Drama",
      duration: "3h 10m",
      rating: "A",
      releaseDate: "2026-12-18",
      languages: ["English", "Hindi", "Tamil"],
      tiers: [
        ["Economy", "Front rows", 300, 100],
        ["Standard", "Middle rows", 400, 200],
        ["Premium", "Back rows", 500, 50],
      ],
    },
  ],
};

const CATEGORY_DATES = {
  Music: ["2026-10-18T19:00:00", "2026-11-08T18:00:00", "2026-12-12T19:30:00"],
  Comedy: ["2026-10-25T21:00:00", "2026-11-29T20:00:00", "2026-12-03T19:30:00"],
  Arts: ["2026-10-09T11:00:00", "2026-11-27T12:00:00", "2026-12-21T10:00:00"],
  Food: ["2026-10-15T17:00:00", "2026-11-20T13:00:00", "2026-12-04T16:00:00"],
  Sports: ["2026-10-30T19:00:00", "2026-11-15T18:30:00", "2026-12-05T07:00:00"],
  Movies: ["2026-10-05T19:30:00", "2026-11-18T18:00:00", "2026-12-14T20:00:00"],
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

const BLUEPRINT_IMAGES = {
  Music: ["images/events/music_sunburn.png", "images/events/music_indie.png", "images/events/music_classical.png"],
  Comedy: ["images/events/comedy_roast.png", "images/events/comedy_midnight.png", "images/events/comedy_improv.png"],
  Arts: ["images/events/arts_comiccon.png", "images/events/arts_walk.png", "images/events/arts_design.png"],
  Food: ["images/events/food_festival.png", "images/events/food_street.png", "images/events/food_dessert.png"],
  Sports: ["images/events/sports_cricket_new.jpg", "images/events/sports_basketball.png", "images/events/sports_marathon.png"],
  Movies: ["images/events/movies_avengers.jpg", "images/events/movies_resident_evil.jpg", "images/events/movies_dune.jpg"]
};

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
          image: BLUEPRINT_IMAGES[category][index],
          summary: blueprint.summary,
          description: buildDescription(title, city, category, blueprint.summary),
          lineup: blueprint.lineup,
          featured: index === 0,
          tiers: makeTiers(blueprint.tiers),
          // Movie specific metadata
          genre: blueprint.genre,
          duration: blueprint.duration,
          rating: blueprint.rating,
          releaseDate: blueprint.releaseDate,
          languages: blueprint.languages,
        };
      })
    )
  );
}

let selectedCityState = null;

const EVENTS = buildEvents();

function getStoredCity() {
  // 1. Use Centralized State Manager first
  if (window.OvationState) {
    const saved = window.OvationState.get(SELECTED_CITY_STORAGE_KEY);
    if (saved) return saved;
  }

  // 2. Check URL parameters as fallback for first visit
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const urlCity = urlParams.get('city');
    if (urlCity && POPULAR_CITIES.includes(urlCity)) {
      return urlCity;
    }
  } catch (e) { }

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
  const currentCity = getSelectedCity();
  const eventInCity = EVENTS.find((e) => e.slug === slug && e.city === currentCity);
  if (eventInCity) return eventInCity;
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
  CITY_THEATRES,
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
