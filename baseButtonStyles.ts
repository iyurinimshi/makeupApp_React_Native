
import { Platform, ViewStyle } from 'react-native';

// React Native Components වලට යෙදීම සඳහා නිර්මාණය කරන ලද සාමාන්‍ය JavaScript Style Object එකක්.
// මෙය StyleSheet.create() වලින් එළියේ define කර ඇත.
export const baseButtonStyles: ViewStyle = {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    // iOS සහ Android වලට වෙනස් Shadow Settings දමා ඇත.
    ...Platform.select({
      ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 5
      },
      android: {
          elevation: 6
      },
    }),
};
