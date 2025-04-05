import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';

interface NetworkScanResult {
  ip: string;
  isCamera: boolean;
}

export async function findCameraIP(hostname: string): Promise<string | null> {
  try {
    // First, try mDNS discovery
    const mdnsResult = await tryMDNSDiscovery(hostname);
    if (mdnsResult) return mdnsResult;

    // If mDNS fails, get current network info
    const networkInfo = await NetInfo.fetch();
    if (!networkInfo.isConnected || !networkInfo.details?.ipAddress) {
      throw new Error('No network connection');
    }

    // Get the base IP from the device's IP address
    const baseIP = networkInfo.details.ipAddress.split('.').slice(0, 3).join('.');
    
    // Scan the local network
    const results = await scanNetwork(baseIP);
    const cameraIP = results.find(result => result.isCamera)?.ip;
    
    return cameraIP || null;
  } catch (err) {
    console.error('Error finding camera:', err);
    return null;
  }
}

async function tryMDNSDiscovery(hostname: string): Promise<string | null> {
  try {
    const mdnsUrl = `http://${hostname}.local:8080`;
    const response = await fetch(mdnsUrl, {
      method: 'HEAD',
      signal: AbortSignal.timeout(1000),
    });
    
    if (response.ok) {
      const url = new URL(response.url);
      return url.hostname;
    }
  } catch {
    // Ignore mDNS failures
  }
  return null;
}

async function scanNetwork(baseIP: string): Promise<NetworkScanResult[]> {
  const results: NetworkScanResult[] = [];
  const scanPromises: Promise<void>[] = [];

  // Scan common camera ports
  const ports = [8080, 80, 8000];

  // Scan the last octet range (1-254)
  for (let i = 1; i <= 254; i++) {
    const ip = `${baseIP}.${i}`;
    
    scanPromises.push(
      (async () => {
        for (const port of ports) {
          try {
            const response = await fetch(`http://${ip}:${port}/ping`, {
              method: 'HEAD',
              signal: AbortSignal.timeout(100),
            });

            if (response.ok) {
              // Check if this is our camera by looking for specific headers or response patterns
              const isCamera = await checkIfCamera(ip, port);
              results.push({ ip, isCamera });
              break; // Found a responding service on this IP, move to next IP
            }
          } catch {
            // Ignore timeouts and connection errors
          }
        }
      })()
    );
  }

  // Wait for all scans to complete
  await Promise.all(scanPromises);
  return results;
}

async function checkIfCamera(ip: string, port: number): Promise<boolean> {
  try {
    const response = await fetch(`http://${ip}:${port}`, {
      signal: AbortSignal.timeout(1000),
    });
    const text = await response.text();
    
    // Check for specific markers that indicate this is our camera server
    return text.includes('Captured Images') || 
           response.headers.get('server')?.includes('Camera-Server') ||
           text.includes('camera-controls');
  } catch {
    return false;
  }
}