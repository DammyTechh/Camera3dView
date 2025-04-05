import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { RotateCcw, ZoomIn, ZoomOut, Move3d, Wand as Wand2, Contrast, SunMedium, Palette } from 'lucide-react-native';

interface EditControlsProps {
  onRotate?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onMove?: () => void;
  onFilter?: (filter: string) => void;
}

export function EditControls({
  onRotate,
  onZoomIn,
  onZoomOut,
  onMove,
  onFilter,
}: EditControlsProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filters = [
    { name: 'Auto Enhance', icon: Wand2 },
    { name: 'Contrast', icon: Contrast },
    { name: 'Brightness', icon: SunMedium },
    { name: 'Color', icon: Palette },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.mainControls}>
        <TouchableOpacity style={styles.button} onPress={onRotate}>
          <RotateCcw size={24} color="#fff" />
          <Text style={styles.buttonText}>Rotate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onZoomIn}>
          <ZoomIn size={24} color="#fff" />
          <Text style={styles.buttonText}>Zoom In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onZoomOut}>
          <ZoomOut size={24} color="#fff" />
          <Text style={styles.buttonText}>Zoom Out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onMove}>
          <Move3d size={24} color="#fff" />
          <Text style={styles.buttonText}>Move</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterControls}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.name}
            style={[
              styles.filterButton,
              activeFilter === filter.name && styles.activeFilter
            ]}
            onPress={() => {
              setActiveFilter(filter.name);
              onFilter?.(filter.name);
            }}
          >
            <filter.icon size={20} color="#fff" />
            <Text style={styles.filterText}>{filter.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    gap: 20,
  },
  mainControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 10,
  },
  button: {
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  filterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 6,
    minWidth: 80,
  },
  activeFilter: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: '#fff',
    borderWidth: 1,
  },
  filterText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '500',
  },
});