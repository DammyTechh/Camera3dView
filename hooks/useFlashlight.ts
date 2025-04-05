import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { Camera } from 'expo-camera';

export function useFlashlight() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [camera, setCamera] = useState<Camera | null>(null);

  useEffect(() => {
    return () => {
      if (camera) {
        disableFlashlight();
      }
    };
  }, [camera]);

  const enableFlashlight = async () => {
    try {
      if (Platform.OS === 'web') {
        throw new Error('Flashlight control is not available on web platform');
      }

      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Camera permission is required to use the flashlight');
      }

      if (camera) {
        await camera.setFlashModeAsync('torch');
        setIsEnabled(true);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enable flashlight');
      setIsEnabled(false);
    }
  };

  const disableFlashlight = async () => {
    try {
      if (camera) {
        await camera.setFlashModeAsync('off');
        setIsEnabled(false);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disable flashlight');
    }
  };

  return {
    isEnabled,
    error,
    enableFlashlight,
    disableFlashlight,
    setCamera,
  };
}