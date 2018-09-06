/*
 *  Written by: Florian Wobbe
 *  Contact: www.eprofs.de
 *  Created: 2008-01-12 - v1.1
 *  Modified: 2008-01-17 - v1.2 - Email encoding
 *  Modified: 2008-01-19 - v1.3 - Custom Base64 encoding
 *  Modified: 2013-02-27 - v1.4 - Unicode characters fix
 *  Modified: 2018-06-10 - v1.5 - Remove onload event init
 *  Modified: 2018-09-06 - v1.6 - Convert to object literal
 *  Name: EMO Email Obfuscation
 *  Description: These javascript functions replace html placeholder
 *    span elements with decrypted email addresses.
 *  License: GPL
 */


var emo = { // Decrypt all email addresses

  // Manage decryption cache
  decryption_cache: new Array(),
  
  init: function(emo_addr) {
    this.emo_addr = emo_addr;
    this.emo_replace();

  },
  
  emo_replace: function() {
    for(var i = 1; i < emo.emo_addr.length; i++) {
      var id = 'emo_email_' + i;
      var elem = document.getElementById(id);
      if(elem) {
        if(elem.firstChild) {
          elem.removeChild(elem.firstChild);
        }
        elem.outerHTML = emo.decrypt_string(i);
      }
    }
  },

  decrypt_string: function(n) {
    var cache_index = "'"+n+"'";

    // If this string has already been decrypted, just return the cached version
    if(emo.decryption_cache[cache_index]) return emo.decryption_cache[cache_index];

    // Is crypted_string an index into the addresses array?
    if(emo.emo_addr[n]) var crypted_string = emo.emo_addr[n];

    // Make sure the string is actually a string
    if(!crypted_string.length) return "Error, not a valid index.";

    var decrypted_string = emo.decode_base64(crypted_string);

    // Cache this string for any future calls
    emo.decryption_cache[cache_index] = decrypted_string;

    return decodeURIComponent(escape(decrypted_string));
  },

  // Custom base 64 decoding
  decode_base64: function(data) {
    var tab = emo.emo_addr[0];
    var out = "", c1, c2, c3, e1, e2, e3, e4;
    for (var i = 0; i < data.length; ) {
      e1 = tab.indexOf(data.charAt(i++));
      e2 = tab.indexOf(data.charAt(i++));
      e3 = tab.indexOf(data.charAt(i++));
      e4 = tab.indexOf(data.charAt(i++));
      c1 = (e1 << 2) + (e2 >> 4);
      c2 = ((e2 & 15) << 4) + (e3 >> 2);
      c3 = ((e3 & 3) << 6) + e4;
      out += String.fromCharCode(c1);
      if (e3 != 64)
        out += String.fromCharCode(c2);
      if (e4 != 64)
        out += String.fromCharCode(c3);
    }
    return out;
  }

}
