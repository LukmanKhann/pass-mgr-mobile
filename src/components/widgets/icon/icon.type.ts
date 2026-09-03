import type MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type MaterialCommunityIconsName = MaterialCommunityIcons extends React.ComponentType<{ name: infer N }> ? N : never;

interface IIconProps {
  name: MaterialCommunityIconsName;
  size?: number;
  color?: string;
  onPress?: () => void;
}

export type { MaterialCommunityIconsName, IIconProps };