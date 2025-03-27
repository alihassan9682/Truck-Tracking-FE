import { useState, useRef } from "react"
import { format } from "date-fns"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { Download, Printer } from "lucide-react"
import Button from "../../ui/button"
import html2pdf from "html2pdf.js";

import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "../../ui/card"
import HoursGrid from "./GridForm"
export default function DailyLogSheet({ logEntry, tripDetails, dayNumber }) {
    const [isGenerating, setIsGenerating] = useState(false)
    const logSheetRef = useRef(null)

    const handleDownloadPDF = () => {
        if (!logSheetRef.current) return;

        setIsGenerating(true);

        html2pdf()
            .set({
                margin: 10,
                filename: `driver-log-day-${dayNumber}.pdf`,
                image: { type: "jpeg", quality: 1 }, // Ensures high quality
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            })
            .from(logSheetRef.current)
            .save()
            .then(() => setIsGenerating(false))
            .catch((error) => {
                console.error("Error generating PDF:", error);
                setIsGenerating(false);
            });
    };

    const handlePrint = () => {
        if (!logSheetRef.current) return;

        const printContent = logSheetRef.current.innerHTML;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = printContent; // Replace page content with log sheet
        window.print(); // Trigger print
        document.body.innerHTML = originalContent; // Restore original page
        window.location.reload(); // Refresh to restore event listeners (optional)
    };
    return (
        <Card className="print:shadow-none">
            <CardHeader>
                <CardTitle>Daily Log - Day {dayNumber}</CardTitle>
            </CardHeader>
            <CardContent>
                <div
                    ref={logSheetRef}
                    className="border border-black rounded-none p-4 bg-white"
                >
                    {/* Log Sheet Header */}
                    <div className="text-center border-b border-black pb-2 mb-4">
                        <h2 className="text-xl font-bold">Drivers Daily Log</h2>
                        <div className="flex justify-center gap-1 mt-2">
                            <div className="border border-black px-2 py-1 w-8 text-center">{format(logEntry.date, "MM")}</div>
                            <span>/</span>
                            <div className="border border-black px-2 py-1 w-8 text-center">{format(logEntry.date, "dd")}</div>
                            <span>/</span>
                            <div className="border border-black px-2 py-1 w-12 text-center">{format(logEntry.date, "yyyy")}</div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs">
                            <div>
                                <span className="font-semibold">Original - File in home terminal</span>
                            </div>
                            <div>
                                <span className="font-semibold">Duplicate - Driver retains in his/her possession for 8 days</span>
                            </div>
                        </div>
                    </div>
                    <div className="mb-4 bg-[#f3f4f6] p-3 border border-[#000000]">
                        <div className="flex justify-between items-center">
                            <div className="font-bold text-lg">Driver: {(logEntry.driverName)}</div>
                            <div className="text-sm">Day {dayNumber} of Trip</div>
                        </div>
                    </div>
                    {/* From/To Section */}
                    <div className="flex mb-4">
                        <div className="w-1/2 pr-2">
                            <div className="font-semibold">From:</div>
                            <div className="border-b border-black pb-1">{logEntry.fromLocation}</div>
                        </div>
                        <div className="w-1/2 pl-2">
                            <div className="font-semibold">To:</div>
                            <div className="border-b border-black pb-1">{logEntry.toLocation}</div>
                        </div>
                    </div>

                    {/* Mileage and Carrier Section */}
                    <div className="flex mb-4">
                        <div className="w-1/2 flex">
                            <div className="w-1/2 border border-black p-2 mr-1">
                                <div className="text-center font-semibold mb-1 text-sm">Total Miles Driving Today</div>
                                <div className="text-center text-xl font-bold">{logEntry.milesDriven}</div>
                            </div>
                            <div className="w-1/2 border border-black p-2 ml-1">
                                <div className="text-center font-semibold mb-1 text-sm">Total Mileage Today</div>
                                <div className="text-center text-xl font-bold">{logEntry.totalMileage}</div>
                            </div>
                        </div>
                        <div className="w-1/2 pl-4">
                            <div className="font-semibold text-sm">Name of Carrier or Carrier:</div>
                            <div className="border-b border-black pb-1">{tripDetails.carrierName}</div>
                            <div className="font-semibold text-sm mt-2">Main Office Address:</div>
                            <div className="border-b border-black pb-1">{tripDetails.mainOfficeAddress}</div>
                        </div>
                    </div>

                    {/* Truck/Trailer Information */}
                    <div className="flex mb-4">
                        <div className="w-1/2">
                            <div className="font-semibold text-sm text-center">Truck/Trailer and Entity Numbers or</div>
                            <div className="font-semibold text-sm text-center">License/Unit/Fleet (show each unit)</div>
                            <div className="border border-black p-2 mt-1 min-h-[40px]">
                                Truck: <span className="font-bold">{tripDetails.truckNumber}</span>
                                {tripDetails.trailerNumber && (
                                    <span>
                                        {" "}
                                        | Trailer: <span className="font-bold">{tripDetails.trailerNumber}</span>
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="w-1/2 pl-4">
                            <div className="font-semibold text-sm text-center">Home Terminal Address:</div>
                            <div className="border border-black p-2 mt-1 min-h-[40px]">{tripDetails.homeTerminal}</div>
                        </div>
                    </div>

                    {/* Grid Section */}
                    <div className="mb-4">
                        <div className="bg-black text-white p-1 text-center font-semibold text-xs">
                            HOURS OF SERVICE RECORD FOR THE 24-HOUR PERIOD
                        </div>

                        <div className="border border-black">
                            {/* Grid Header */}
                            <div className="flex border-b border-black text-xs bg-black text-white">
                                <div className="w-[60px] p-1 border-r border-white">Activity</div>
                                <div className="flex-1 flex">
                                    {Array.from({ length: 24 }).map((_, i) => (
                                        <div key={i} className="flex-1 text-center border-r border-white last:border-r-0 py-1">
                                            {i}
                                        </div>
                                    ))}
                                </div>
                                <div className="w-[60px] p-1 border-l border-white text-center">Total Hours</div>
                            </div>

                            {/* Grid Rows */}
                            <HoursGrid />
                        </div>
                    </div>

                    {/* Remarks Section */}
                    <div className="mb-4">
                        <div className="font-semibold mb-1">Remarks:</div>
                        <div className="border border-black p-2 min-h-[60px]">{logEntry.remarks}</div>
                    </div>

                    {/* Shipping Documents Section */}
                    <div className="mb-4">
                        <div className="font-semibold">Shipping Documents:</div>
                        <div className="border border-black p-2 min-h-[80px]">
                            <div className="mb-2">
                                <span className="font-semibold">BOL or Manifest No.:</span> {logEntry.bolNumber || "_______________"}
                            </div>
                            <div>
                                <span className="font-semibold">Shipper & Commodity:</span>{" "}
                                {logEntry.shipperCommodity || "_______________"}
                            </div>
                            <div className="mt-4 text-xs">
                                Enter name of place you departed and where unloaded from work and when and where each change of duty
                                occurred. Use time standard of time zone where home terminal is located.
                            </div>
                        </div>
                    </div>

                    {/* Hours Summary */}
                    <div className="mt-4 border border-black">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-black">
                                    <th className="p-1 border-r border-black">Recap</th>
                                    <th className="p-1 border-r border-black">24 Hour / 7 Day</th>
                                    <th className="p-1 border-r border-black">A. Total hours on duty</th>
                                    <th className="p-1 border-r border-black">B. Total hours off duty</th>
                                    <th className="p-1 border-r border-black">C. Total hours driving</th>
                                </tr>
                            </thead>
                            {/* <tbody>
                                <tr>
                                    <td className="p-1 border-r border-black">End of day</td>
                                    <td className="p-1 border-r border-black text-center">{logEntry.recap.hoursToday}</td>
                                    <td className="p-1 border-r border-black text-center">{logEntry.recap.totalOnDuty}</td>
                                    <td className="p-1 border-r border-black text-center">{logEntry.recap.totalOffDuty}</td>
                                    <td className="p-1 border-r border-black text-center">{logEntry.recap.totalDriving}</td>
                                </tr>
                            </tbody> */}
                        </table>

                        <table className="w-full text-xs mt-2">
                            <thead>
                                <tr className="border-b border-black">
                                    <th className="p-1 border-r border-black">Recap</th>
                                    <th className="p-1 border-r border-black" colSpan={3}>
                                        70 Hour / 7 Day
                                    </th>
                                    <th className="p-1 border-r border-black" colSpan={3}>
                                        60 Hour / 8 Day
                                    </th>
                                    <th className="p-1">
                                        *If you took 34+ consecutive hours off-duty or in sleeper berth, you may reset your hours to 0/70
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="p-1 border-r border-black">On Duty Hours</td>
                                    <td className="p-1 border-r border-black">A. Total hours on duty last 7 days</td>
                                    <td className="p-1 border-r border-black">B. Total hours on duty today</td>
                                    <td className="p-1 border-r border-black">C. Total hours on duty tomorrow</td>
                                    <td className="p-1 border-r border-black">A. Total hours on duty last 8 days</td>
                                    <td className="p-1 border-r border-black">B. Total hours on duty today</td>
                                    <td className="p-1 border-r border-black">C. Total hours on duty tomorrow</td>
                                    <td className="p-1">available.</td>
                                </tr>
                                <tr>
                                    <td className="p-1 border-r border-black">Total Hours 3 & 4</td>
                                    <td className="p-1 border-r border-black text-center">-</td>
                                    <td className="p-1 border-r border-black text-center">-</td>
                                    <td className="p-1 border-r border-black text-center">-</td>
                                    <td className="p-1 border-r border-black text-center">-</td>
                                    <td className="p-1 border-r border-black text-center">-</td>
                                    <td className="p-1 border-r border-black text-center">-</td>
                                    <td className="p-1"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print Log
                </Button>
                <Button onClick={handleDownloadPDF} disabled={isGenerating}>
                    <Download className="mr-2 h-4 w-4" />
                    {isGenerating ? "Generating PDF..." : "Download as PDF"}
                </Button>
            </CardFooter>
        </Card>
    )
}

