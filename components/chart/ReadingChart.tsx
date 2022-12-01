import merge from 'lodash/merge';
import dynamic from 'next/dynamic'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// @mui
import { Card, CardHeader, Box, CardProps } from '@mui/material';
// components,
import BaseOptionChart from './BaseOptionChart';
import { ApexOptions } from 'apexcharts';
import { ReactNode } from 'react';
type ApexFill = {
	colors?: any[]
	opacity?: number | number[]
	type?: string | string[]
	gradient?: {
		shade?: string
		type?: string
		shadeIntensity?: number
		gradientToColors?: string[]
		inverseColors?: boolean
		opacityFrom?: number | number[]
		opacityTo?: number | number[]
		stops?: number[],
		colorStops?: any[]
	}
	image?: {
		src?: string | string[]
		width?: number
		height?: number
	}
	pattern?: {
		style?: string | string[]
		width?: number
		height?: number
		strokeWidth?: number
	}
}
type ApexDropShadow = {
	enabled?: boolean
	top?: number
	left?: number
	blur?: number
	opacity?: number
	color?: string
}

type ApexDataLabels = {
	enabled?: boolean
	enabledOnSeries?: undefined | number[]
	textAnchor?: 'start' | 'middle' | 'end'
	distributed?: boolean
	offsetX?: number
	offsetY?: number
	style?: {
		fontSize?: string
		fontFamily?: string
		fontWeight?: string | number
		colors?: any[]
	}
	background?: {
		enabled?: boolean
		foreColor?: string
		borderRadius?: number
		padding?: number
		opacity?: number
		borderWidth?: number
		borderColor?: string
		dropShadow?: ApexDropShadow
	}
	dropShadow?: ApexDropShadow
	// eslint-disable-next-line no-unused-vars
	formatter?(val: string | number | number[], opts?: any): string | number
}
type ApexAxisChartSeries = {
	name?: string
	type?: string
	color?: string
	data:
	| (number | null)[]
	| {
		x: any;
		y: any;
		fill?: ApexFill;
		fillColor?: string;
		strokeColor?: string;
		meta?: any;
		goals?: any;
		barHeightOffset?: number;
		columnWidthOffset?: number;
	}[]
	| [number, number | null][]
	| [number, (number | null)[]][]
	| number[][];
}[]

type ApexNonAxisChartSeries = number[]

export interface IReadingChartProps extends CardProps { 
	title?: string;
	subheader?: ReactNode;
	chartData: ApexAxisChartSeries | ApexNonAxisChartSeries;
	chartLabels: ApexDataLabels | string[];
	unit?: string;
}
export default function AppWebsiteVisits({ title, subheader, chartLabels, chartData, unit = "", ...other }: IReadingChartProps) {
	const chartOptions: ApexOptions = merge(BaseOptionChart(), {
		plotOptions: { bar: { columnWidth: '16%' } },
		fill: { type: chartData.map((i) => i.fill) },
		labels: chartLabels,
		xaxis: { type: 'category' },
		tooltip: {
			shared: true,
			intersect: false,
			y: {
				formatter: (y) => {
					if (typeof y !== 'undefined') {
						return `${y.toFixed(2)}${' ' + unit}`;
					}
					return y;
				},
			},
		},
	});

	return (
		<Card {...other}>
			<CardHeader title={title} subheader={subheader} />

			<Box sx={{ p: 3, pb: 1 }} dir="ltr">
				<ReactApexChart type="line" series={chartData} options={chartOptions} height={364} />
			</Box>
		</Card>
	);
}
