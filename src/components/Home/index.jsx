import { useEffect, useState } from "react"
import TripForm from "../common/tripform/tripForm"
import RouteMap from "../common/routemap/route-map"
import DailyLogSheet from "../common/log-sheet/daily-log-sheet"
import LogDetailsForm from "../common/log-detials-form/log-details-form"
import { calculateRouteInfo } from "../../utils/util"
import Button from "../ui/button"
import { Card } from "../ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
export default function Home() {
    const [tripDetails, setTripDetails] = useState(null)
    const [routeInfo, setRouteInfo] = useState(null)
    const { auth } = useSelector((state) => state.user)
    const naviagtion = useNavigate()
    const [logEntries, setLogEntries] = useState([])
    const [activeTab, setActiveTab] = useState("form")
    const [isLoading, setIsLoading] = useState(false)

    const handleTripSubmit = async (details) => {
        setIsLoading(true)
        setTripDetails(details)

        try {
            // Calculate route information
            const routeData = await calculateRouteInfo(details)
            setRouteInfo(routeData)

            // Switch to map tab
            setActiveTab("map")
        } catch (error) {
            console.error("Error processing trip details:", error)
            alert("There was an error processing your trip details. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogSubmit = (logEntry) => {
        setLogEntries((prev) => [...prev, logEntry])
        setActiveTab("logs")
    }
    return (
        <main className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Truck Driver ELD Log Application</h1>
                    <p className="text-gray-500">Plan your route, track your hours, and generate compliant driver logs</p>
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-4 mb-8">
                        <TabsTrigger
                            value="form"
                            active={activeTab === "form"}
                            onClick={() => setActiveTab("form")}
                            className="text-base py-3"
                        >
                            Trip Details
                        </TabsTrigger>
                        <TabsTrigger
                            value="map"
                            active={activeTab === "map"}
                            onClick={() => setActiveTab("map")}
                            disabled={!routeInfo}
                            className="text-base py-3"
                        >
                            Route Map
                        </TabsTrigger>
                        <TabsTrigger
                            value="log-input"
                            active={activeTab === "log-input"}
                            onClick={() => setActiveTab("log-input")}
                            disabled={!routeInfo}
                            className="text-base py-3"
                        >
                            Log Input
                        </TabsTrigger>
                        <TabsTrigger
                            value="logs"
                            active={activeTab === "logs"}
                            onClick={() => setActiveTab("logs")}
                            disabled={logEntries.length === 0}
                            className="text-base py-3"
                        >
                            Daily Logs
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="form" activeValue={activeTab} className="mt-6">
                        <TripForm onSubmit={handleTripSubmit} />
                    </TabsContent>

                    <TabsContent value="map" activeValue={activeTab} className="mt-6">
                        {routeInfo && (
                            <div className="space-y-6">
                                <Card>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                                        <div>
                                            <h2 className="text-xl font-semibold mb-4">Trip Summary</h2>
                                            <div className="space-y-2">
                                                <p>
                                                    <span className="font-medium">From:</span> {tripDetails?.currentLocation}
                                                </p>
                                                <p>
                                                    <span className="font-medium">To:</span> {tripDetails?.dropoffLocation}
                                                </p>
                                                <p>
                                                    <span className="font-medium">Via:</span> {tripDetails?.pickupLocation}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-md">
                                            <div className="space-y-2">
                                                <p>
                                                    <span className="font-medium">Total Distance:</span> {routeInfo.totalDistance.toFixed(1)}{" "}
                                                    miles
                                                </p>
                                                <p>
                                                    <span className="font-medium">Estimated Duration:</span> {routeInfo.totalDuration.toFixed(1)}{" "}
                                                    hours
                                                </p>
                                                <p>
                                                    <span className="font-medium">Required Logs:</span> {Math.ceil(routeInfo.totalDuration / 14)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <RouteMap routeInfo={routeInfo} />

                                <div className="flex justify-end">
                                    <Button onClick={() => setActiveTab("log-input")} className="px-6">
                                        Enter Log Details
                                    </Button>
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="log-input" activeValue={activeTab} className="mt-6">
                        {routeInfo && <LogDetailsForm tripDetails={tripDetails} onSubmit={handleLogSubmit} />}
                    </TabsContent>

                    <TabsContent value="logs" activeValue={activeTab} className="mt-6">
                        {logEntries.length > 0 && (
                            <div className="space-y-6">
                                <Card>
                                    <div className="p-4">
                                        <h2 className="text-xl font-semibold mb-2">Daily Log Sheets</h2>
                                        <p className="text-gray-500">
                                            You have {logEntries.length} daily log sheets. You can view each log sheet and download them as
                                            PDF.
                                        </p>

                                        <div className="mt-4 flex justify-end">
                                            <Button onClick={() => setActiveTab("log-input")} variant="success">
                                                Add New Log Entry
                                            </Button>
                                        </div>
                                    </div>
                                </Card>

                                {logEntries.map((entry, index) => (
                                    <DailyLogSheet key={index} logEntry={entry} tripDetails={tripDetails} dayNumber={index + 1} />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    )
}

