import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, Activity } from 'lucide-react';

// Simple SVG-based chart components (no external dependencies)

export const MiniBarChart = ({ data, labels, color = '#3B82F6' }) => {
    const maxValue = Math.max(...data, 1);
    
    return (
        <div className="flex items-end gap-1 h-16">
            {data.map((value, index) => (
                <motion.div
                    key={index}
                    className="flex-1 bg-blue-500 rounded-t"
                    initial={{ height: 0 }}
                    animate={{ height: `${(value / maxValue) * 100}%` }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    title={`${labels[index]}: ${value}`}
                />
            ))}
        </div>
    );
};

export const MiniPieChart = ({ data, labels, colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B'] }) => {
    const total = data.reduce((sum, value) => sum + value, 0);
    let currentAngle = -90; // Start from top
    
    const segments = data.map((value, index) => {
        const percentage = (value / total) * 100;
        const angle = (value / total) * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;
        currentAngle = endAngle;
        
        return {
            value,
            percentage,
            startAngle,
            endAngle,
            color: colors[index % colors.length],
            label: labels[index]
        };
    });
    
    const createPath = (startAngle, endAngle) => {
        const radius = 30;
        const centerX = 32;
        const centerY = 32;
        
        const startAngleRad = (startAngle * Math.PI) / 180;
        const endAngleRad = (endAngle * Math.PI) / 180;
        
        const x1 = centerX + radius * Math.cos(startAngleRad);
        const y1 = centerY + radius * Math.sin(startAngleRad);
        const x2 = centerX + radius * Math.cos(endAngleRad);
        const y2 = centerY + radius * Math.sin(endAngleRad);
        
        const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
        
        return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    };
    
    return (
        <div className="relative">
            <svg width="64" height="64" viewBox="0 0 64 64">
                {segments.map((segment, index) => (
                    <motion.path
                        key={index}
                        d={createPath(segment.startAngle, segment.endAngle)}
                        fill={segment.color}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        title={`${segment.label}: ${segment.value} (${segment.percentage.toFixed(1)}%)`}
                    />
                ))}
            </svg>
            
            {/* Legend */}
            <div className="absolute top-0 left-16 space-y-1">
                {segments.map((segment, index) => (
                    <div key={index} className="flex items-center gap-1 text-xs">
                        <div 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: segment.color }}
                        />
                        <span>{segment.label}: {segment.percentage.toFixed(0)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const TrendLine = ({ data, color = '#10B981' }) => {
    const width = 200;
    const height = 60;
    const padding = 5;
    
    const maxValue = Math.max(...data, 1);
    const minValue = Math.min(...data, 0);
    const range = maxValue - minValue || 1;
    
    const points = data.map((value, index) => {
        const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
        const y = height - padding - ((value - minValue) / range) * (height - 2 * padding);
        return `${x},${y}`;
    }).join(' ');
    
    return (
        <svg width={width} height={height} className="w-full h-full">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map(i => (
                <line
                    key={i}
                    x1={padding}
                    y1={padding + (i * (height - 2 * padding)) / 4}
                    x2={width - padding}
                    y2={padding + (i * (height - 2 * padding)) / 4}
                    stroke="#E5E7EB"
                    strokeWidth="1"
                />
            ))}
            
            {/* Trend line */}
            <motion.polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
            />
            
            {/* Data points */}
            {data.map((value, index) => {
                const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
                const y = height - padding - ((value - minValue) / range) * (height - 2 * padding);
                
                return (
                    <motion.circle
                        key={index}
                        cx={x}
                        cy={y}
                        r="3"
                        fill={color}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.2 }}
                    />
                );
            })}
        </svg>
    );
};

export const HeatMap = ({ data, rows, cols, labels }) => {
    const maxValue = Math.max(...data.flat(), 1);
    
    const getColor = (value) => {
        const intensity = value / maxValue;
        if (intensity > 0.8) return '#DC2626'; // Red
        if (intensity > 0.6) return '#F97316'; // Orange
        if (intensity > 0.4) return '#FCD34D'; // Yellow
        if (intensity > 0.2) return '#84CC16'; // Light green
        return '#10B981'; // Green
    };
    
    return (
        <div className="space-y-2">
            {/* Column labels */}
            <div className="flex gap-1 ml-8">
                {labels.cols.map((label, index) => (
                    <div key={index} className="flex-1 text-xs text-center text-gray-600">
                        {label}
                    </div>
                ))}
            </div>
            
            {/* Heat map grid */}
            {data.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-1 items-center">
                    {/* Row label */}
                    <div className="w-8 text-xs text-right text-gray-600 mr-2">
                        {labels.rows[rowIndex]}
                    </div>
                    
                    {/* Heat map cells */}
                    {row.map((value, colIndex) => (
                        <motion.div
                            key={colIndex}
                            className="flex-1 h-8 rounded flex items-center justify-center text-xs font-medium text-white"
                            style={{ backgroundColor: getColor(value) }}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ 
                                delay: (rowIndex * cols + colIndex) * 0.02, 
                                duration: 0.3 
                            }}
                            title={`${labels.rows[rowIndex]} vs ${labels.cols[colIndex]}: ${value}`}
                        >
                            {value > 0 ? value : ''}
                        </motion.div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export const ProgressRing = ({ value, max, size = 60, strokeWidth = 4, color = '#3B82F6' }) => {
    const percentage = (value / max) * 100;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#E5E7EB"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                
                {/* Progress circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    strokeLinecap="round"
                />
            </svg>
            
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold">{percentage.toFixed(0)}%</span>
            </div>
        </div>
    );
};

// Main visualization component
export const DataVisualization = ({ type, data, options = {} }) => {
    const visualization = useMemo(() => {
        switch (type) {
            case 'bar':
                return <MiniBarChart {...data} {...options} />;
            case 'pie':
                return <MiniPieChart {...data} {...options} />;
            case 'trend':
                return <TrendLine {...data} {...options} />;
            case 'heatmap':
                return <HeatMap {...data} {...options} />;
            case 'progress':
                return <ProgressRing {...data} {...options} />;
            default:
                return <div className="text-gray-500">Unknown visualization type</div>;
        }
    }, [type, data, options]);
    
    return (
        <div className="flex items-center justify-center p-4">
            {visualization}
        </div>
    );
};

// Pre-built dashboard widgets
export const StatsWidget = ({ title, value, subtitle, trend, icon: Icon, color = 'blue' }) => {
    const trendColor = trend > 0 ? 'green' : trend < 0 ? 'red' : 'gray';
    const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingUp : Activity;
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-lg border border-gray-200"
        >
            <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 text-${color}-500`} />
                <span className="text-2xl font-bold">{value}</span>
            </div>
            
            <h3 className="font-medium text-gray-900">{title}</h3>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
            
            {trend !== undefined && (
                <div className={`flex items-center gap-1 mt-2 text-sm text-${trendColor}-600`}>
                    <TrendIcon className={`w-3 h-3 ${trend < 0 ? 'transform rotate-180' : ''}`} />
                    <span>{Math.abs(trend).toFixed(1)}%</span>
                </div>
            )}
        </motion.div>
    );
};

export const ChartWidget = ({ title, type, data, height = 200 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-4 rounded-lg border border-gray-200"
        >
            <h3 className="font-medium text-gray-900 mb-4">{title}</h3>
            <div style={{ height }}>
                <DataVisualization type={type} data={data} />
            </div>
        </motion.div>
    );
};
