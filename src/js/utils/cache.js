const KEY_PREFIX = 'MPD';



export default {

  get: function(key, value) {
    let val = sessionStorage.getItem(`${KEY_PREFIX}:${key}`);
    return val ? JSON.parse(val) : null;

  },

  set: function(key, value) {
    try {
      value = JSON.stringify(value);
      return sessionStorage.setItem(`${KEY_PREFIX}:${key}`, value);
    } catch (e) {
      return false;
    }
  },

}