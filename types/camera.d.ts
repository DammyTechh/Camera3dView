import { Camera as ExpoCamera } from 'expo-camera';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'expo-camera': React.ComponentProps<typeof ExpoCamera>;
    }
  }
}

export type CameraType = 'front' | 'back';
export type FlashMode = 'on' | 'off' | 'auto' | 'torch';

export interface CameraPermissionResponse {
  status: 'granted' | 'denied';
  granted: boolean;
  expires: 'never' | number;
}

export interface CameraRef {
  getPermissionsAsync(): Promise<CameraPermissionResponse>;
  requestPermissionsAsync(): Promise<CameraPermissionResponse>;
  getMicrophonePermissionsAsync(): Promise<CameraPermissionResponse>;
  requestMicrophonePermissionsAsync(): Promise<CameraPermissionResponse>;
}