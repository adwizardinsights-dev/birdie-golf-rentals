import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@birdiegolfrentals.com' },
    update: {},
    create: {
      email: 'admin@birdiegolfrentals.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  })
  console.log('Created admin user:', adminUser.id)

  // Create golf club sets
  const standardSet = await prisma.golfClubSet.upsert({
    where: { id: 'standard-set-001' },
    update: {},
    create: {
      id: 'standard-set-001',
      name: 'Standard Set',
      tier: 'STANDARD',
      brand: 'Callaway',
      model: 'Strata',
      description: 'Perfect for casual golfers and beginners. Quality name-brand clubs at an affordable price.',
      pricePerDay: 49.00,
      depositAmount: 100.00,
      isActive: true,
    },
  })
  console.log('Created standard set:', standardSet.id)

  const premiumSet = await prisma.golfClubSet.upsert({
    where: { id: 'premium-set-001' },
    update: {},
    create: {
      id: 'premium-set-001',
      name: 'Premium Set',
      tier: 'PREMIUM',
      brand: 'TaylorMade',
      model: 'Stealth',
      description: 'For serious golfers seeking performance. Latest model clubs with premium features.',
      pricePerDay: 79.00,
      depositAmount: 200.00,
      isActive: true,
    },
  })
  console.log('Created premium set:', premiumSet.id)

  const tourSet = await prisma.golfClubSet.upsert({
    where: { id: 'tour-set-001' },
    update: {},
    create: {
      id: 'tour-set-001',
      name: 'Tour Set',
      tier: 'TOUR',
      brand: 'Titleist',
      model: 'TSR',
      description: 'Professional-grade equipment. Tour-level clubs with custom fitting options.',
      pricePerDay: 129.00,
      depositAmount: 500.00,
      isActive: true,
    },
  })
  console.log('Created tour set:', tourSet.id)

  // Create locations
  const fontainebleau = await prisma.location.upsert({
    where: { id: 'location-fontainebleau' },
    update: {},
    create: {
      id: 'location-fontainebleau',
      name: 'Fontainebleau Miami Beach',
      type: 'HOTEL',
      address: '4441 Collins Avenue',
      city: 'Miami Beach',
      state: 'FL',
      zipCode: '33140',
      country: 'US',
      phone: '(305) 538-2000',
      latitude: 25.8177,
      longitude: -80.1223,
      deliveryFee: 0,
      isActive: true,
    },
  })
  console.log('Created location:', fontainebleau.id)

  const trumpDoral = await prisma.location.upsert({
    where: { id: 'location-trump-doral' },
    update: {},
    create: {
      id: 'location-trump-doral',
      name: 'Trump National Doral Miami',
      type: 'GOLF_COURSE',
      address: '4400 NW 87th Avenue',
      city: 'Doral',
      state: 'FL',
      zipCode: '33178',
      country: 'US',
      phone: '(305) 592-2000',
      latitude: 25.8094,
      longitude: -80.3381,
      deliveryFee: 15.00,
      isActive: true,
    },
  })
  console.log('Created location:', trumpDoral.id)

  const waldorfAstoria = await prisma.location.upsert({
    where: { id: 'location-waldorf' },
    update: {},
    create: {
      id: 'location-waldorf',
      name: 'Waldorf Astoria Miami Beach',
      type: 'HOTEL',
      address: '1001 Oceanside Drive',
      city: 'Miami Beach',
      state: 'FL',
      zipCode: '33139',
      country: 'US',
      phone: '(305) 673-3333',
      latitude: 25.7697,
      longitude: -80.1336,
      deliveryFee: 0,
      isActive: true,
    },
  })
  console.log('Created location:', waldorfAstoria.id)

  // Create inventory
  await prisma.inventory.upsert({
    where: {
      clubSetId_locationId: {
        clubSetId: standardSet.id,
        locationId: fontainebleau.id,
      },
    },
    update: {},
    create: {
      clubSetId: standardSet.id,
      locationId: fontainebleau.id,
      quantityTotal: 20,
      quantityAvailable: 18,
      quantityReserved: 2,
    },
  })
  console.log('Created inventory for standard set at Fontainebleau')

  await prisma.inventory.upsert({
    where: {
      clubSetId_locationId: {
        clubSetId: premiumSet.id,
        locationId: fontainebleau.id,
      },
    },
    update: {},
    create: {
      clubSetId: premiumSet.id,
      locationId: fontainebleau.id,
      quantityTotal: 15,
      quantityAvailable: 12,
      quantityReserved: 3,
    },
  })
  console.log('Created inventory for premium set at Fontainebleau')

  await prisma.inventory.upsert({
    where: {
      clubSetId_locationId: {
        clubSetId: tourSet.id,
        locationId: trumpDoral.id,
      },
    },
    update: {},
    create: {
      clubSetId: tourSet.id,
      locationId: trumpDoral.id,
      quantityTotal: 10,
      quantityAvailable: 8,
      quantityReserved: 2,
    },
  })
  console.log('Created inventory for tour set at Trump Doral')

  // Create settings
  await prisma.setting.upsert({
    where: { key: 'tax_rate' },
    update: {},
    create: {
      key: 'tax_rate',
      value: '0.08',
      description: 'Sales tax rate for rentals',
    },
  })

  await prisma.setting.upsert({
    where: { key: 'delivery_window_morning' },
    update: {},
    create: {
      key: 'delivery_window_morning',
      value: '8:00 AM - 12:00 PM',
      description: 'Morning delivery time window',
    },
  })

  await prisma.setting.upsert({
    where: { key: 'delivery_window_afternoon' },
    update: {},
    create: {
      key: 'delivery_window_afternoon',
      value: '12:00 PM - 5:00 PM',
      description: 'Afternoon delivery time window',
    },
  })

  await prisma.setting.upsert({
    where: { key: 'delivery_window_evening' },
    update: {},
    create: {
      key: 'delivery_window_evening',
      value: '5:00 PM - 8:00 PM',
      description: 'Evening delivery time window',
    },
  })

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
