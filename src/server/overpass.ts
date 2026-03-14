// src/server/overpass.ts
const OVERPASS_URL = "https://overpass-api.de/api/interpreter"
const LOCATIONIQ_API_KEY = process.env.LOCATIONIQ_API_KEY

export type PulloverSpot = {
  name: string
  type: string
  lat: number
  lon: number
  distanceMeters: number
  distanceLabel: string
  address: string | null
}

function haversineMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6_371_000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function bearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const toDeg = (r: number) => (r * 180) / Math.PI
  const dLon = toRad(lon2 - lon1)
  const y = Math.sin(dLon) * Math.cos(toRad(lat2))
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon)
  return (toDeg(Math.atan2(y, x)) + 360) % 360
}

function compassDirection(deg: number): string {
  const dirs = ["north", "northeast", "east", "southeast", "south", "southwest", "west", "northwest"]
  return dirs[Math.round(deg / 45) % 8]
}

const AMENITY_LABELS: Record<string, string> = {
  parking: "Car park",
  fuel: "Petrol station",
  rest_area: "Rest area",
  parking_space: "Parking bay",
  parking_entrance: "Parking entrance",
}

async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  if (!LOCATIONIQ_API_KEY) return null
  try {
    const res = await fetch(
      `https://us1.locationiq.com/v1/reverse?key=${LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lon}&format=json`,
    )
    if (!res.ok) return null
    const data = await res.json()
    const parts: string[] = []
    if (data.address?.road) {
      const houseNum = data.address?.house_number
      parts.push(houseNum ? `${houseNum} ${data.address.road}` : data.address.road)
    }
    return parts.length > 0 ? parts.join(", ") : null
  } catch {
    return null
  }
}

export async function findPulloverSpots(
  lat: number,
  lon: number,
  radiusMeters = 2000,
  limit = 2,
): Promise<PulloverSpot[]> {
  const query = `
[out:json][timeout:10];
(
  nwr["amenity"="parking"](around:${radiusMeters},${lat},${lon});
  nwr["highway"="rest_area"](around:${radiusMeters},${lat},${lon});
  nwr["amenity"="fuel"](around:${radiusMeters},${lat},${lon});
);
out center tags;
`

  const res = await fetch(OVERPASS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
  })

  if (!res.ok) {
    console.error("[Overpass] HTTP", res.status)
    return []
  }

  const data = (await res.json()) as {
    elements: Array<{
      tags?: Record<string, string>
      lat?: number
      lon?: number
      center?: { lat: number; lon: number }
    }>
  }

  const rawSpots = data.elements
    .map((el) => {
      const elLat = el.lat ?? el.center?.lat
      const elLon = el.lon ?? el.center?.lon
      if (!elLat || !elLon || !el.tags) return null

      const dist = haversineMeters(lat, lon, elLat, elLon)
      const dir = compassDirection(bearing(lat, lon, elLat, elLon))
      const distLabel =
        dist < 1000
          ? `${Math.round(dist)}m`
          : `${(dist / 1000).toFixed(1)}km`

      const street = el.tags["addr:street"]
      const houseNum = el.tags["addr:housenumber"]
      const streetAddr = street
        ? houseNum
          ? `${houseNum} ${street}`
          : street
        : null

      const spotName = el.tags.name ?? AMENITY_LABELS[el.tags.amenity ?? el.tags.highway ?? ""] ?? "Parking area"

      return {
        name: spotName,
        type: el.tags.amenity ?? el.tags.highway ?? "parking",
        lat: elLat,
        lon: elLon,
        distanceMeters: Math.round(dist),
        distanceLabel: `${distLabel} ${dir}`,
        osmAddress: streetAddr,
      }
    })
    .filter(Boolean) as Array<{
      name: string
      type: string
      lat: number
      lon: number
      distanceMeters: number
      distanceLabel: string
      osmAddress: string | null
    }>

  rawSpots.sort((a, b) => a.distanceMeters - b.distanceMeters)
  const topSpots = rawSpots.slice(0, limit)

  const spotsWithAddresses = await Promise.all(
    topSpots.map(async (spot) => {
      const geocodedAddress = await reverseGeocode(spot.lat, spot.lon)
      return {
        name: spot.name,
        type: spot.type,
        lat: spot.lat,
        lon: spot.lon,
        distanceMeters: spot.distanceMeters,
        distanceLabel: spot.distanceLabel,
        address: geocodedAddress ?? spot.osmAddress,
      } satisfies PulloverSpot
    }),
  )

  return spotsWithAddresses
}
