export default {
  getVendorPrefix(prop) {

    var styles = document.createElement('p').style,
        vendors = ['ms', 'O', 'Moz', 'Webkit'], i;

    if(styles[prop] === '') return prop;

    prop = prop.charAt(0).toUpperCase() + prop.slice(1);

    for(i = vendors.length; i--;) {
      if(styles[vendors[i] + prop] === '') {
        return (vendors[i] + prop);
      }
    }
  }
}