import { NetInfoStateType } from '@react-native-community/netinfo';

interface NetInfoCellularGeneration {
  generation: string | null;
  carrier: string | null;
}

interface NetInfoConnectedDetails {
  isConnectionExpensive: boolean;
  cellularGeneration: NetInfoCellularGeneration | null;
  carrier: string | null;
  ssid: string | null;
  strength: number | null;
  ipAddress: string | null;
  subnet: string | null;
  isWifiEnabled: boolean;
}

export interface NetworkState {
  type: NetInfoStateType;
  isConnected: boolean;
  isInternetReachable: boolean | null;
  details: NetInfoConnectedDetails;
}