import React from 'react'
import { Bar, BarChart, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

function RechartSetUp({ charts }) {
    if (!charts || charts.length === 0) return null

    const COLORS = ["#e89d33", "#7fc79f", "#a895e8", "#d7655f", "#5fa7b8"]

    return (
        <div className='space-y-8'>
            {charts.map((chart, index) => (
                <div key={index} className='theme-panel p-4'>
                    <h4 className='theme-title font-semibold text-lg mb-3'>
                        Chart: {chart.title}
                    </h4>

                    <div className='h-72'>
                        <ResponsiveContainer width="100%" height="100%">
                            {chart.type === "bar" && (
                                <BarChart data={chart.data}>
                                    <XAxis dataKey="name" stroke="#6f6254" />
                                    <YAxis stroke="#6f6254" />
                                    <Tooltip />
                                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                        {chart.data.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            )}

                            {chart.type === "line" && (
                                <LineChart data={chart.data}>
                                    <XAxis dataKey="name" stroke="#6f6254" />
                                    <YAxis stroke="#6f6254" />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#e89d33"
                                        strokeWidth={3}
                                    />
                                </LineChart>
                            )}

                            {chart.type === "pie" && (
                                <PieChart>
                                    <Tooltip />
                                    <Pie data={chart.data} dataKey="value" nameKey="name" outerRadius={100} label>
                                        {chart.data.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default RechartSetUp
