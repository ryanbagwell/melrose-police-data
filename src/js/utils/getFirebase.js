import * as firebase from 'firebase';
import qs from 'query-string';

const parsed = qs.parse(location.search);

const config = {
  authDomain: "police-reports-e73e1.firebaseapp.com",
  databaseURL: "https://police-reports-e73e1.firebaseio.com/",
  apiKey: "AIzaSyB1q3mxNEjsqOX_zO5SGT6nYDW-ndPLG34",
}

export default () => {

  window.firebase = window.firebase || firebase.initializeApp(config);


  // window.firebase.auth()
  //   .signInWithEmailAndPassword()
  //   .catch((err) => {
  //     console.log(err);
  //   });

  return window.firebase;
}