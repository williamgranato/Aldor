'use client';
import AuctionHouse from '@/components/AuctionHouse';
import LoginGateAldor from '@/components/LoginGate_aldor_client';

export default function LeilaoPage(){
  return (
    <LoginGateAldor>
      <AuctionHouse />
    </LoginGateAldor>
  );
}
