
import { DeviceProfile, AppSettings } from '../types';

export const cloudSyncService = {
  sync: async (profiles: DeviceProfile[], settings: AppSettings): Promise<{ success: boolean; lastSynced: string }> => {
    // Simulate network latency for "cloud" upload
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // In a real app, this would be an API call to a backend
    // For this implementation, we ensure localStorage is consistent
    localStorage.setItem('duplex_profiles', JSON.stringify(profiles.map(p => ({ ...p, cloudSynced: true }))));
    localStorage.setItem('duplex_settings', JSON.stringify(settings));
    
    return {
      success: true,
      lastSynced: new Date().toLocaleString()
    };
  },
  
  fetchRemoteData: async (): Promise<{ profiles: DeviceProfile[]; settings: AppSettings } | null> => {
    // Simulate fetching from a remote server
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const profiles = localStorage.getItem('duplex_profiles');
    const settings = localStorage.getItem('duplex_settings');
    
    if (!profiles || !settings) return null;
    
    return {
      profiles: JSON.parse(profiles),
      settings: JSON.parse(settings)
    };
  }
};
