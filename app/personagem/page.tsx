'use client';
import EquipmentPanel from '@/components/EquipmentPanel';
import SettingsPanel from '@/components/SettingsPanel';

export default function PersonagemPage(){
  return (
    <div className="space-y-4">
      <EquipmentPanel />
      <SettingsPanel />
    </div>
  );
}
