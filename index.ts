import { registerRootComponent } from 'expo';

// 🔑 App.tsx වෙනුවට HomeScreen.tsx ගොනුව Import කරන්න
import App from './Homescreen'; 

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App); 
