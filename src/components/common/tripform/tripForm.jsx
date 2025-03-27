import { useEffect, useState } from "react"
import Button from "../../ui/button"
import Input from "../../ui/input"
import Label from "../../ui/label"
import Select from "../../ui/select"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../../ui/card"
import { postData, fetchData } from "../../../utils/httpFunctions";
import { useSelector } from "react-redux"
export default function TripForm({ onSubmit }) {
    const { userData } = useSelector((state) => state.user)
    const [formData, setFormData] = useState({
        currentLocation: "",
        pickupLocation: "",
        dropoffLocation: "",
        cycleHours: "70",
    })

    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        // Clear error when field is edited
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: null,
            }))
        }
    }
    const getData = async () => {
        const url = "work/locations/"
        const response = await fetchData(url)
        if (!response.success) {
            console.error(response?.error?.message)
            return
        }
        setFormData((prev) => ({
            ...prev,
            currentLocation: response?.data?.data?.currentLocation || "",
            pickupLocation: response?.data?.data?.pickupLocation || "",
            dropoffLocation: response?.data?.data?.dropoffLocation || "",
            cycleHours: response?.data?.data?.cycleHours || "70 Hour / 8 Day",
        }));

        // console.log("Response data:", response?.data?.data)
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.currentLocation || formData.currentLocation.length < 3) {
            newErrors.currentLocation = "Current location is required (min 3 characters)"
        }

        if (!formData.pickupLocation || formData.pickupLocation.length < 3) {
            newErrors.pickupLocation = "Pickup location is required (min 3 characters)"
        }

        if (!formData.dropoffLocation || formData.dropoffLocation.length < 3) {
            newErrors.dropoffLocation = "Dropoff location is required (min 3 characters)"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }
    const handledata = async () => {
        const url = "work/locations/"
        const payload = {
            currentLocation: formData.currentLocation,
            pickupLocation: formData.pickupLocation,
            dropoffLocation: formData.dropoffLocation,
            cycleHours: formData.cycleHours,
            // id: id,
        }
        try {
            const response = await postData(url, payload)
            if (!response.success) {
                console.error(response?.error?.message)
                return
            }
        }
        catch (e) {
            console.log(e)
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault()

        if (validateForm()) {
            onSubmit({
                ...formData,
                cycleHours: Number.parseInt(formData.cycleHours),
                // Add default driver & carrier info for compatibility
                driverName: "Default Driver",
                truckNumber: "TRK-001",
                trailerNumber: "",
                carrierName: "Default Carrier",
                mainOfficeAddress: "123 Main St, Anytown, USA",
                homeTerminal: "Main Terminal, Anytown, USA",
            })
            handledata()
        }
    }
    useEffect(() => {
        getData()
    }, [])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Route Details</CardTitle>
                <CardDescription>Enter your trip information to generate route and daily logs</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentLocation">Current Location</Label>
                            <Input
                                id="currentLocation"
                                name="currentLocation"
                                placeholder="e.g., Chicago, IL"
                                value={formData.currentLocation}
                                onChange={handleChange}
                                className={errors.currentLocation ? "border-red-500" : ""}
                            />
                            {errors.currentLocation && <p className="text-sm text-red-500">{errors.currentLocation}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pickupLocation">Pickup Location</Label>
                            <Input
                                id="pickupLocation"
                                name="pickupLocation"
                                placeholder="e.g., Indianapolis, IN"
                                value={formData.pickupLocation}
                                onChange={handleChange}
                                className={errors.pickupLocation ? "border-red-500" : ""}
                            />
                            {errors.pickupLocation && <p className="text-sm text-red-500">{errors.pickupLocation}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dropoffLocation">Dropoff Location</Label>
                            <Input
                                id="dropoffLocation"
                                name="dropoffLocation"
                                placeholder="e.g., Columbus, OH"
                                value={formData.dropoffLocation}
                                onChange={handleChange}
                                className={errors.dropoffLocation ? "border-red-500" : ""}
                            />
                            {errors.dropoffLocation && <p className="text-sm text-red-500">{errors.dropoffLocation}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cycleHours">Current Cycle Used (Hours)</Label>
                            <Select id="cycleHours" name="cycleHours" value={formData.cycleHours} onChange={handleChange}>
                                <option value="70 Hour / 8 Day">70 Hour / 8 Day</option>
                                <option value="60 Hour / 7 Day">60 Hour / 7 Day</option>
                            </Select>
                            <p className="text-sm text-gray-500">Property-carrying drivers: 70hrs/8days</p>
                        </div>
                    </div>

                    <Button type="submit" className="w-full">
                        Generate Route
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

