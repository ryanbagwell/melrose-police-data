import LoginForm from './components/LoginForm';
import render from './utils/renderHelper';
import addLiveReload from './utils/addLiveReload';



render(LoginForm, document.querySelector('main'));

addLiveReload();



