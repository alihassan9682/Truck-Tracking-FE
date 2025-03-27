"use client"

import { useEffect, useState } from "react"
import { MapPin, Navigation, Truck, Fuel, Utensils, Info } from "lucide-react"
import axios from "axios"
import Button from "../../ui/button"
import { Card, CardHeader, CardContent, CardTitle } from "../../ui/card"
import MapComponent from "./map-component"

export default function RouteMap({ routeInfo }) {
    const [mapLayers, setMapLayers] = useState({
        gasStations: false,
        restAreas: false,
        distances: true,
    })

    const [gasStations, setGasStations] = useState([])
    const [restAreas, setRestAreas] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    // Fetch POIs from Overpass API
    const fetchPOIsAlongRoute = async () => {
        if (!routeInfo || !routeInfo.startCoords || !routeInfo.dropoffCoords) return

        setIsLoading(true)
        setError(null)

        try {
            // Create a bounding box around the route
            const minLat = Math.min(routeInfo.startCoords[0], routeInfo.pickupCoords?.[0] || 0, routeInfo.dropoffCoords[0])
            const minLon = Math.min(routeInfo.startCoords[1], routeInfo.pickupCoords?.[1] || 0, routeInfo.dropoffCoords[1])
            const maxLat = Math.max(routeInfo.startCoords[0], routeInfo.pickupCoords?.[0] || 0, routeInfo.dropoffCoords[0])
            const maxLon = Math.max(routeInfo.startCoords[1], routeInfo.pickupCoords?.[1] || 0, routeInfo.dropoffCoords[1])

            // Add some padding to the bounding box
            const padding = 0.5 // degrees - increased for better coverage
            const bbox = [minLat - padding, minLon - padding, maxLat + padding, maxLon + padding]

            // Query gas stations and rest areas within the bounding box
            const overpassUrl = "https://overpass-api.de/api/interpreter"
            const query = `
        [out:json];
        (
          node["amenity"="fuel"](${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]});
          node["highway"="rest_area"](${bbox[0]},${bbox[1]},${bbox[2]},${bbox[3]});
        );
        out body;
        >;
        out skel qt;
      `

            const response = await axios.get(overpassUrl, { params: { data: query } })
            const pois = response.data.elements

            // Process gas stations
            const gasStationsFromAPI = pois
                .filter((poi) => poi.tags?.amenity === "fuel")
                .map((poi) => ({
                    coordinates: [poi.lat, poi.lon],
                    name: poi.tags?.name || "Gas Station",
                    brand: poi.tags?.brand || "Unknown",
                    price: (3.5 + Math.random() * 0.8).toFixed(2), // Random price between $3.50 and $4.30
                    amenities: poi.tags?.amenities || [],
                    type: "gas_station",
                }))

            // Process rest areas
            const restAreasFromAPI = pois
                .filter((poi) => poi.tags?.highway === "rest_area")
                .map((poi) => ({
                    coordinates: [poi.lat, poi.lon],
                    name: poi.tags?.name || "Rest Area",
                    amenities: ["Restrooms", "Parking"],
                    type: "rest_area",
                }))

            // If we don't have enough POIs from the API, supplement with calculated ones
            const calculatedGasStations = calculateGasStations(routeInfo.routeCoordinates, routeInfo.totalDistance)
            const calculatedRestAreas = calculateRestAreas(routeInfo.routeCoordinates, routeInfo.totalDistance)

            setGasStations(
                gasStationsFromAPI.length > 0
                    ? gasStationsFromAPI.slice(0, 10) // Limit to 10 to avoid overcrowding
                    : calculatedGasStations,
            )

            setRestAreas(
                restAreasFromAPI.length > 0
                    ? restAreasFromAPI.slice(0, 5) // Limit to 5 to avoid overcrowding
                    : calculatedRestAreas,
            )
        } catch (error) {
            console.error("Error fetching POIs:", error)
            setError("Failed to fetch points of interest. Using calculated data instead.")

            // Fallback to calculated data
            const calculatedGasStations = calculateGasStations(routeInfo.routeCoordinates, routeInfo.totalDistance)
            const calculatedRestAreas = calculateRestAreas(routeInfo.routeCoordinates, routeInfo.totalDistance)

            setGasStations(calculatedGasStations)
            setRestAreas(calculatedRestAreas)
        } finally {
            setIsLoading(false)
        }
    }

    // Calculate gas station locations based on route
    const calculateGasStations = (routeCoordinates, totalDistance) => {
        // Assume a truck can go about 300 miles on a tank of gas
        const stations = []
        const interval = 300 // miles

        if (!routeCoordinates || routeCoordinates.length < 2) return []

        // Calculate total segments
        const numSegments = Math.ceil(totalDistance / interval)

        // Place gas stations at regular intervals
        for (let i = 1; i <= numSegments; i++) {
            const ratio = (i * interval) / totalDistance
            if (ratio >= 1) break // Don't go beyond the route

            // Find the closest point on the route
            const pointIndex = Math.floor(ratio * (routeCoordinates.length - 1))
            const point = routeCoordinates[pointIndex]

            // Add some randomness to make it look realistic
            const jitterLat = (Math.random() - 0.5) * 0.05
            const jitterLng = (Math.random() - 0.5) * 0.05

            stations.push({
                coordinates: [point[0] + jitterLat, point[1] + jitterLng],
                distance: i * interval,
                name: `Gas Station ${i}`,
                price: (3.5 + Math.random() * 0.8).toFixed(2), // Random gas price between $3.50 and $4.30
            })
        }

        return stations
    }

    // Calculate rest areas based on route
    const calculateRestAreas = (routeCoordinates, totalDistance) => {
        // Place rest areas every ~150 miles
        const areas = []
        const interval = 150 // miles

        if (!routeCoordinates || routeCoordinates.length < 2) return []

        // Calculate total segments
        const numSegments = Math.ceil(totalDistance / interval)

        // Place rest areas at regular intervals
        for (let i = 1; i <= numSegments; i++) {
            const ratio = (i * interval) / totalDistance
            if (ratio >= 1) break // Don't go beyond the route

            // Find the closest point on the route
            const pointIndex = Math.floor(ratio * (routeCoordinates.length - 1))
            const point = routeCoordinates[pointIndex]

            // Add some randomness to make it look realistic
            const jitterLat = (Math.random() - 0.5) * 0.05
            const jitterLng = (Math.random() - 0.5) * 0.05

            areas.push({
                coordinates: [point[0] + jitterLat, point[1] + jitterLng],
                distance: i * interval,
                name: `Rest Area ${i}`,
                amenities: [
                    "Restrooms",
                    "Vending",
                    Math.random() > 0.5 ? "Food" : null,
                    Math.random() > 0.7 ? "Shower" : null,
                ].filter(Boolean),
            })
        }

        return areas
    }

    useEffect(() => {
        fetchPOIsAlongRoute()
    }, [routeInfo])

    const toggleMapLayer = (layer) => {
        setMapLayers((prev) => ({
            ...prev,
            [layer]: !prev[layer],
        }))
    }

    return (
        <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50">
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-[#2563eb]" />
                        Route Map
                    </CardTitle>
                    <div className="flex space-x-2">
                        <Button
                            variant={mapLayers.gasStations ? "default" : "outline"}
                            onClick={() => toggleMapLayer("gasStations")}
                            className="flex items-center"
                        >
                            <Fuel className="h-4 w-4 mr-1" />
                            Gas Stations
                        </Button>

                        <Button
                            variant={mapLayers.restAreas ? "default" : "outline"}
                            onClick={() => toggleMapLayer("restAreas")}
                            className="flex items-center"
                        >
                            <Utensils className="h-4 w-4 mr-1" />
                            Rest Areas
                        </Button>

                        <Button
                            variant={mapLayers.distances ? "default" : "outline"}
                            onClick={() => toggleMapLayer("distances")}
                            className="flex items-center"
                        >
                            <Info className="h-4 w-4 mr-1" />
                            Distances
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <div className="h-[500px] w-full">
                <MapComponent
                    routeInfo={routeInfo}
                    gasStations={mapLayers.gasStations ? gasStations : []}
                    restAreas={mapLayers.restAreas ? restAreas : []}
                    showDistances={mapLayers.distances}
                />
            </div>
            <CardContent className="p-0">
                {/* Route Details - Moved to the top before the map */}
                <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <h3 className="font-medium text-lg border-b pb-2">Route Details</h3>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                                    <div className="bg-[#16a34a] p-2 rounded-full">
                                        <MapPin className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Start</p>
                                        <p className="text-sm">{routeInfo.startLocation}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                                    <div className="bg-[#2563eb] p-2 rounded-full">
                                        <Truck className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Pickup</p>
                                        <p className="text-sm">{routeInfo.pickupLocation}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                                    <div className="bg-[#dc2626] p-2 rounded-full">
                                        <Navigation className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Dropoff</p>
                                        <p className="text-sm">{routeInfo.dropoffLocation}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-md">
                                <h3 className="font-medium mb-2">Trip Statistics</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <p className="font-medium">Total Distance:</p>
                                        <p>{routeInfo.totalDistance.toFixed(1)} miles</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">Estimated Duration:</p>
                                        <p>{routeInfo.totalDuration.toFixed(1)} hours</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">Avg. Speed:</p>
                                        <p>55 mph</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">Fuel Stops:</p>
                                        <p>{Math.ceil(routeInfo.totalDistance / 300)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#dbeafe] p-3 rounded-md">
                                <h3 className="font-medium mb-2 flex items-center">
                                    <Fuel className="h-4 w-4 mr-2 text-[#2563eb]" />
                                    Fuel Information
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <p>
                                        <span className="font-medium">Estimated Fuel:</span> {(routeInfo.totalDistance / 6.5).toFixed(1)}{" "}
                                        gallons
                                    </p>
                                    <p>
                                        <span className="font-medium">Avg. Fuel Economy:</span> 6.5 mpg
                                    </p>
                                    <p>
                                        <span className="font-medium">Est. Fuel Cost:</span> $
                                        {((routeInfo.totalDistance / 6.5) * 3.85).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="font-medium text-lg border-b pb-2">Rest Stops</h3>

                            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                                {routeInfo.restStops.length > 0 ? (
                                    routeInfo.restStops.map((stop, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-2 p-3 border rounded-md hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="bg-[#eab308] p-2 rounded-full flex-shrink-0">
                                                <Utensils className="h-4 w-4 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{stop.location}</p>
                                                <p className="text-xs text-gray-500">
                                                    After {stop.distanceFromStart.toFixed(1)} miles • {stop.duration} hour rest
                                                </p>
                                                <p className="text-xs mt-1">
                                                    Approximately {(stop.distanceFromStart / 55).toFixed(1)} hours of driving
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex items-center justify-center p-4 border rounded-md bg-gray-50">
                                        <p className="text-sm text-gray-500">No rest stops required for this route</p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-[#dbeafe] p-3 rounded-md">
                                <h3 className="font-medium mb-2">Driving Regulations</h3>
                                <ul className="text-xs space-y-1 list-disc pl-4">
                                    <li>Maximum 11 hours driving after 10 consecutive hours off duty</li>
                                    <li>14-hour on-duty limit after coming on duty following 10+ hours off duty</li>
                                    <li>30-minute break required after 8 hours of driving</li>
                                    <li>60/70-hour limit in 7/8 consecutive days</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>



                {isLoading && (
                    <div className="p-4 flex justify-center">
                        <div className="flex items-center space-x-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-[#2563eb] border-r-transparent"></div>
                            <p className="text-sm text-gray-600">Loading points of interest...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 m-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

