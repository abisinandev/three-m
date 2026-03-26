import React from 'react';
import type { IStockTableProps } from '@shared/components/interfaces/IStockTable';


export const StockTable: React.FC<IStockTableProps> = ({ stocks, isLoading, isError, onStatusToggle }) => {



    if (isLoading) {
        return (
            <div className="animate-pulse flex flex-col space-y-4 p-6">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="h-10 bg-neutral-800 rounded-md w-full"></div>
                ))}
            </div>
        );
    }

    if (isError) {
        return <div className="p-6 text-center text-red-500">Failed to load stocks. Please try again.</div>;
    }

    if (stocks.length === 0) {
        return <div className="p-6 text-center text-neutral-400">No stocks found matching the criteria.</div>;
    }

    return (
        <div className="w-full overflow-x-auto relative rounded-xl border border-neutral-800">
            <table className="w-full text-sm text-left text-neutral-300">
                <thead className="text-xs text-neutral-400 uppercase bg-neutral-900 border-b border-neutral-800 sticky top-0 z-10">
                    <tr>
                        <th scope="col" className="px-6 py-4">Symbol</th>
                        <th scope="col" className="px-6 py-4">Name</th>
                        <th scope="col" className="px-6 py-4">Exchange</th>
                        <th scope="col" className="px-6 py-4">Sector</th>
                        <th scope="col" className="px-6 py-4 text-center">Tradable</th>
                        <th scope="col" className="px-6 py-4 text-center">Tracked</th>
                        <th scope="col" className="px-6 py-4 text-center">Visible</th>
                    </tr>
                </thead>
                <tbody>
                    {stocks.map((stock) => (
                        <tr key={stock.symbol} className="bg-[#111] border-b border-neutral-800 hover:bg-neutral-800 transition-colors">
                            <td className="px-6 py-4 font-medium text-white flex items-center space-x-3">
                                {stock.logo ? (
                                    <img src={stock.logo} alt={stock.symbol} className="w-8 h-8 rounded-full border border-neutral-700 bg-white object-contain" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center font-bold text-xs">
                                        {stock.symbol.charAt(0)}
                                    </div>
                                )}
                                <span>{stock.symbol}</span>
                            </td>
                            <td className="px-6 py-4 truncate max-w-[200px]" title={stock.name}>{stock.name}</td>
                            <td className="px-6 py-4">{stock.exchange}</td>
                            <td className="px-6 py-4">{stock.sector}</td>
                            <td className="px-6 py-4 text-center">
                                <select 
                                    className={`bg-transparent border rounded p-1 outline-none ${stock.isTradable ? 'text-emerald-400 border-emerald-900' : 'text-red-400 border-red-900'}`}
                                    value={stock.isTradable.toString()}
                                    onChange={(e) => onStatusToggle(stock.symbol, 'isTradable', e.target.value === 'true')}
                                >
                                    <option className="bg-neutral-900 text-neutral-200" value="true">Active</option>
                                    <option className="bg-neutral-900 text-neutral-200" value="false">Disabled</option>
                                </select>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <select 
                                    className={`bg-transparent border rounded p-1 outline-none ${stock.isTracked ? 'text-emerald-400 border-emerald-900' : 'text-red-400 border-red-900'}`}
                                    value={stock.isTracked.toString()}
                                    onChange={(e) => onStatusToggle(stock.symbol, 'isTracked', e.target.value === 'true')}
                                >
                                    <option className="bg-neutral-900 text-neutral-200" value="true">Active</option>
                                    <option className="bg-neutral-900 text-neutral-200" value="false">Disabled</option>
                                </select>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <select 
                                    className={`bg-transparent border rounded p-1 outline-none ${stock.isVisible ? 'text-emerald-400 border-emerald-900' : 'text-red-400 border-red-900'}`}
                                    value={stock.isVisible.toString()}
                                    onChange={(e) => onStatusToggle(stock.symbol, 'isVisible', e.target.value === 'true')}
                                >
                                    <option className="bg-neutral-900 text-neutral-200" value="true">Active</option>
                                    <option className="bg-neutral-900 text-neutral-200" value="false">Disabled</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
