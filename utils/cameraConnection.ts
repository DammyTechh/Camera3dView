import NetInfo from '@react-native-community/netinfo';
import Zeroconf from 'react-native-zeroconf';
import axios from 'axios';

export class CameraConnection {
  private zeroconf: Zeroconf;
  private static instance: CameraConnection;
  private retryAttempts = 3;
  private retryDelay = 2000; // 2 seconds

  private constructor() {
    this.zeroconf = new Zeroconf();
    this.setupListeners();
  }

  static getInstance(): CameraConnection {
    if (!CameraConnection.instance) {
      CameraConnection.instance = new CameraConnection();
    }
    return CameraConnection.instance;
  }

  private setupListeners() {
    this.zeroconf.on('resolved', service => {
      console.log('Found camera service:', service);
    });

    this.zeroconf.on('error', error => {
      console.error('Zeroconf error:', error);
    });
  }

  async scanForCamera(): Promise<string | null> {
    // First check if we're on a hotspot network
    const networkInfo = await NetInfo.fetch();
    const isHotspot = networkInfo.type === 'wifi' && 
                     networkInfo.details?.ssid?.toLowerCase().includes('hotspot');

    if (isHotspot) {
      // Try direct IP scanning on hotspot network
      return this.scanHotspotNetwork();
    }

    // Regular network scanning using Zeroconf
    return new Promise((resolve) => {
      let found = false;
      
      this.zeroconf.on('resolved', service => {
        if (!found) {
          found = true;
          resolve(`${service.host}:${service.port || 8080}`);
        }
      });

      this.zeroconf.scan('_camera._tcp.', 'tcp', 'local.');

      // Timeout after 10 seconds
      setTimeout(() => {
        if (!found) {
          resolve(null);
        }
      }, 10000);
    });
  }

  private async scanHotspotNetwork(): Promise<string | null> {
    const networkInfo = await NetInfo.fetch();
    const baseIP = networkInfo.details?.ipAddress?.split('.').slice(0, 3).join('.');
    
    if (!baseIP) return null;

    // Common Raspberry Pi ports
    const ports = [8080, 80, 8000];
    
    // Try common IP ranges used by Raspberry Pi
    for (let i = 2; i <= 254; i++) {
      const ip = `${baseIP}.${i}`;
      
      for (const port of ports) {
        try {
          const isCamera = await this.checkEndpoint(ip, port);
          if (isCamera) {
            return `${ip}:${port}`;
          }
        } catch {
          continue;
        }
      }
    }
    
    return null;
  }

  private async checkEndpoint(ip: string, port: number): Promise<boolean> {
    try {
      const response = await axios.get(`http://${ip}:${port}/ping`, {
        timeout: 500
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }

  async testConnection(address: string): Promise<boolean> {
    for (let attempt = 0; attempt < this.retryAttempts; attempt++) {
      try {
        const response = await axios.get(`http://${address}/ping`, {
          timeout: 5000
        });
        return response.status === 200;
      } catch (error) {
        if (attempt < this.retryAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
          continue;
        }
        return false;
      }
    }
    return false;
  }

  async getNetworkInfo() {
    return await NetInfo.fetch();
  }

  stopScanning() {
    this.zeroconf.stop();
  }
}