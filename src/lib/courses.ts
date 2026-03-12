import type { GolfCourse } from '@/types'

// Miami-area golf courses database
export const golfCourses: GolfCourse[] = [
  {
    id: 'trump-national-doral',
    name: 'Trump National Doral',
    address: '4400 NW 87th Avenue',
    city: 'Doral',
    state: 'FL',
    zipCode: '33178',
    latitude: 25.8094,
    longitude: -80.3381,
    phone: '(305) 592-2000',
  },
  {
    id: 'miami-beach-golf-club',
    name: 'Miami Beach Golf Club',
    address: '2301 Alton Road',
    city: 'Miami Beach',
    state: 'FL',
    zipCode: '33140',
    latitude: 25.7975,
    longitude: -80.1392,
    phone: '(305) 532-3350',
  },
  {
    id: 'crandon-golf-key-biscayne',
    name: 'Crandon Golf at Key Biscayne',
    address: '6700 Crandon Boulevard',
    city: 'Key Biscayne',
    state: 'FL',
    zipCode: '33149',
    latitude: 25.7095,
    longitude: -80.1611,
    phone: '(305) 361-9129',
  },
  {
    id: 'jacaranda-golf-club',
    name: 'Jacaranda Golf Club',
    address: '9200 West Broward Boulevard',
    city: 'Plantation',
    state: 'FL',
    zipCode: '33324',
    latitude: 26.1206,
    longitude: -80.2726,
    phone: '(954) 472-5831',
  },
  {
    id: 'turnberry-isle-miami',
    name: 'Turnberry Isle Miami',
    address: '19999 West Country Club Drive',
    city: 'Aventura',
    state: 'FL',
    zipCode: '33180',
    latitude: 25.9604,
    longitude: -80.1394,
    phone: '(305) 932-6204',
  },
  {
    id: 'doral-golf-resort',
    name: 'Doral Golf Resort & Spa',
    address: '4400 NW 87th Avenue',
    city: 'Doral',
    state: 'FL',
    zipCode: '33178',
    latitude: 25.8094,
    longitude: -80.3381,
    phone: '(305) 592-2000',
  },
  {
    id: 'orange-blossom-golf',
    name: 'Orange Blossom Golf Course',
    address: '16601 SW 80th Street',
    city: 'Miami',
    state: 'FL',
    zipCode: '33193',
    latitude: 25.6942,
    longitude: -80.4572,
    phone: '(305) 385-2109',
  },
  {
    id: 'international-links-miami',
    name: 'International Links Miami',
    address: '11500 NW 87th Court',
    city: 'Hialeah Gardens',
    state: 'FL',
    zipCode: '33018',
    latitude: 25.8761,
    longitude: -80.3439,
    phone: '(305) 829-5773',
  },
  {
    id: 'the-links-at-key-biscayne',
    name: 'The Links at Key Biscayne',
    address: '6700 Crandon Boulevard',
    city: 'Key Biscayne',
    state: 'FL',
    zipCode: '33149',
    latitude: 25.7095,
    longitude: -80.1611,
    phone: '(305) 361-9129',
  },
  {
    id: 'miami-springs-golf',
    name: 'Miami Springs Golf & Country Club',
    address: '650 Curtiss Parkway',
    city: 'Miami Springs',
    state: 'FL',
    zipCode: '33166',
    latitude: 25.8194,
    longitude: -80.2892,
    phone: '(305) 887-2020',
  },
]

// Search courses by name
export function searchCourses(query: string): GolfCourse[] {
  if (!query || query.length < 2) return []
  
  const lowerQuery = query.toLowerCase()
  return golfCourses.filter(course => 
    course.name.toLowerCase().includes(lowerQuery) ||
    course.city.toLowerCase().includes(lowerQuery)
  )
}

// Get course by ID
export function getCourseById(id: string): GolfCourse | undefined {
  return golfCourses.find(course => course.id === id)
}

// Format course address for display
export function formatCourseAddress(course: GolfCourse): string {
  return `${course.address}, ${course.city}, ${course.state} ${course.zipCode}`
}
