import loadScript from 'scriptjs';

export default function() {

  /*
   *  Ensure that livereload is only loaded if localhost or ip address
   *  is the hostname
   */
  const ipPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

  if (window.location.hostname === 'localhost' || ipPattern.test(window.location.hostname)) {

    loadScript('http://127.0.0.1:35729/livereload.js');

  }

}
