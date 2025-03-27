

import { useState } from "react"
import { format } from "date-fns"
import Button from "../../ui/button"
import Input from "../../ui/input"
import Label from "../../ui/label"
import Select from "../../ui/select"
import { useEffect } from "react"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../../ui/card"
import { postData, fetchData } from "../../../utils/httpFunctions";
import { useSelector } from "react-redux"
export default function LogDetailsForm({ tripDetails, onSubmit }) {
    const today = new Date()
    const { userData } = useSelector((state) => state.user)

    // Set default values for the time range selectors
    // const [timeRanges, setTimeRanges] = useState({
    //     offDutyStart: "0",
    //     offDutyEnd: "5",
    //     sleeperBerthStart: "18",
    //     sleeperBerthEnd: "23",
    //     drivingStart: "6",
    //     drivingEnd: "15",
    //     onDutyStart: "16",
    //     onDutyEnd: "17",
    // })

    const [formData, setFormData] = useState({
        date: format(today, "yyyy-MM-dd"),
        fromLocation: tripDetails?.currentLocation || "",
        toLocation: tripDetails?.pickupLocation || "",
        milesDriven: "",
        totalMileage: "",
        remarks: "",
        bolNumber: "",
        shipperCommodity: "",
        driverName: "",
        truckNumber: "",
        trailerNumber: "",
        carrierName: "",
        mainOfficeAddress: "",
        homeTerminal: "",
        hours: {
            offDuty: Array(24).fill(false),
            sleeperBerth: Array(24).fill(false),
            driving: Array(24).fill(false),
            onDuty: Array(24).fill(false),
        },
    })

    const [errors, setErrors] = useState({})
    const getData = async () => {
        const url = "work/driver/"
        const response = await fetchData(url)
        if (response?.success) {
            setFormData((prev) => ({
                ...prev,
                driverName: response?.data?.data?.driverName || "",
                truckNumber: response?.data?.data?.truckNumber || "",
                trailerNumber: response?.data?.data?.trailerNumber || "",
                homeTerminal: response?.data?.data?.homeTerminal || "",
                carrierName: response?.data?.data?.carrierName || "",
                mainOfficeAddress: response?.data?.data?.mainOfficeAddress || "",
                milesDriven: response?.data?.data?.milesDriven || "",
                totalMileage: response?.data?.data?.totalMileage || "",
                shipperCommodity: response?.data?.data?.shipperCommodity || "",
                remarks: response?.data?.data?.remarks || "",
                bolNumber: response?.data?.data?.bolNumber || "",
                fromLocation: response?.data?.data?.fromLocation || "",
                toLocation: response?.data?.data?.toLocation || "",
                date: response?.data?.data?.date || format(today, "yyyy-MM-dd"),

            }))
        }
        // console.log(response.data)
    }
    const handleData = async () => {
        const url = "work/driver/"
        const payload = {
            driverName: formData.driverName,
            truckNumber: formData.truckNumber,
            trailerNumber: formData.trailerNumber,
            homeTerminal: formData.homeTerminal,
            carrierName: formData.carrierName,
            mainOfficeAddress: formData.mainOfficeAddress,
            milesDriven: formData.milesDriven,
            totalMileage: formData.totalMileage,
            shipperCommodity: formData.shipperCommodity,
            remarks: formData.remarks,
        }
        const res = postData(url, payload)
        if (res.success) {
            // console.log("Data submitted successfully")
        } else {
            console.error(res?.error?.message)
        }
    }

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


    const validateForm = () => {
        const newErrors = {}

        if (!formData.fromLocation) {
            newErrors.fromLocation = "From location is required"
        }

        if (!formData.toLocation) {
            newErrors.toLocation = "To location is required"
        }

        if (!formData.milesDriven || isNaN(Number(formData.milesDriven))) {
            newErrors.milesDriven = "Valid miles driven is required"
        }

        if (!formData.totalMileage || isNaN(Number(formData.totalMileage))) {
            newErrors.totalMileage = "Valid total mileage is required"
        }

        if (!formData.driverName) {
            newErrors.driverName = "Driver name is required"
        }

        if (!formData.truckNumber) {
            newErrors.truckNumber = "Truck number is required"
        }

        if (!formData.carrierName) {
            newErrors.carrierName = "Carrier name is required"
        }

        if (!formData.mainOfficeAddress) {
            newErrors.mainOfficeAddress = "Main office address is required"
        }

        if (!formData.homeTerminal) {
            newErrors.homeTerminal = "Home terminal is required"
        }

        // Check if at least one hour status is selected for each hour
        // const hasNoHourStatus = Array(24)
        //     .fill(0)
        //     .some((_, hour) => {
        //         return (
        //             !formData.hours.offDuty[hour] &&
        //             !formData.hours.sleeperBerth[hour] &&
        //             !formData.hours.driving[hour] &&
        //             !formData.hours.onDuty[hour]
        //         )
        //     })

        // if (hasNoHourStatus) {
        //     newErrors.hours = "Each hour must have a status selected"
        // }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validateForm()) {
            // Calculate recap data
            // const drivingHours = formData.hours.driving.filter(Boolean).length
            // const onDutyHours = formData.hours.onDuty.filter(Boolean).length
            // const offDutyHours = formData.hours.offDuty.filter(Boolean).length
            // const sleeperHours = formData.hours.sleeperBerth.filter(Boolean).length

            // const recap = {
            //     hoursToday: drivingHours + onDutyHours,
            //     totalOnDuty: onDutyHours,
            //     totalOffDuty: offDutyHours + sleeperHours,
            //     totalDriving: drivingHours,
            // }

            onSubmit({
                ...formData,
                date: new Date(formData.date),
                milesDriven: Number(formData.milesDriven),
                totalMileage: Number(formData.totalMileage),
                // recap,
            })
            handleData()
        }
    }
    useEffect(() => {
        getData()
    }, [])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Log Details</CardTitle>
                <CardDescription>Enter the details for your daily driver log</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Basic Information</h3>

                            <div className="space-y-2">
                                <Label htmlFor="date">Log Date</Label>
                                <Input
                                    id="date"
                                    name="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className={errors.date ? "border-[#dc2626]" : ""}
                                />
                                {errors.date && <p className="text-sm text-[#dc2626]">{errors.date}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fromLocation">From Location</Label>
                                <Input
                                    id="fromLocation"
                                    name="fromLocation"
                                    placeholder="Starting location"
                                    value={formData.fromLocation}
                                    onChange={handleChange}
                                    className={errors.fromLocation ? "border-[#dc2626]" : ""}
                                />
                                {errors.fromLocation && <p className="text-sm text-[#dc2626]">{errors.fromLocation}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="toLocation">To Location</Label>
                                <Input
                                    id="toLocation"
                                    name="toLocation"
                                    placeholder="Destination"
                                    value={formData.toLocation}
                                    onChange={handleChange}
                                    className={errors.toLocation ? "border-[#dc2626]" : ""}
                                />
                                {errors.toLocation && <p className="text-sm text-[#dc2626]">{errors.toLocation}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="milesDriven">Miles Driven Today</Label>
                                    <Input
                                        id="milesDriven"
                                        name="milesDriven"
                                        type="number"
                                        placeholder="0"
                                        value={formData.milesDriven}
                                        onChange={handleChange}
                                        className={errors.milesDriven ? "border-[#dc2626]" : ""}
                                    />
                                    {errors.milesDriven && <p className="text-sm text-[#dc2626]">{errors.milesDriven}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="totalMileage">Total Mileage</Label>
                                    <Input
                                        id="totalMileage"
                                        name="totalMileage"
                                        type="number"
                                        placeholder="0"
                                        value={formData.totalMileage}
                                        onChange={handleChange}
                                        className={errors.totalMileage ? "border-[#dc2626]" : ""}
                                    />
                                    {errors.totalMileage && <p className="text-sm text-[#dc2626]">{errors.totalMileage}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="remarks">Remarks</Label>
                                <textarea
                                    id="remarks"
                                    name="remarks"
                                    rows={3}
                                    placeholder="Enter any remarks or notes"
                                    value={formData.remarks}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bolNumber">BOL Number</Label>
                                <Input
                                    id="bolNumber"
                                    name="bolNumber"
                                    placeholder="Bill of Lading Number"
                                    value={formData.bolNumber}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="shipperCommodity">Shipper & Commodity</Label>
                                <Input
                                    id="shipperCommodity"
                                    name="shipperCommodity"
                                    placeholder="e.g., ABC Shipping - General Freight"
                                    value={formData.shipperCommodity}
                                    onChange={handleChange}
                                />
                            </div>

                            <h3 className="text-lg font-medium mt-6">Driver & Carrier Information</h3>

                            <div className="space-y-2">
                                <Label htmlFor="driverName">Driver Name</Label>
                                <Input
                                    id="driverName"
                                    name="driverName"
                                    placeholder="Full name"
                                    value={formData.driverName}
                                    onChange={handleChange}
                                    className={errors.driverName ? "border-[#dc2626]" : ""}
                                />
                                {errors.driverName && <p className="text-sm text-[#dc2626]">{errors.driverName}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="truckNumber">Truck Number</Label>
                                    <Input
                                        id="truckNumber"
                                        name="truckNumber"
                                        placeholder="Truck #"
                                        value={formData.truckNumber}
                                        onChange={handleChange}
                                        className={errors.truckNumber ? "border-[#dc2626]" : ""}
                                    />
                                    {errors.truckNumber && <p className="text-sm text-[#dc2626]">{errors.truckNumber}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="trailerNumber">Trailer Number</Label>
                                    <Input
                                        id="trailerNumber"
                                        name="trailerNumber"
                                        placeholder="Trailer # (optional)"
                                        value={formData.trailerNumber}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="carrierName">Name of Carrier</Label>
                                <Input
                                    id="carrierName"
                                    name="carrierName"
                                    placeholder="Company name"
                                    value={formData.carrierName}
                                    onChange={handleChange}
                                    className={errors.carrierName ? "border-[#dc2626]" : ""}
                                />
                                {errors.carrierName && <p className="text-sm text-[#dc2626]">{errors.carrierName}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="mainOfficeAddress">Main Office Address</Label>
                                <Input
                                    id="mainOfficeAddress"
                                    name="mainOfficeAddress"
                                    placeholder="Company address"
                                    value={formData.mainOfficeAddress}
                                    onChange={handleChange}
                                    className={errors.mainOfficeAddress ? "border-[#dc2626]" : ""}
                                />
                                {errors.mainOfficeAddress && <p className="text-sm text-[#dc2626]">{errors.mainOfficeAddress}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="homeTerminal">Home Terminal Address</Label>
                                <Input
                                    id="homeTerminal"
                                    name="homeTerminal"
                                    placeholder="Terminal address"
                                    value={formData.homeTerminal}
                                    onChange={handleChange}
                                    className={errors.homeTerminal ? "border-[#dc2626]" : ""}
                                />
                                {errors.homeTerminal && <p className="text-sm text-[#dc2626]">{errors.homeTerminal}</p>}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Hours of Service</h3>

                            {/* {errors.hours && (
                                <div className="bg-red-50 border-l-4 border-[#dc2626] p-4">
                                    <p className="text-sm text-[#dc2626]">{errors.hours}</p>
                                </div>
                            )} */}

                            {/* <div className="border border-gray-300 rounded-md overflow-hidden">
                                <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
                                    <h4 className="font-medium">Activity Time Ranges</h4>
                                </div>

                                <div className="p-4 space-y-4">
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">1. Off Duty</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="offDutyStart">Start Time</Label>
                                                <Select
                                                    id="offDutyStart"
                                                    name="offDutyStart"
                                                    value={timeRanges.offDutyStart}
                                                    onChange={(e) => {
                                                        const startHour = Number.parseInt(e.target.value)
                                                        const endHour = Number.parseInt(document.getElementById("offDutyEnd").value)

                                                        // Update hours array
                                                        const newHours = { ...formData.hours }
                                                        // Clear all off duty hours first
                                                        newHours.offDuty = Array(24).fill(false)

                                                        // Fill in the selected range
                                                        for (let i = startHour; i <= endHour; i++) {
                                                            // Uncheck other statuses for this hour
                                                            newHours.sleeperBerth[i] = false
                                                            newHours.driving[i] = false
                                                            newHours.onDuty[i] = false
                                                            // Check off duty for this hour
                                                            newHours.offDuty[i] = true
                                                        }

                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            hours: newHours,
                                                        }))

                                                        setTimeRanges((prev) => ({
                                                            ...prev,
                                                            offDutyStart: e.target.value,
                                                        }))
                                                    }}
                                                >
                                                    {Array.from({ length: 24 }).map((_, i) => (
                                                        <option key={i} value={i}>
                                                            {i}:00
                                                        </option>
                                                    ))}
                                                </Select>
                                            </div>
                                            <div>
                                                <Label htmlFor="offDutyEnd">End Time</Label>
                                                <Select
                                                    id="offDutyEnd"
                                                    name="offDutyEnd"
                                                    value={timeRanges.offDutyEnd}
                                                    onChange={(e) => {
                                                        const endHour = Number.parseInt(e.target.value)
                                                        const startHour = Number.parseInt(document.getElementById("offDutyStart").value)

                                                        // Update hours array
                                                        const newHours = { ...formData.hours }
                                                        // Clear all off duty hours first
                                                        newHours.offDuty = Array(24).fill(false)

                                                        // Fill in the selected range
                                                        for (let i = startHour; i <= endHour; i++) {
                                                            // Uncheck other statuses for this hour
                                                            newHours.sleeperBerth[i] = false
                                                            newHours.driving[i] = false
                                                            newHours.onDuty[i] = false
                                                            // Check off duty for this hour
                                                            newHours.offDuty[i] = true
                                                        }

                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            hours: newHours,
                                                        }))

                                                        setTimeRanges((prev) => ({
                                                            ...prev,
                                                            offDutyEnd: e.target.value,
                                                        }))
                                                    }}
                                                >
                                                    {Array.from({ length: 24 }).map((_, i) => (
                                                        <option key={i} value={i}>
                                                            {i}:00
                                                        </option>
                                                    ))}
                                                </Select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">2. Sleeper Berth</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="sleeperBerthStart">Start Time</Label>
                                                <Select
                                                    id="sleeperBerthStart"
                                                    name="sleeperBerthStart"
                                                    value={timeRanges.sleeperBerthStart}
                                                    onChange={(e) => {
                                                        const startHour = Number.parseInt(e.target.value)
                                                        const endHour = Number.parseInt(document.getElementById("sleeperBerthEnd").value)

                                                        // Update hours array
                                                        const newHours = { ...formData.hours }
                                                        // Clear all sleeper berth hours first
                                                        newHours.sleeperBerth = Array(24).fill(false)

                                                        // Fill in the selected range
                                                        for (let i = startHour; i <= endHour; i++) {
                                                            // Uncheck other statuses for this hour
                                                            newHours.offDuty[i] = false
                                                            newHours.driving[i] = false
                                                            newHours.onDuty[i] = false
                                                            // Check sleeper berth for this hour
                                                            newHours.sleeperBerth[i] = true
                                                        }

                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            hours: newHours,
                                                        }))

                                                        setTimeRanges((prev) => ({
                                                            ...prev,
                                                            sleeperBerthStart: e.target.value,
                                                        }))
                                                    }}
                                                >
                                                    {Array.from({ length: 24 }).map((_, i) => (
                                                        <option key={i} value={i}>
                                                            {i}:00
                                                        </option>
                                                    ))}
                                                </Select>
                                            </div>
                                            <div>
                                                <Label htmlFor="sleeperBerthEnd">End Time</Label>
                                                <Select
                                                    id="sleeperBerthEnd"
                                                    name="sleeperBerthEnd"
                                                    value={timeRanges.sleeperBerthEnd}
                                                    onChange={(e) => {
                                                        const endHour = Number.parseInt(e.target.value)
                                                        const startHour = Number.parseInt(document.getElementById("sleeperBerthStart").value)

                                                        // Update hours array
                                                        const newHours = { ...formData.hours }
                                                        // Clear all sleeper berth hours first
                                                        newHours.sleeperBerth = Array(24).fill(false)

                                                        // Fill in the selected range
                                                        for (let i = startHour; i <= endHour; i++) {
                                                            // Uncheck other statuses for this hour
                                                            newHours.offDuty[i] = false
                                                            newHours.driving[i] = false
                                                            newHours.onDuty[i] = false
                                                            // Check sleeper berth for this hour
                                                            newHours.sleeperBerth[i] = true
                                                        }

                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            hours: newHours,
                                                        }))

                                                        setTimeRanges((prev) => ({
                                                            ...prev,
                                                            sleeperBerthEnd: e.target.value,
                                                        }))
                                                    }}
                                                >
                                                    {Array.from({ length: 24 }).map((_, i) => (
                                                        <option key={i} value={i}>
                                                            {i}:00
                                                        </option>
                                                    ))}
                                                </Select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">3. Driving</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="drivingStart">Start Time</Label>
                                                <Select
                                                    id="drivingStart"
                                                    name="drivingStart"
                                                    value={timeRanges.drivingStart}
                                                    onChange={(e) => {
                                                        const startHour = Number.parseInt(e.target.value)
                                                        const endHour = Number.parseInt(document.getElementById("drivingEnd").value)

                                                        // Update hours array
                                                        const newHours = { ...formData.hours }
                                                        // Clear all driving hours first
                                                        newHours.driving = Array(24).fill(false)

                                                        // Fill in the selected range
                                                        for (let i = startHour; i <= endHour; i++) {
                                                            // Uncheck other statuses for this hour
                                                            newHours.offDuty[i] = false
                                                            newHours.sleeperBerth[i] = false
                                                            newHours.onDuty[i] = false
                                                            // Check driving for this hour
                                                            newHours.driving[i] = true
                                                        }

                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            hours: newHours,
                                                        }))

                                                        setTimeRanges((prev) => ({
                                                            ...prev,
                                                            drivingStart: e.target.value,
                                                        }))
                                                    }}
                                                >
                                                    {Array.from({ length: 24 }).map((_, i) => (
                                                        <option key={i} value={i}>
                                                            {i}:00
                                                        </option>
                                                    ))}
                                                </Select>
                                            </div>
                                            <div>
                                                <Label htmlFor="drivingEnd">End Time</Label>
                                                <Select
                                                    id="drivingEnd"
                                                    name="drivingEnd"
                                                    value={timeRanges.drivingEnd}
                                                    onChange={(e) => {
                                                        const endHour = Number.parseInt(e.target.value)
                                                        const startHour = Number.parseInt(document.getElementById("drivingStart").value)

                                                        // Update hours array
                                                        const newHours = { ...formData.hours }
                                                        // Clear all driving hours first
                                                        newHours.driving = Array(24).fill(false)

                                                        // Fill in the selected range
                                                        for (let i = startHour; i <= endHour; i++) {
                                                            // Uncheck other statuses for this hour
                                                            newHours.offDuty[i] = false
                                                            newHours.sleeperBerth[i] = false
                                                            newHours.onDuty[i] = false
                                                            // Check driving for this hour
                                                            newHours.driving[i] = true
                                                        }

                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            hours: newHours,
                                                        }))

                                                        setTimeRanges((prev) => ({
                                                            ...prev,
                                                            drivingEnd: e.target.value,
                                                        }))
                                                    }}
                                                >
                                                    {Array.from({ length: 24 }).map((_, i) => (
                                                        <option key={i} value={i}>
                                                            {i}:00
                                                        </option>
                                                    ))}
                                                </Select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">4. On Duty (Not Driving)</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="onDutyStart">Start Time</Label>
                                                <Select
                                                    id="onDutyStart"
                                                    name="onDutyStart"
                                                    value={timeRanges.onDutyStart}
                                                    onChange={(e) => {
                                                        const startHour = Number.parseInt(e.target.value)
                                                        const endHour = Number.parseInt(document.getElementById("onDutyEnd").value)

                                                        // Update hours array
                                                        const newHours = { ...formData.hours }
                                                        // Clear all on duty hours first
                                                        newHours.onDuty = Array(24).fill(false)

                                                        // Fill in the selected range
                                                        for (let i = startHour; i <= endHour; i++) {
                                                            // Uncheck other statuses for this hour
                                                            newHours.offDuty[i] = false
                                                            newHours.sleeperBerth[i] = false
                                                            newHours.driving[i] = false
                                                            // Check on duty for this hour
                                                            newHours.onDuty[i] = true
                                                        }

                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            hours: newHours,
                                                        }))

                                                        setTimeRanges((prev) => ({
                                                            ...prev,
                                                            onDutyStart: e.target.value,
                                                        }))
                                                    }}
                                                >
                                                    {Array.from({ length: 24 }).map((_, i) => (
                                                        <option key={i} value={i}>
                                                            {i}:00
                                                        </option>
                                                    ))}
                                                </Select>
                                            </div>
                                            <div>
                                                <Label htmlFor="onDutyEnd">End Time</Label>
                                                <Select
                                                    id="onDutyEnd"
                                                    name="onDutyEnd"
                                                    value={timeRanges.onDutyEnd}
                                                    onChange={(e) => {
                                                        const endHour = Number.parseInt(e.target.value)
                                                        const startHour = Number.parseInt(document.getElementById("onDutyStart").value)

                                                        // Update hours array
                                                        const newHours = { ...formData.hours }
                                                        // Clear all on duty hours first
                                                        newHours.onDuty = Array(24).fill(false)

                                                        // Fill in the selected range
                                                        for (let i = startHour; i <= endHour; i++) {
                                                            // Uncheck other statuses for this hour
                                                            newHours.offDuty[i] = false
                                                            newHours.sleeperBerth[i] = false
                                                            newHours.driving[i] = false
                                                            // Check on duty for this hour
                                                            newHours.onDuty[i] = true
                                                        }

                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            hours: newHours,
                                                        }))

                                                        setTimeRanges((prev) => ({
                                                            ...prev,
                                                            onDutyEnd: e.target.value,
                                                        }))
                                                    }}
                                                >
                                                    {Array.from({ length: 24 }).map((_, i) => (
                                                        <option key={i} value={i}>
                                                            {i}:00
                                                        </option>
                                                    ))}
                                                </Select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-4">
                                        <h4 className="font-medium">Common Patterns</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    // Standard 10-hour drive pattern
                                                    const newHours = {
                                                        offDuty: Array(24).fill(false),
                                                        sleeperBerth: Array(24).fill(false),
                                                        driving: Array(24).fill(false),
                                                        onDuty: Array(24).fill(false),
                                                    }

                                                    // Off duty from 0:00 to 5:59
                                                    for (let i = 0; i < 6; i++) {
                                                        newHours.offDuty[i] = true
                                                    }

                                                    // Driving from 6:00 to 15:59 (10 hours)
                                                    for (let i = 6; i < 16; i++) {
                                                        newHours.driving[i] = true
                                                    }

                                                    // On duty (not driving) from 16:00 to 17:59 (2 hours)
                                                    for (let i = 16; i < 18; i++) {
                                                        newHours.onDuty[i] = true
                                                    }

                                                    // Sleeper berth from 18:00 to 23:59 (6 hours)
                                                    for (let i = 18; i < 24; i++) {
                                                        newHours.sleeperBerth[i] = true
                                                    }

                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        hours: newHours,
                                                    }))

                                                    setTimeRanges({
                                                        offDutyStart: "0",
                                                        offDutyEnd: "5",
                                                        sleeperBerthStart: "18",
                                                        sleeperBerthEnd: "23",
                                                        drivingStart: "6",
                                                        drivingEnd: "15",
                                                        onDutyStart: "16",
                                                        onDutyEnd: "17",
                                                    })
                                                }}
                                            >
                                                Standard 10-Hour Drive
                                            </Button>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    // Split sleeper pattern
                                                    const newHours = {
                                                        offDuty: Array(24).fill(false),
                                                        sleeperBerth: Array(24).fill(false),
                                                        driving: Array(24).fill(false),
                                                        onDuty: Array(24).fill(false),
                                                    }

                                                    // Sleeper berth from 0:00 to 2:59 (3 hours)
                                                    for (let i = 0; i < 3; i++) {
                                                        newHours.sleeperBerth[i] = true
                                                    }

                                                    // Driving from 3:00 to 8:59 (6 hours)
                                                    for (let i = 3; i < 9; i++) {
                                                        newHours.driving[i] = true
                                                    }

                                                    // On duty from 9:00 to 10:59 (2 hours)
                                                    for (let i = 9; i < 11; i++) {
                                                        newHours.onDuty[i] = true
                                                    }

                                                    // Sleeper berth from 11:00 to 18:59 (8 hours)
                                                    for (let i = 11; i < 19; i++) {
                                                        newHours.sleeperBerth[i] = true
                                                    }

                                                    // Driving from 19:00 to 23:59 (5 hours)
                                                    for (let i = 19; i < 24; i++) {
                                                        newHours.driving[i] = true
                                                    }

                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        hours: newHours,
                                                    }))

                                                    setTimeRanges({
                                                        offDutyStart: "0",
                                                        offDutyEnd: "0",
                                                        sleeperBerthStart: "11",
                                                        sleeperBerthEnd: "18",
                                                        drivingStart: "3",
                                                        drivingEnd: "8",
                                                        onDutyStart: "9",
                                                        onDutyEnd: "10",
                                                    })
                                                }}
                                            >
                                                Split Sleeper Pattern
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <h4 className="font-medium mb-2">Current Hours Summary</h4>
                                        <div className="grid grid-cols-4 gap-2 text-sm">
                                            <div className="bg-[#dbeafe] p-2 rounded">
                                                <p className="font-medium">Off Duty</p>
                                                <p>{formData.hours.offDuty.filter(Boolean).length} hours</p>
                                            </div>
                                            <div className="bg-[#ede9fe] p-2 rounded">
                                                <p className="font-medium">Sleeper</p>
                                                <p>{formData.hours.sleeperBerth.filter(Boolean).length} hours</p>
                                            </div>
                                            <div className="bg-[#dcfce7] p-2 rounded">
                                                <p className="font-medium">Driving</p>
                                                <p>{formData.hours.driving.filter(Boolean).length} hours</p>
                                            </div>
                                            <div className="bg-[#fef9c3] p-2 rounded">
                                                <p className="font-medium">On Duty</p>
                                                <p>{formData.hours.onDuty.filter(Boolean).length} hours</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 text-xs text-gray-500">
                                        <p>
                                            Select time ranges for each activity type. The system will automatically ensure no overlapping
                                            statuses.
                                        </p>
                                        <p className="mt-1">Hours are in 24-hour format (0-23).</p>
                                    </div>
                                </div>
                            </div> */}

                            <div className="bg-[#dbeafe] p-4 rounded-md">
                                <h4 className="font-medium mb-2">Hours of Service Regulations</h4>
                                <ul className="text-xs space-y-1 list-disc pl-4">
                                    <li>Maximum 11 hours driving after 10 consecutive hours off duty</li>
                                    <li>14-hour on-duty limit after coming on duty following 10+ hours off duty</li>
                                    <li>30-minute break required after 8 hours of driving</li>
                                    <li>60/70-hour limit in 7/8 consecutive days</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <Button type="submit" className="w-full">
                        Save Log Entry
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

