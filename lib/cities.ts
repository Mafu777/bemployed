export type City = { slug: string; name: string; intro: string };

export const CITIES: City[] = [
  { slug: "johannesburg", name: "Johannesburg", intro: "Johannesburg is South Africa's biggest job market, with openings across retail, finance, logistics, admin and IT. Browse the latest vacancies below and apply directly." },
  { slug: "pretoria", name: "Pretoria", intro: "Pretoria's job market is anchored by government, education and professional services. Find the latest vacancies in and around the capital below." },
  { slug: "cape-town", name: "Cape Town", intro: "Cape Town offers jobs in tourism, hospitality, tech, retail and the creative industries. See the latest vacancies below." },
  { slug: "durban", name: "Durban", intro: "Durban's port, manufacturing and retail sectors drive local hiring. Browse the latest jobs in Durban and surrounds below." },
  { slug: "gqeberha", name: "Gqeberha", intro: "Gqeberha has openings in automotive, manufacturing, retail and services. See the latest vacancies below." },
  { slug: "bloemfontein", name: "Bloemfontein", intro: "Bloemfontein hires across education, government, healthcare and retail. Browse the latest vacancies below." },
  { slug: "polokwane", name: "Polokwane", intro: "Polokwane is Limpopo's main hub, with jobs in retail, mining services, government and agriculture. See the latest vacancies below." },
  { slug: "east-london", name: "East London", intro: "East London has openings in automotive, manufacturing, retail and public services. Browse the latest vacancies below." },
];

export const getCityBySlug = (slug: string) =>
  CITIES.find((c) => c.slug === slug) ?? null; 