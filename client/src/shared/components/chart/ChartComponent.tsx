// import { createChart, ColorType } from 'lightweight-charts';
// import { useEffect, useRef } from 'react';
// type NavPoint = {
//   date: string;
//   nav: number;
// };

// function NavLightweightChart({ data }: { data: NavPoint[] }) {
//   const chartRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!chartRef.current) return;

//     const chart = createChart(chartRef.current, {
//       width: chartRef.current.clientWidth,
//       height: 280,
//       layout: {
//         background: { type: ColorType.Solid, color: '#111' },
//         textColor: '#9ca3af',
//       },
//       grid: {
//         vertLines: { color: '#1f2937' },
//         horzLines: { color: '#1f2937' },
//       },
//       rightPriceScale: {
//         borderVisible: false,
//       },
//       timeScale: {
//         borderVisible: false,
//       },
//       crosshair: {
//         mode: 1,
//       },
//     });

//     const areaSeries = chart.addAreaSeries({
//       lineColor: '#10b981',
//       topColor: 'rgba(16,185,129,0.4)',
//       bottomColor: 'rgba(16,185,129,0.0)',
//       lineWidth: 2,
//     });

//     areaSeries.setData(
//       data.map(d => ({
//         time: d.date, // string works for MF (daily/monthly)
//         value: d.nav,
//       }))
//     );

//     chart.timeScale().fitContent();

//     const handleResize = () => {
//       chart.applyOptions({
//         width: chartRef.current!.clientWidth,
//       });
//     };

//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//       chart.remove();
//     };
//   }, [data]);

//   return <div ref={chartRef} className="w-full" />;
// }
