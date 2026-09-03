import { createIconSet } from 'react-native-vector-icons';
import glyphMap from './MaterialSymbols-glyphMap.json';

export const MaterialSymbolRoundedFilled = createIconSet(
  glyphMap as unknown as Record<string, number>,
  'MaterialSymbolsRoundedFilled-Light',
  'MaterialSymbolsRounded_Filled-Light.ttf',
);

export const MaterialSymbolRounded = createIconSet(
  glyphMap as unknown as Record<string, number>,
  'MaterialSymbolsRounded-Light',
  'MaterialSymbolsRounded-Light.ttf',
);
