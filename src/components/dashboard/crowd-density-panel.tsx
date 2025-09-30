
'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useLocation } from '@/hooks/use-location';

const chartConfig = {
  density: {
    label: 'People',
    color: 'hsl(var(--primary))',
  },
};

const generateInitialData = () => {
  const data = [];
  const now = new Date();
  // Generate on client-side only to avoid hydration mismatch
  for (let i = 5; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000);
    const density = Math.floor(Math.random() * 101) + 20; // 20 to 120
    data.push({ time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), density });
  }
  return data;
};

const generateNextDataPoint = (
  prevData: { time: string; density: number }[]
) => {
  const now = new Date();
  const prevDensity = prevData[prevData.length - 1]?.density || 70;
  // Generate on client-side only to avoid hydration mismatch
  const change = Math.floor(Math.random() * 41) - 20; // change between -20 and 20
  let newDensity = prevDensity + change;
  if (newDensity < 10) newDensity = 10;
  if (newDensity > 250) newDensity = 250;

  return {
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    density: newDensity,
  };
};

export function CrowdDensityPanel() {
  const { location } = useLocation();
  const [chartData, setChartData] = useState<{ time: string; density: number }[]>([]);

  useEffect(() => {
    // Generate initial data on client mount to avoid hydration mismatch
    setChartData(generateInitialData());
    
    const interval = setInterval(() => {
      setChartData((prevData) => {
        const newData = [...prevData.slice(1)];
        newData.push(generateNextDataPoint(newData));
        return newData;
      });
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const currentDensity = useMemo(() => {
    return chartData.length > 0 ? chartData[chartData.length - 1].density : 0;
  }, [chartData]);
  
  const densityStatus = useMemo(() => {
    if (currentDensity > 150) return { text: "High", color: "text-destructive" };
    if (currentDensity > 75) return { text: "Moderate", color: "text-yellow-500" };
    return { text: "Low", color: "text-green-500" };
  }, [currentDensity]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Nearby Crowd Density
          </CardTitle>
          <span className={`text-sm font-semibold ${densityStatus.color}`}>{densityStatus.text}</span>
        </div>
        <CardDescription>
          Estimated number of people in your immediate vicinity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-center">
          <p className="text-5xl font-bold tracking-tighter">{currentDensity}</p>
          <p className="text-sm text-muted-foreground">People Detected</p>
        </div>
        <div className="h-24 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
               <XAxis
                dataKey="time"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, 250]}
                hide
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                type="monotone"
                dataKey="density"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#colorDensity)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
