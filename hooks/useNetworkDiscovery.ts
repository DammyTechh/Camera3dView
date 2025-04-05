import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';
import { findCameraIP } from '@/utils/network';

interface NetworkState {
  isConnected: boolean;
  type: string | null;
  isWifi: boolean;
  details: {
    ssid?: string | null;
    strength?: number | null;
    ipAddress?: string | null;
    subnet?: string | null;
  };
}

export function useNetworkDiscovery(hostname: string) {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isConnected: false,
    type: null,
    isWifi: false,
    details: {},
  });
  const [cameraIP, setCameraIP] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetworkState({
        isConnected: state.isConnected ?? false,
        type: state.type,
        isWifi: state.type === 'wifi',
        details: {
          ssid: state.details?.ssid,
          strength: state.details?.strength,
          ipAddress: state.details?.ipAddress,
          subnet: state.details?.subnet,
        },
      });
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function discoverCamera() {
      if (!networkState.isConnected) {
        setError('No network connection');
        return;
      }

      try {
        const ip = await findCameraIP(hostname);
        if (ip) {
          setCameraIP(ip);
          setError(null);
        } else {
          setError('Camera not found on network');
        }
      } catch (err) {
        setError('Failed to discover camera');
      }
    }

    discoverCamera();
  }, [networkState.isConnected, hostname]);

  return {
    networkState,
    cameraIP,
    error,
  };
}