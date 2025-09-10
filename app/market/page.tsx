'use client';
import React from 'react';
// Use absolute alias to import from root (ensures correct path regardless of route depth)
import MarketProviderBridge from '@/components/market/MarketProviderBridge';
import { Market } from '@/components/market/Market';
export default function Page() { return (<><MarketProviderBridge/><Market/></>); }
