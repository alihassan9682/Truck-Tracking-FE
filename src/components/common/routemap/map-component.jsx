import { useEffect, useState, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix Leaflet default icon issue
if (typeof window !== "undefined") {
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    })
}

// Custom Leaflet marker icons
const currentLocationIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})

const pickupLocationIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})

const dropoffLocationIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})

// Create custom div icons for gas stations and rest areas
const createGasStationIcon = () => {
    return L.divIcon({
        html: `
      <div style="background-color: #f97316; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="22" x2="15" y2="22"></line>
          <line x1="4" y1="9" x2="14" y2="9"></line>
          <path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"></path>
          <path d="M14 13h2a2 2 0 0 1 2 2v7"></path>
          <path d="M9 9v13"></path>
          <path d="M19 13v9"></path>
        </svg>
      </div>
    `,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    })
}

const createRestAreaIcon = () => {
    return L.divIcon({
        html: `
      <div style="background-color: #8b5cf6; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 3v9"></path>
          <path d="M8 3v9"></path>
          <path d="M4 8h4"></path>
          <path d="M16 3l-4 9"></path>
          <path d="M16 12l4-9"></path>
          <path d="M12 3h8"></path>
        </svg>
      </div>
    `,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });
};

export default function MapComponent({ routeInfo, gasStations, restAreas, showDistances }) {
    const mapRef = useRef(null)
    const mapInstanceRef = useRef(null)
    const [isMapInitialized, setIsMapInitialized] = useState(false)

    // Helper to check if coordinates are valid
    const isValidCoords = (coords) => {
        return (
            Array.isArray(coords) &&
            coords.length === 2 &&
            !isNaN(coords[0]) &&
            !isNaN(coords[1]) &&
            coords[0] !== 0 &&
            coords[1] !== 0
        )
    }

    // Initialize map
    useEffect(() => {
        // Only run this on client side
        if (typeof window === "undefined") return

        // Create map if it doesn't exist
        if (!mapInstanceRef.current && mapRef.current) {
            const defaultCenter = [39.8283, -98.5795] // USA center
            const mapCenter = isValidCoords(routeInfo?.startCoords) ? routeInfo.startCoords : defaultCenter

            // Initialize the map
            mapInstanceRef.current = L.map(mapRef.current, {
                center: mapCenter,
                zoom: 5,
                scrollWheelZoom: true,
            })

            // Add tile layer
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(mapInstanceRef.current)

            setIsMapInitialized(true)
        }

        // Cleanup function
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove()
                mapInstanceRef.current = null
            }
        }
    }, [])

    // Update map when routeInfo changes
    useEffect(() => {
        if (!mapInstanceRef.current || !routeInfo || !isMapInitialized) return

        // Clear existing markers and layers
        mapInstanceRef.current.eachLayer((layer) => {
            if (layer instanceof L.Marker || layer instanceof L.Polyline) {
                mapInstanceRef.current.removeLayer(layer)
            }
        })

        // Add tile layer back if it was removed
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapInstanceRef.current)

        const bounds = []

        // Add markers for start, pickup, and dropoff locations
        if (isValidCoords(routeInfo.startCoords)) {
            L.marker(routeInfo.startCoords, { icon: currentLocationIcon })
                .addTo(mapInstanceRef.current)
                .bindPopup(`<strong>Start Location</strong><p>${routeInfo.startLocation}</p>`)
            bounds.push(routeInfo.startCoords)
        }

        if (isValidCoords(routeInfo.pickupCoords)) {
            L.marker(routeInfo.pickupCoords, { icon: pickupLocationIcon })
                .addTo(mapInstanceRef.current)
                .bindPopup(`<strong>Pickup Location</strong><p>${routeInfo.pickupLocation}</p>`)
            bounds.push(routeInfo.pickupCoords)
        }

        if (isValidCoords(routeInfo.dropoffCoords)) {
            L.marker(routeInfo.dropoffCoords, { icon: dropoffLocationIcon })
                .addTo(mapInstanceRef.current)
                .bindPopup(`<strong>Dropoff Location</strong><p>${routeInfo.dropoffLocation}</p>`)
            bounds.push(routeInfo.dropoffCoords)
        }

        // Add route polyline
        const routePositions = []
        if (isValidCoords(routeInfo.startCoords)) routePositions.push(routeInfo.startCoords)
        if (isValidCoords(routeInfo.pickupCoords)) routePositions.push(routeInfo.pickupCoords)
        if (isValidCoords(routeInfo.dropoffCoords)) routePositions.push(routeInfo.dropoffCoords)

        if (routePositions.length > 1) {
            L.polyline(routePositions, { color: "#2563eb", weight: 3, opacity: 0.7, dashArray: "10, 10" }).addTo(
                mapInstanceRef.current,
            )
        }

        // Add detailed route if available
        if (routeInfo.routeCoordinates && routeInfo.routeCoordinates.length > 1) {
            L.polyline(routeInfo.routeCoordinates, { color: "#2563eb", weight: 5, opacity: 0.8 }).addTo(
                mapInstanceRef.current,
            )
        }

        // Add rest stops
        if (routeInfo.restStops && routeInfo.restStops.length > 0) {
            routeInfo.restStops.forEach((stop, index) => {
                if (isValidCoords(stop.coordinates)) {
                    L.marker(stop.coordinates, { icon: createRestAreaIcon() })
                        .addTo(mapInstanceRef.current)
                        .bindPopup(`
              <div>
                <strong>Rest Stop ${index + 1}</strong>
                <p>After ${stop.distanceFromStart.toFixed(1)} miles</p>
                <p>Duration: ${stop.duration} hours</p>
                <div style="margin-top: 8px; padding: 8px; background-color: #fefce8; border-radius: 4px;">
                  <p style="font-weight: 500; margin: 0;">Required rest period</p>
                  <p style="font-size: 12px; color: #666; margin-top: 4px;">
                    Federal regulations require a 10-hour break after 11 hours of driving
                  </p>
                </div>
              </div>
            `)
                    bounds.push(stop.coordinates)
                }
            })
        }

        // Add gas stations
        if (gasStations && gasStations.length > 0) {
            gasStations.forEach((station) => {
                if (isValidCoords(station.coordinates)) {
                    L.marker(station.coordinates, { icon: createGasStationIcon() })
                        .addTo(mapInstanceRef.current)
                        .bindPopup(`
              <div>
                <strong>${station.name}</strong>
                <p>Diesel: $${station.price}/gal</p>
                ${station.brand ? `<p>Brand: ${station.brand}</p>` : ""}
                ${station.amenities && station.amenities.length > 0
                                ? `
                  <div>
                    <p>Amenities:</p>
                    <ul style="list-style-type: disc; padding-left: 16px; font-size: 12px;">
                      ${station.amenities.map((amenity) => `<li>${amenity}</li>`).join("")}
                    </ul>
                  </div>
                `
                                : ""
                            }
              </div>
            `)
                    bounds.push(station.coordinates)
                }
            })
        }

        // Add rest areas
        if (restAreas && restAreas.length > 0) {
            restAreas.forEach((area) => {
                if (isValidCoords(area.coordinates)) {
                    L.marker(area.coordinates, { icon: createRestAreaIcon() })
                        .addTo(mapInstanceRef.current)
                        .bindPopup(`
              <div>
                <strong>${area.name}</strong>
                ${area.distance ? `<p>At ${area.distance.toFixed(1)} miles</p>` : ""}
                ${area.amenities && area.amenities.length > 0
                                ? `
                  <div>
                    <p>Amenities:</p>
                    <ul style="list-style-type: disc; padding-left: 16px; font-size: 12px;">
                      ${area.amenities.map((amenity) => `<li>${amenity}</li>`).join("")}
                    </ul>
                  </div>
                `
                                : ""
                            }
              </div>
            `)
                    bounds.push(area.coordinates)
                }
            })
        }

        // Add distance markers if enabled
        if (showDistances && routeInfo.routeCoordinates && routeInfo.routeCoordinates.length > 0) {
            const totalPoints = routeInfo.routeCoordinates.length
                ;[0.25, 0.5, 0.75].forEach((fraction) => {
                    const index = Math.floor(totalPoints * fraction)
                    if (index < totalPoints) {
                        const point = routeInfo.routeCoordinates[index]
                        const distance = (routeInfo.totalDistance * fraction).toFixed(1)

                        const customIcon = L.divIcon({
                            html: `<div style="padding: 4px 8px; background-color: white; color: black; font-size: 12px; font-weight: bold; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.2); border: 1px solid #ccc;">
                    ${distance} miles
                  </div>`,
                            className: "",
                            iconSize: [60, 20],
                            iconAnchor: [30, 10],
                        })

                        L.marker(point, { icon: customIcon })
                            .addTo(mapInstanceRef.current)
                            .bindPopup(`<div><strong>Distance:</strong> ${distance} miles</div>`)
                    }
                })
        }

        // Fit map to bounds
        if (bounds.length > 0) {
            try {
                mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] })
            } catch (e) {
                console.error("Error fitting bounds:", e)
                // Fallback to center on first point
                if (bounds[0]) {
                    mapInstanceRef.current.setView(bounds[0], 5)
                }
            }
        }

        // Force a resize event to ensure the map renders correctly
        setTimeout(() => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.invalidateSize()
            }
        }, 100)
    }, [routeInfo, gasStations, restAreas, showDistances, isMapInitialized])

    return <div ref={mapRef} style={{ height: "500px", width: "100%" }} className="leaflet-container" />
}

