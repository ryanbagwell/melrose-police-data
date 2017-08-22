import App from './components/App';
import render from './utils/renderHelper';
import addLiveReload from './utils/addLiveReload';



render(App, document.querySelector('main'));

addLiveReload();



