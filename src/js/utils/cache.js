const KEY_PREFIX = 'MPD';



export default {

  getKeyHash: function(key) {
    return btoa(key).substring(0, 10);
  },
  get: function(key, value) {
    let val = sessionStorage.getItem(this.getKeyHash(`${KEY_PREFIX}:${key}`));
    return val ? JSON.parse(val) : null;

  },

  set: function(key, value) {
    try {
      value = JSON.stringify(value);
      return sessionStorage.setItem(this.getKeyHash(`${KEY_PREFIX}:${key}`), value);
    } catch (e) {
      return false;
    }
  },

}