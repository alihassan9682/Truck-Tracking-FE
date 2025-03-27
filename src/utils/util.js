// Simple function to conditionally join class names
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Geocode a location string to coordinates using OpenStreetMap Nominatim API
export async function geocodeLocation(location) {
  if (!location || location.trim() === "") {
    return null;
  }

  try {
    // Use OpenStreetMap's Nominatim API to geocode the location
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        location
      )}&limit=1`,
      {
        headers: {
          "Accept-Language": "en-US,en",
          "User-Agent": "TruckDriverLogApp/1.0",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Geocoding failed with status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      return [Number.parseFloat(result.lat), Number.parseFloat(result.lon)];
    }

    // If no results found, fall back to the mock data
    console.warn(
      `No geocoding results found for: ${location}. Using fallback data.`
    );
    return getFallbackCoordinates(location);
  } catch (error) {
    console.error(`Error geocoding location "${location}":`, error);
    // Fall back to mock data in case of error
    return getFallbackCoordinates(location);
  }
}

// Fallback function that returns mock coordinates for common US cities
function getFallbackCoordinates(location) {
  // Mock coordinates for common US cities
  const mockCoordinates = {
    chicago: [41.8781, -87.6298],
    "chicago, il": [41.8781, -87.6298],
    "new york": [40.7128, -74.006],
    "new york, ny": [40.7128, -74.006],
    "los angeles": [34.0522, -118.2437],
    "los angeles, ca": [34.0522, -118.2437],
    houston: [29.7604, -95.3698],
    "houston, tx": [29.7604, -95.3698],
    phoenix: [33.4484, -112.074],
    "phoenix, az": [33.4484, -112.074],
    philadelphia: [39.9526, -75.1652],
    "philadelphia, pa": [39.9526, -75.1652],
    "san antonio": [29.4241, -98.4936],
    "san antonio, tx": [29.4241, -98.4936],
    "san diego": [32.7157, -117.1611],
    "san diego, ca": [32.7157, -117.1611],
    dallas: [32.7767, -96.797],
    "dallas, tx": [32.7767, -96.797],
    "san jose": [37.3382, -121.8863],
    "san jose, ca": [37.3382, -121.8863],
    austin: [30.2672, -97.7431],
    "austin, tx": [30.2672, -97.7431],
    indianapolis: [39.7684, -86.1581],
    "indianapolis, in": [39.7684, -86.1581],
    jacksonville: [30.3322, -81.6557],
    "jacksonville, fl": [30.3322, -81.6557],
    columbus: [39.9612, -82.9988],
    "columbus, oh": [39.9612, -82.9988],
    "fort worth": [32.7555, -97.3308],
    "fort worth, tx": [32.7555, -97.3308],
    charlotte: [35.2271, -80.8431],
    "charlotte, nc": [35.2271, -80.8431],
    detroit: [42.3314, -83.0458],
    "detroit, mi": [42.3314, -83.0458],
    "el paso": [31.7619, -106.485],
    "el paso, tx": [31.7619, -106.485],
    memphis: [35.1495, -90.049],
    "memphis, tn": [35.1495, -90.049],
    seattle: [47.6062, -122.3321],
    "seattle, wa": [47.6062, -122.3321],
    denver: [39.7392, -104.9903],
    "denver, co": [39.7392, -104.9903],
    washington: [38.9072, -77.0369],
    "washington, dc": [38.9072, -77.0369],
    boston: [42.3601, -71.0589],
    "boston, ma": [42.3601, -71.0589],
    nashville: [36.1627, -86.7816],
    "nashville, tn": [36.1627, -86.7816],
    baltimore: [39.2904, -76.6122],
    "baltimore, md": [39.2904, -76.6122],
    "oklahoma city": [35.4676, -97.5164],
    "oklahoma city, ok": [35.4676, -97.5164],
    portland: [45.5051, -122.675],
    "portland, or": [45.5051, -122.675],
    "las vegas": [36.1699, -115.1398],
    "las vegas, nv": [36.1699, -115.1398],
    milwaukee: [43.0389, -87.9065],
    "milwaukee, wi": [43.0389, -87.9065],
    albuquerque: [35.0844, -106.6504],
    "albuquerque, nm": [35.0844, -106.6504],
    tucson: [32.2226, -110.9747],
    "tucson, az": [32.2226, -110.9747],
    fresno: [36.7378, -119.7871],
    "fresno, ca": [36.7378, -119.7871],
    sacramento: [38.5816, -121.4944],
    "sacramento, ca": [38.5816, -121.4944],
    "kansas city": [39.0997, -94.5786],
    "kansas city, mo": [39.0997, -94.5786],
    mesa: [33.4152, -111.8315],
    "mesa, az": [33.4152, -111.8315],
    atlanta: [33.749, -84.388],
    "atlanta, ga": [33.749, -84.388],
    omaha: [41.2565, -95.9345],
    "omaha, ne": [41.2565, -95.9345],
    "colorado springs": [38.8339, -104.8214],
    "colorado springs, co": [38.8339, -104.8214],
    raleigh: [35.7796, -78.6382],
    "raleigh, nc": [35.7796, -78.6382],
    miami: [25.7617, -80.1918],
    "miami, fl": [25.7617, -80.1918],
    cleveland: [41.4993, -81.6944],
    "cleveland, oh": [41.4993, -81.6944],
    tulsa: [36.154, -95.9928],
    "tulsa, ok": [36.154, -95.9928],
    oakland: [37.8044, -122.2712],
    "oakland, ca": [37.8044, -122.2712],
    minneapolis: [44.9778, -93.265],
    "minneapolis, mn": [44.9778, -93.265],
    wichita: [37.6872, -97.3301],
    "wichita, ks": [37.6872, -97.3301],
    arlington: [32.7357, -97.1081],
    "arlington, tx": [32.7357, -97.1081],
  };

  // Try to find the location in our mock data
  const normalizedLocation = location.toLowerCase().trim();

  // Check for exact match
  if (mockCoordinates[normalizedLocation]) {
    return mockCoordinates[normalizedLocation];
  }

  // Check for partial match
  for (const [key, coords] of Object.entries(mockCoordinates)) {
    if (normalizedLocation.includes(key) || key.includes(normalizedLocation)) {
      return coords;
    }
  }

  // If no match found, generate random coordinates in the continental US
  const lat = 37 + Math.random() * 8 - 4;
  const lng = -98 + Math.random() * 20 - 10;

  return [lat, lng];
}

// Calculate the distance between two coordinates using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

// Generate route coordinates between two points
function generateRouteCoordinates(start, end, numPoints = 10) {
  const coordinates = [start];

  for (let i = 1; i < numPoints - 1; i++) {
    const ratio = i / numPoints;

    // Add some randomness to make it look like a real route
    const jitterLat = (Math.random() - 0.5) * 0.5;
    const jitterLng = (Math.random() - 0.5) * 0.5;

    const lat = start[0] + ratio * (end[0] - start[0]) + jitterLat;
    const lng = start[1] + ratio * (end[1] - start[1]) + jitterLng;

    coordinates.push([lat, lng]);
  }

  coordinates.push(end);
  return coordinates;
}

// Calculate route information based on trip details
export async function calculateRouteInfo(tripDetails) {
  // Geocode locations
  const startCoords = await geocodeLocation(tripDetails.currentLocation);
  const pickupCoords = await geocodeLocation(tripDetails.pickupLocation);
  const dropoffCoords = await geocodeLocation(tripDetails.dropoffLocation);

  // Calculate distances
  let totalDistance = 0;
  let totalDuration = 0;

  if (startCoords && pickupCoords) {
    const distance1 = calculateDistance(
      startCoords[0],
      startCoords[1],
      pickupCoords[0],
      pickupCoords[1]
    );
    totalDistance += distance1;
    totalDuration += distance1 / 55; // Assuming average speed of 55 mph
  }

  if (pickupCoords && dropoffCoords) {
    const distance2 = calculateDistance(
      pickupCoords[0],
      pickupCoords[1],
      dropoffCoords[0],
      dropoffCoords[1]
    );
    totalDistance += distance2;
    totalDuration += distance2 / 55; // Assuming average speed of 55 mph
  }

  // Add 1 hour each for pickup and dropoff
  totalDuration += 2;

  // Generate rest stops (assuming 11-hour driving limit per day)
  const restStops = [];
  let currentDistance = 0;
  let drivingHours = 0;

  // First leg: Start to Pickup
  if (startCoords && pickupCoords) {
    const distance = calculateDistance(
      startCoords[0],
      startCoords[1],
      pickupCoords[0],
      pickupCoords[1]
    );
    const drivingTime = distance / 55;

    drivingHours += drivingTime;
    currentDistance += distance;

    // If driving time exceeds 8 hours, add a rest stop
    if (drivingTime > 8) {
      const restRatio = 8 / drivingTime;
      const restLat =
        startCoords[0] + restRatio * (pickupCoords[0] - startCoords[0]);
      const restLng =
        startCoords[1] + restRatio * (pickupCoords[1] - startCoords[1]);

      restStops.push({
        location: "Rest Stop",
        coordinates: [restLat, restLng],
        distanceFromStart: 8 * 55, // 8 hours of driving at 55 mph
        duration: 10, // 10-hour rest period
      });

      drivingHours = drivingTime - 8;
    }
  }

  // Second leg: Pickup to Dropoff
  if (pickupCoords && dropoffCoords) {
    const distance = calculateDistance(
      pickupCoords[0],
      pickupCoords[1],
      dropoffCoords[0],
      dropoffCoords[1]
    );
    const drivingTime = distance / 55;

    // If total driving hours would exceed 11, add rest stops
    const remainingDrivingHours = 11 - drivingHours;

    if (drivingTime > remainingDrivingHours) {
      // How many full rest periods are needed
      const fullRestPeriods = Math.floor(
        (drivingTime - remainingDrivingHours) / 11
      );
      const partialRestHours = (drivingTime - remainingDrivingHours) % 11;

      let distanceCovered = currentDistance + remainingDrivingHours * 55;

      // Add full rest periods
      for (let i = 0; i < fullRestPeriods; i++) {
        const ratio = (distanceCovered - currentDistance) / distance;
        const restLat =
          pickupCoords[0] + ratio * (dropoffCoords[0] - pickupCoords[0]);
        const restLng =
          pickupCoords[1] + ratio * (dropoffCoords[1] - pickupCoords[1]);

        restStops.push({
          location: `Rest Stop ${restStops.length + 1}`,
          coordinates: [restLat, restLng],
          distanceFromStart: distanceCovered,
          duration: 10, // 10-hour rest period
        });

        distanceCovered += 11 * 55; // 11 more hours of driving
      }

      // Add final partial rest if needed
      if (partialRestHours > 0) {
        const ratio = (distanceCovered - currentDistance) / distance;
        const restLat =
          pickupCoords[0] + ratio * (dropoffCoords[0] - pickupCoords[0]);
        const restLng =
          pickupCoords[1] + ratio * (dropoffCoords[1] - pickupCoords[1]);

        restStops.push({
          location: `Rest Stop ${restStops.length + 1}`,
          coordinates: [restLat, restLng],
          distanceFromStart: distanceCovered,
          duration: 10, // 10-hour rest period
        });
      }
    }
  }

  // Generate route coordinates
  let routeCoordinates = [];

  if (startCoords && pickupCoords && dropoffCoords) {
    const leg1 = generateRouteCoordinates(startCoords, pickupCoords, 10);
    const leg2 = generateRouteCoordinates(pickupCoords, dropoffCoords, 10);

    routeCoordinates = [...leg1, ...leg2.slice(1)];
  }

  return {
    startLocation: tripDetails.currentLocation,
    pickupLocation: tripDetails.pickupLocation,
    dropoffLocation: tripDetails.dropoffLocation,
    startCoords,
    pickupCoords,
    dropoffCoords,
    totalDistance,
    totalDuration,
    restStops,
    routeCoordinates,
  };
}

// Generate log entries based on trip details and route info
export function generateLogEntries(tripDetails, routeInfo) {
  const logEntries = [];
  const totalDays = Math.ceil(routeInfo.totalDuration / 14); // Assuming max 14 hours of work per day

  let remainingDistance = routeInfo.totalDistance;
  const currentDate = new Date();
  let currentLocation = tripDetails.currentLocation;

  for (let day = 0; day < totalDays; day++) {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + day);

    // Calculate how much distance is covered this day
    const distanceToday = Math.min(remainingDistance, 550); // Max ~550 miles per day (10 hours at 55 mph)
    remainingDistance -= distanceToday;

    // Determine to location for this day
    let toLocation = "";
    if (remainingDistance <= 0) {
      toLocation = tripDetails.dropoffLocation;
    } else if (
      day === 0 &&
      distanceToday <
        calculateDistance(
          routeInfo.startCoords?.[0] || 0,
          routeInfo.startCoords?.[1] || 0,
          routeInfo.pickupCoords?.[0] || 0,
          routeInfo.pickupCoords?.[1] || 0
        )
    ) {
      toLocation = "En route to " + tripDetails.pickupLocation;
    } else if (routeInfo.restStops.length > day) {
      toLocation = routeInfo.restStops[day].location;
    } else {
      toLocation = "En route to " + tripDetails.dropoffLocation;
    }

    // Generate hours grid
    const hours = {
      offDuty: Array(24).fill(false),
      sleeperBerth: Array(24).fill(false),
      driving: Array(24).fill(false),
      onDuty: Array(24).fill(false),
    };

    // Fill in hours (simplified example)
    // Assume driver starts at 6 AM
    const startHour = 6;

    // Off duty hours (before starting and after ending work)
    for (let i = 0; i < startHour; i++) {
      hours.offDuty[i] = true;
    }

    // Driving hours (assume 10 hours max)
    const drivingHours = Math.min(10, distanceToday / 55);
    for (let i = 0; i < Math.floor(drivingHours); i++) {
      hours.driving[startHour + i] = true;
    }

    // On duty not driving (loading/unloading, inspections, etc.)
    const onDutyHours = Math.min(4, 14 - drivingHours); // Max 14 hours on duty total
    for (let i = 0; i < Math.floor(onDutyHours); i++) {
      hours.onDuty[startHour + Math.floor(drivingHours) + i] = true;
    }

    // Sleeper berth hours (after work)
    const sleepStartHour =
      startHour + Math.floor(drivingHours) + Math.floor(onDutyHours);
    for (let i = sleepStartHour; i < Math.min(24, sleepStartHour + 10); i++) {
      hours.sleeperBerth[i] = true;
    }

    // Fill in remaining hours as off duty
    for (let i = 0; i < 24; i++) {
      if (!hours.driving[i] && !hours.onDuty[i] && !hours.sleeperBerth[i]) {
        hours.offDuty[i] = true;
      }
    }

    // Generate recap data
    const recap = {
      hoursToday: drivingHours + onDutyHours,
      totalOnDuty: onDutyHours,
      totalOffDuty: 24 - (drivingHours + onDutyHours),
      totalDriving: drivingHours,
    };

    // Generate remarks
    let remarks = `Day ${day + 1} of trip. `;

    if (day === 0) {
      remarks += `Departed from ${tripDetails.currentLocation}. `;
    }

    if (distanceToday > 0) {
      remarks += `Drove ${distanceToday.toFixed(1)} miles. `;
    }

    if (remainingDistance <= 0 && day === totalDays - 1) {
      remarks += `Arrived at final destination: ${tripDetails.dropoffLocation}.`;
    } else if (routeInfo.restStops.length > day) {
      remarks += `Stopped for required rest period.`;
    }

    // Create log entry
    const logEntry = {
      date,
      fromLocation: currentLocation,
      toLocation,
      milesDriven: distanceToday,
      totalMileage: routeInfo.totalDistance - remainingDistance,
      hours,
      remarks,
      bolNumber: `BOL-${Math.floor(1000000 + Math.random() * 9000000)}`,
      shipperCommodity: "General Freight",
      recap,
    };

    logEntries.push(logEntry);

    // Update current location for next day
    currentLocation = toLocation;
  }

  return logEntries;
}
