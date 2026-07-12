import React, { useEffect, useState } from 'react';
import { Loader2, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import type { AddressData } from '../types/KycTypes';


interface KycAddressFormProps {
    address: AddressData;
    setAddress: React.Dispatch<React.SetStateAction<AddressData>>;
}

export const KycAddressForm = ({ address, setAddress }: KycAddressFormProps) => {
    const [statesList, setStatesList] = useState<{ name: string }[]>([]);
    const [isLoadingStates, setIsLoadingStates] = useState(false);
    const [isFetchingPin, setIsFetchingPin] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const stateUrl = import.meta.env.VITE_STATE_URL;
    const statePinUrl = import.meta.env.VITE_STATE_PIN_URL;

    useEffect(() => {
        const fetchStates = async () => {
            setIsLoadingStates(true);
            try {
                const response = await fetch(`${stateUrl}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ country: "India" })
                });
                const data = await response.json();
                if (!data.error) {
                    setStatesList(data.data.states);
                }
            } catch {
                console.error("Failed to fetch states");
            } finally {
                setIsLoadingStates(false);
            }
        };
        fetchStates();
    }, [stateUrl]);

    useEffect(() => {
        const fetchLocationByPin = async () => {
            if (address.pincode.length === 6) {
                setIsFetchingPin(true);
                try {
                    const response = await fetch(`${statePinUrl}${address.pincode}`);
                    const data = await response.json();
                    if (data && data[0].Status === 'Success') {
                        const postOffice = data[0].PostOffice[0];
                        setAddress(prev => ({
                            ...prev,
                            city: postOffice.District,
                            state: postOffice.State,
                            isPincodeValid: true
                        }));
                    } else if (data && data[0].Status === 'Error') {
                        toast.error('Invalid PIN Code');
                        setAddress(prev => ({ ...prev, isPincodeValid: false }));
                    }
                } catch {
                    console.error('Error fetching location from PIN');
                    setAddress(prev => ({ ...prev, isPincodeValid: false }));
                } finally {
                    setIsFetchingPin(false);
                }
            } else {
                setAddress(prev => ({ ...prev, isPincodeValid: false }));
            }
        };

        const timeoutId = setTimeout(() => fetchLocationByPin(), 500);
        return () => clearTimeout(timeoutId);
    }, [address.pincode, setAddress, statePinUrl]);

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-[11px] font-medium text-[#5a5f6e] tracking-wider mb-2 ml-1">Full Address</label>
                <input
                    type="text"
                    placeholder="Enter your complete address"
                    value={address.fullAddress}
                    onChange={(e) => setAddress(prev => ({ ...prev, fullAddress: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#0b0c0e] border border-[#1e2025] rounded-xl text-[#e8eaed] text-[13px] placeholder-[#333] focus:outline-none focus:border-[#00C853]/50 font-medium transition-all"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[11px] font-medium text-[#5a5f6e] tracking-wider mb-2 ml-1">City</label>
                    <input
                        type="text"
                        placeholder="City"
                        value={address.city}
                        onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#0b0c0e] border border-[#1e2025] rounded-xl text-[#e8eaed] text-[13px] placeholder-[#333] focus:outline-none focus:border-[#00C853]/50 font-medium transition-all"
                    />
                </div>
                <div>
                    <label className="block text-[11px] font-medium text-[#5a5f6e] tracking-wider mb-2 ml-1">State</label>
                    <div className="relative">
                        <div
                            onClick={() => !isLoadingStates && setIsOpen(!isOpen)}
                            className={`w-full px-4 py-3 bg-[#0b0c0e] border ${isOpen ? 'border-[#00C853]/50' : 'border-[#1e2025]'} rounded-xl text-[13px] flex items-center justify-between cursor-pointer transition-all ${!address.state ? 'text-[#333]' : 'text-[#e8eaed]'}`}
                        >
                            <span className="font-medium truncate">{address.state || 'Select State'}</span>
                            {isLoadingStates ? <Loader2 className="w-4 h-4 animate-spin text-[#5a5f6e] flex-shrink-0" /> : <ChevronDown className={`w-4 h-4 text-[#5a5f6e] flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
                        </div>

                        {isOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                                <div className="absolute top-full left-0 right-0 mt-2 max-h-48 overflow-y-auto bg-[#0b0c0e] border border-[#1e2025] rounded-xl z-50 shadow-2xl py-2">
                                    {statesList.map((stateInfo, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => {
                                                setAddress(prev => ({ ...prev, state: stateInfo.name }));
                                                setIsOpen(false);
                                            }}
                                            className={`px-4 py-2.5 text-[13px] font-medium cursor-pointer transition-colors ${address.state === stateInfo.name ? 'bg-[#111214] text-[#00C853]' : 'text-[#e8eaed] hover:bg-[#111214]'}`}
                                        >
                                            {stateInfo.name}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div>
                <label className="block text-[11px] font-medium text-[#5a5f6e] tracking-wider mb-2 ml-1">PIN Code</label>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="6-digit PIN"
                        value={address.pincode}
                        maxLength={6}
                        onChange={(e) => setAddress(prev => ({ ...prev, pincode: e.target.value.replace(/\D/g, ''), isPincodeValid: false }))}
                        className={`w-full px-4 py-3 bg-[#0b0c0e] border border-[#1e2025] rounded-xl text-[#e8eaed] text-[13px] placeholder-[#333] focus:outline-none focus:border-[#00C853]/50 font-medium tracking-wider transition-all ${isFetchingPin ? 'opacity-70' : ''}`}
                    />
                    {isFetchingPin && (
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <Loader2 className="w-4 h-4 animate-spin text-[#00C853]" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
