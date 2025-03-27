import { useState } from "react";

export default function HoursGrid() {
    const [realisticHours, setRealisticHours] = useState({
        offDuty: Array(24).fill(false),
        sleeperBerth: Array(24).fill(false),
        driving: Array(24).fill(false),
        onDuty: Array(24).fill(false),
    });

    const handleToggle = (type, index) => {
        setRealisticHours((prev) => ({
            ...prev,
            [type]: prev[type].map((val, i) => (i === index ? !val : val)),
        }));
    };

    return (
        <div>
            {/* Description */}
            <div className="mb-4 p-2 bg-gray-100 border border-gray-300 rounded">
                <p className="text-sm">
                    Click on the boxes below to toggle the status. Each row represents a different activity over a 24-hour period.
                    The colors will fill or clear based on your input:
                </p>
                <ul className="list-disc pl-4 text-xs mt-2">
                    <li><span className="inline-block w-3 h-3 bg-[#dbeafe] mr-2"></span> Off Duty</li>
                    <li><span className="inline-block w-3 h-3 bg-[#ede9fe] mr-2"></span> Sleeper Berth</li>
                    <li><span className="inline-block w-3 h-3 bg-[#dcfce7] mr-2"></span> Driving</li>
                    <li><span className="inline-block w-3 h-3 bg-[#fef9c3] mr-2"></span> On Duty (Not Driving)</li>
                </ul>
            </div>

            {/* Grid Rows */}
            {[
                { label: "1. Off Duty", type: "offDuty", color: "#dbeafe" },
                { label: "2. Sleeper Berth", type: "sleeperBerth", color: "#ede9fe" },
                { label: "3. Driving", type: "driving", color: "#dcfce7" },
                { label: "4. On Duty (Not Driving)", type: "onDuty", color: "#fef9c3" },
            ].map((row) => (
                <div key={row.type} className="flex border-b border-[#000000]">
                    <div className="w-[60px] p-1 border-r border-[#000000] text-xs">
                        {row.label}
                    </div>
                    <div className="flex-1 flex relative h-8">
                        {Array.from({ length: 24 }).map((_, i) => (
                            <div
                                key={i}
                                className={`flex-1 border-r border-[#000000] last:border-r-0 relative cursor-pointer`}
                                onClick={() => handleToggle(row.type, i)}
                                style={{
                                    backgroundColor: realisticHours[row.type][i]
                                        ? row.color
                                        : "transparent",
                                }}
                            />
                        ))}
                    </div>
                    <div className="w-[60px] p-1 border-l border-[#000000] text-center">
                        {realisticHours[row.type].filter(Boolean).length}
                    </div>
                </div>
            ))}
        </div>
    );
}
