import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { useCameraConnection } from '@/hooks/useCameraConnection';
import { useHotspotControl } from '@/hooks/useHotspotControl';
import { useFlashlight } from '@/hooks/useFlashlight';
import { Camera } from 'expo-camera';
import { Flashlight, Wifi, Search, Power, Save, Image as ImageIcon, Share2, Bell } from 'lucide-react-native';

export default function SettingsScreen() {
  const { isConnected, address, error, isScanning, scanForCamera, disconnect } = useCameraConnection();
  const { hotspotState, enableHotspot, disableHotspot } = useHotspotControl();
  const { isEnabled: isFlashlightEnabled, enableFlashlight, disableFlashlight, setCamera } = useFlashlight();
  const [autoConnect, setAutoConnect] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(false);

  const toggleHotspot = async () => {
    if (hotspotState.isEnabled) {
      await disableHotspot();
    } else {
      await enableHotspot();
    }
  };

  const toggleFlashlight = () => {
    if (isFlashlightEnabled) {
      disableFlashlight();
    } else {
      enableFlashlight();
    }
  };

  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    description: string,
    value: boolean,
    onToggle: () => void,
    disabled?: boolean
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        {icon}
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingDescription}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        disabled={disabled}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={value ? '#007AFF' : '#f4f3f4'}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connection</Text>
        <View style={styles.connectionStatus}>
          <View style={styles.statusIndicator}>
            <View style={[styles.dot, { backgroundColor: isConnected ? '#4CAF50' : '#FF5252' }]} />
            <Text style={styles.statusText}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Text>
          </View>
          {address && <Text style={styles.address}>{address}</Text>}
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
        
        <TouchableOpacity
          style={[styles.button, isScanning && styles.buttonDisabled]}
          onPress={isConnected ? disconnect : scanForCamera}
          disabled={isScanning}>
          {isScanning ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              {isConnected ? (
                <Power size={24} color="#fff" />
              ) : (
                <Search size={24} color="#fff" />
              )}
              <Text style={styles.buttonText}>
                {isConnected ? 'Disconnect' : 'Scan for Camera'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Network</Text>
        {renderSettingItem(
          <Wifi size={24} color="#007AFF" />,
          "Hotspot",
          "Enable device hotspot for direct camera connection",
          hotspotState.isEnabled,
          toggleHotspot,
          Platform.OS === 'web'
        )}
        {renderSettingItem(
          <Share2 size={24} color="#007AFF" />,
          "Auto Connect",
          "Automatically connect to known cameras",
          autoConnect,
          () => setAutoConnect(!autoConnect)
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Camera</Text>
        {renderSettingItem(
          <Flashlight size={24} color="#007AFF" />,
          "Flashlight",
          "Control device flashlight",
          isFlashlightEnabled,
          toggleFlashlight,
          Platform.OS === 'web'
        )}
        {renderSettingItem(
          <ImageIcon size={24} color="#007AFF" />,
          "Auto Save",
          "Automatically save captured images",
          autoSave,
          () => setAutoSave(!autoSave)
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        {renderSettingItem(
          <Bell size={24} color="#007AFF" />,
          "Push Notifications",
          "Receive alerts for camera events",
          notifications,
          () => setNotifications(!notifications)
        )}
      </View>

      {/* Hidden camera component for flashlight control */}
      {Platform.OS !== 'web' && (
        <Camera
          style={{ height: 0 }}
          ref={(ref) => setCamera(ref)}
          type={Camera.Constants.Type.back}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  connectionStatus: {
    marginBottom: 16,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
  },
  address: {
    fontSize: 14,
    color: '#666',
  },
  error: {
    color: '#dc2626',
    fontSize: 14,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
});