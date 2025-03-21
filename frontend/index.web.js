import { AppRegistry } from 'react-native';
import App from './src/app'; // Ensure this path is correct
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById('root'),
});
