import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { CameraConnection } from '@/utils/cameraConnection';

const STORAGE_KEY = '@camera_connection';
const CONNECTION_TIMEOUT = 30000; // 30 seconds

interface StoredConnection {
  address: string;
  lastConnected: number;
}

interface CameraConnectionState {
  isConnected: boolean;
  address: string | null;
  error: string | null;
  isScanning: boolean;
  networkType: string | null;
}

export function useCameraConnection() {
  const [state, setState] = useState<CameraConnectionState>({
    isConnected: false,
    address: null,
    error: null,
    isScanning: false,
    networkType: null
  });

  const cameraConnection = CameraConnection.getInstance();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setState(prev => ({
        ...prev,
        networkType: state.type
      }));
    });

    loadStoredConnection();
    
    return () => {
      unsubscribe();
      cameraConnection.stopScanning();
    };
  }, []);

  const loadStoredConnection = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const connection: StoredConnection = JSON.parse(stored);
        if (Date.now() - connection.lastConnected < 24 * 60 * 60 * 1000) {
          tryConnect(connection.address);
        }
      }
    } catch (err) {
      console.error('Failed to load stored connection:', err);
    }
  };

  const scanForCamera = async () => {
    try {
      setState(prev => ({ ...prev, isScanning: true, error: null }));
      
      // Check network status first
      const networkInfo = await NetInfo.fetch();
      if (!networkInfo.isConnected) {
        throw new Error('No network connection available');
      }

      const scanTimeout = setTimeout(() => {
        setState(prev => ({
          ...prev,
          isScanning: false,
          error: 'Scan timeout - please try again'
        }));
      }, CONNECTION_TIMEOUT);

      const cameraAddress = await cameraConnection.scanForCamera();
      clearTimeout(scanTimeout);

      if (cameraAddress) {
        await tryConnect(cameraAddress);
      } else {
        setState(prev => ({
          ...prev,
          error: 'No camera found on network. Please ensure the camera is powered on and connected to the same network.',
          isScanning: false
        }));
      }
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to scan for camera',
        isScanning: false
      }));
    }
  };

  const tryConnect = async (cameraAddress: string) => {
    try {
      const isAvailable = await cameraConnection.testConnection(cameraAddress);
      if (isAvailable) {
        setState({
          isConnected: true,
          address: cameraAddress,
          error: null,
          isScanning: false,
          networkType: (await NetInfo.fetch()).type
        });
        
        const connection: StoredConnection = {
          address: cameraAddress,
          lastConnected: Date.now()
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(connection));
      } else {
        throw new Error('Camera not responding');
      }
    } catch (err) {
      setState(prev => ({
        ...prev,
        isConnected: false,
        address: null,
        error: 'Failed to connect to camera. Please check if the camera is powered on and try again.',
        isScanning: false,
        networkType: prev.networkType
      }));
    }
  };

  const disconnect = useCallback(async () => {
    setState(prev => ({
      ...prev,
      isConnected: false,
      address: null,
      error: null,
      isScanning: false
    }));
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    ...state,
    scanForCamera,
    disconnect,
    isHotspot: state.networkType === 'wifi' && state.networkType?.toLowerCase().includes('hotspot')
  };
}