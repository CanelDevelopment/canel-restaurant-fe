export const getDistanceInKm = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
) => {
  const url = `${import.meta.env.VITE_BACKEND_URL}/api/branch/distance?origin=${
    origin.lat
  },${origin.lng}&destination=${destination.lat},${destination.lng}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (
      data.rows &&
      data.rows[0].elements[0].distance &&
      data.rows[0].elements[0].distance.value
    ) {
      return data.rows[0].elements[0].distance.value / 1000;
    }

    console.log("res", data);

    return 0;
  } catch (error) {
    console.error("Distance API error:", error);
    return 0;
  }
};
interface DeliveryTier {
  min: number;
  max: number;
  price: number;
}

export const getDeliveryPrice = (distanceInKm: number, rates: any): number => {
  let tierData: DeliveryTier[] = [];

  try {
    if (typeof rates === "string") {
      tierData = JSON.parse(rates);
    } else if (Array.isArray(rates)) {
      tierData = rates;
    } else if (typeof rates === "number") {
      // If the rate is a flat number per km (e.g., 5 per km)
      return Math.ceil(distanceInKm * rates);
    }
  } catch (error) {
    console.error("Error parsing delivery rates", error);
    return 0;
  }

  // 1. Sort by min distance to ensure order
  tierData.sort((a, b) => a.min - b.min);

  // 2. Strict Match: Distance must be >= min AND <= max
  // Example: Distance 1.5 matches the 1-4 tier, but not 0-1
  const match = tierData.find(
    (tier) => distanceInKm >= tier.min && distanceInKm <= tier.max
  );

  if (match) {
    return match.price;
  }

  // 3. Fallback: If distance > highest max, decide what to do.
  // Current logic: Charge the highest tier price.
  if (tierData.length > 0) {
    const lastTier = tierData[tierData.length - 1];
    if (distanceInKm > lastTier.max) {
      return lastTier.price;
      // OR return 0 if you don't want to deliver that far
    }
  }

  return 0;
};

export const getCoordinatesFromAddress = async (address: string) => {
  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${
      import.meta.env.VITE_GOOGLE_MAP_KEY
    }`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};
