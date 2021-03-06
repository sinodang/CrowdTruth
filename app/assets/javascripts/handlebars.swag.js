/*
    Swag v0.6.1 <http://elving.github.com/swag/>
    Copyright 2012 Elving Rodriguez <http://elving.me/>
    Available under MIT license <https://raw.github.com/elving/swag/master/LICENSE>
*/


(function() {
  var Dates, HTML, Swag, Utils,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  if (typeof window !== "undefined" && window !== null) {
    window.Swag = Swag = {};
  } else if (typeof module !== "undefined" && module !== null) {
    module.exports = Swag = {};
  }

  Swag.helpers = {};

  Swag.addHelper = function(name, helper) {
    return Swag.helpers[name] = helper;
  };

  Swag.registerHelpers = function(localHandlebars) {
    var helper, name, _ref, _results;
    if (localHandlebars) {
      Swag.Handlebars = localHandlebars;
    } else {
      if (typeof window !== "undefined" && window !== null) {
        if (window.Ember != null) {
          Swag.Handlebars = Ember.Handlebars;
        } else {
          Swag.Handlebars = window.Handlebars;
        }
      } else if (typeof module !== "undefined" && module !== null) {
        Swag.Handlebars = require('handlebars');
      }
    }
    Swag.registerHelper = function(name, helper) {
      if ((typeof window !== "undefined" && window !== null) && window.Ember) {
        return Swag.Handlebars.helper(name, helper);
      } else {
        return Swag.Handlebars.registerHelper(name, helper);
      }
    };
    _ref = Swag.helpers;
    _results = [];
    for (name in _ref) {
      helper = _ref[name];
      _results.push(Swag.registerHelper(name, helper));
    }
    return _results;
  };

  Swag.Config = {
    partialsPath: '',
    precompiledTemplates: true
  };

  Utils = {};

  Utils.isHandlebarsSpecific = function(value) {
    return (value && (value.fn != null)) || (value && (value.hash != null));
  };

  Utils.isUndefined = function(value) {
    return (value === void 0 || value === null) || Utils.isHandlebarsSpecific(value);
  };

  Utils.safeString = function(str) {
    return new Swag.Handlebars.SafeString(str);
  };

  Utils.escapeRegexp = function(str, delimiter){
    return String(str).replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
  }

  Utils.trim = function(str) {
    var trim;
    trim = /\S/.test("\xA0") ? /^[\s\xA0]+|[\s\xA0]+$/g : /^\s+|\s+$/g;
    return str.toString().replace(trim, '');
  };

  Utils.isFunc = function(value) {
    return typeof value === 'function';
  };

  Utils.isString = function(value) {
    return typeof value === 'string';
  };

  Utils.result = function(value) {
    if (Utils.isFunc(value)) {
      return value();
    } else {
      return value;
    }
  };

  Utils.err = function(msg) {
    throw new Error(msg);
  };

  Swag.addHelper('lowercase', function(str) {
    if (!Utils.isUndefined(str)) {
      str = Utils.result(str);
      return str.toLowerCase();
    } else {
      return Utils.err('{{lowercase}} takes one argument (string).');
    }
  });

  Swag.addHelper('uppercase', function(str) {
    if (!Utils.isUndefined(str)) {
      str = Utils.result(str);
      return str.toUpperCase();
    } else {
      return Utils.err('{{uppercase}} takes one argument (string).');
    }
  });

  Swag.addHelper('capitalizeFirst', function(str) {
    if (!Utils.isUndefined(str)) {
      str = Utils.result(str);
      return str.charAt(0).toUpperCase() + str.slice(1);
    } else {
      return Utils.err('{{capitalizeFirst}} takes one argument (string).');
    }
  });

  Swag.addHelper('capitalizeEach', function(str) {
    if (!Utils.isUndefined(str)) {
      str = Utils.result(str);
      return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1);
      });
    } else {
      return Utils.err('{{capitalizeEach}} takes one argument (string).');
    }
  });

  Swag.addHelper('titleize', function(str) {
    var capitalize, title, word, words;
    if (!Utils.isUndefined(str)) {
      str = Utils.result(str);
      title = str.replace(/[ \-_]+/g, ' ');
      words = title.match(/\w+/g);
      capitalize = function(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      };
      return ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = words.length; _i < _len; _i++) {
          word = words[_i];
          _results.push(capitalize(word));
        }
        return _results;
      })()).join(' ');
    } else {
      return Utils.err('{{titleize}} takes one argument (string).');
    }
  });

  Swag.addHelper('sentence', function(str) {
    if (!Utils.isUndefined(str)) {
      str = Utils.result(str);
      return str.replace(/((?:\S[^\.\?\!]*)[\.\?\!]*)/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    } else {
      return Utils.err('{{sentence}} takes one argument (string).');
    }
  });
  
	Swag.addHelper('formatTime', function(seconds) {
		return new Date(seconds).toString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
	});
  
   Swag.addHelper('duration', function(seconds) {
	
	if (isNaN(seconds) || seconds < 0) {
		return ""
	}
	
	var numdays = Math.floor(seconds / 86400);
	var numhours = Math.floor((seconds % 86400) / 3600);
	var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
	var numseconds = ((seconds % 86400) % 3600) % 60;
	
	duration = '';
	if(numdays > 0) { duration += numdays + "d "; } 
	if(numhours > 0) { duration += numhours + "h "; }
	if(numminutes > 0) { duration += numminutes + "m "; }
	if(duration == '' && numseconds > 0) { duration = '< 1m'; }
	
	return duration;
   
   });

  Swag.addHelper('reverse', function(str) {
    if (!Utils.isUndefined(str)) {
      str = Utils.result(str);
      return str.split('').reverse().join('');
    } else {
      return Utils.err('{{reverse}} takes one argument (string).');
    }
  });

  Swag.addHelper('truncate', function(str, length, omission) {
    if (!Utils.isUndefined(str)) {
      str = Utils.result(str);
      if (Utils.isUndefined(omission)) {
        omission = '';
      }
      if (str.length > length) {
        return str.substring(0, length - omission.length) + omission;
      } else {
        return str;
      }
    } else {
      return Utils.err('{{truncate}} takes one argument (string).');
    }
  });

Swag.addHelper('ifvalue', function (conditional, options) {
  if (options.hash.value === conditional) {
    return options.fn(this)
  } else {
    return options.inverse(this);
  }
});

Swag.addHelper('ifequal', function (val1, val2, fn, elseFn) {
    if (val1 === val2) {
        return fn();
    }
    else if (elseFn) {
        return elseFn();
    }
});

	Swag.addHelper('type', function(value){
		this.key = value;
	});

  Swag.addHelper('center', function(str, spaces) {
    var i, space;
    if (!((Utils.isUndefined(str)) && (Utils.isUndefined(spaces)))) {
      str = Utils.result(str);
      spaces = Utils.result(spaces);
      space = '';
      i = 0;
      while (i < spaces) {
        space += '&nbsp;';
        i++;
      }
      return "" + space + str + space;
    } else {
      return Utils.err('{{center}} takes two arguments (string, number).');
    }
  });

  Swag.addHelper('newLineToBr', function(str) {
    if (!Utils.isUndefined(str)) {
      str = Utils.result(str);
      return str.replace(/\r?\n|\r/g, '<br>');
    } else {
      return Utils.err('{{newLineToBr}} takes one argument (string).');
    }
  });

  Swag.addHelper('sanitize', function(str, replaceWith) {
    if (!Utils.isUndefined(str)) {
      str = Utils.result(str);
      if (Utils.isUndefined(replaceWith)) {
        replaceWith = '-';
      }
      return str.replace(/[^a-z0-9]/gi, replaceWith);
    } else {
      return Utils.err('{{sanitize}} takes one argument (string).');
    }
  });

  Swag.addHelper('first', function(array, count) {
    if (!Utils.isUndefined(array)) {
      array = Utils.result(array);
      if (!Utils.isUndefined(count)) {
        count = parseFloat(Utils.result(count));
      }
      if (Utils.isUndefined(count)) {
        return array[0];
      } else {
        return array.slice(0, count);
      }
    } else {
      return Utils.err('{{first}} takes at least one argument (array).');
    }
  });

  Swag.addHelper('withFirst', function(array, count, options) {
    var item, result;
    if (!Utils.isUndefined(array)) {
      array = Utils.result(array);
      if (!Utils.isUndefined(count)) {
        count = parseFloat(Utils.result(count));
      }
      if (Utils.isUndefined(count)) {
        options = count;
        return options.fn(array[0]);
      } else {
        array = array.slice(0, count);
        result = '';
        for (item in array) {
          result += options.fn(array[item]);
        }
        return result;
      }
    } else {
      return Utils.err('{{withFirst}} takes at least one argument (array).');
    }
  });

  Swag.addHelper('last', function(array, count) {
    if (!Utils.isUndefined(array)) {
      array = Utils.result(array);
      if (!Utils.isUndefined(count)) {
        count = parseFloat(Utils.result(count));
      }
      if (Utils.isUndefined(count)) {
        return array[array.length - 1];
      } else {
        return array.slice(-count);
      }
    } else {
      return Utils.err('{{last}} takes at least one argument (array).');
    }
  });

  Swag.addHelper('withLast', function(array, count, options) {
    var item, result;
    if (!Utils.isUndefined(array)) {
      array = Utils.result(array);
      if (!Utils.isUndefined(count)) {
        count = parseFloat(Utils.result(count));
      }
      if (Utils.isUndefined(count)) {
        options = count;
        return options.fn(array[array.length - 1]);
      } else {
        array = array.slice(-count);
        result = '';
        for (item in array) {
          result += options.fn(array[item]);
        }
        return result;
      }
    } else {
      return Utils.err('{{withLast}} takes at least one argument (array).');
    }
  });

  Swag.addHelper('after', function(array, count) {
    if (!((Utils.isUndefined(array)) && (Utils.isUndefined(count)))) {
      array = Utils.result(array);
      if (!Utils.isUndefined(count)) {
        count = parseFloat(Utils.result(count));
      }
      return array.slice(count);
    } else {
      return Utils.err('{{after}} takes two arguments (array, number).');
    }
  });

  Swag.addHelper('withAfter', function(array, count, options) {
    var item, result;
    if (!((Utils.isUndefined(array)) && (Utils.isUndefined(count)))) {
      array = Utils.result(array);
      if (!Utils.isUndefined(count)) {
        count = parseFloat(Utils.result(count));
      }
      array = array.slice(count);
      result = '';
      for (item in array) {
        result += options.fn(array[item]);
      }
      return result;
    } else {
      return Utils.err('{{withAfter}} takes two arguments (array, number).');
    }
  });

  Swag.addHelper('before', function(array, count) {
    if (!((Utils.isUndefined(array)) && (Utils.isUndefined(count)))) {
      array = Utils.result(array);
      if (!Utils.isUndefined(count)) {
        count = parseFloat(Utils.result(count));
      }
      return array.slice(0, -count);
    } else {
      return Utils.err('{{before}} takes two arguments (array, number).');
    }
  });

  Swag.addHelper('withBefore', function(array, count, options) {
    var item, result;
    if (!((Utils.isUndefined(array)) && (Utils.isUndefined(count)))) {
      array = Utils.result(array);
      if (!Utils.isUndefined(count)) {
        count = parseFloat(Utils.result(count));
      }
      array = array.slice(0, -count);
      result = '';
      for (item in array) {
        result += options.fn(array[item]);
      }
      return result;
    } else {
      return Utils.err('{{withBefore}} takes two arguments (array, number).');
    }
  });

  Swag.addHelper('join', function(array, separator) {
    if (!Utils.isUndefined(array)) {
      array = Utils.result(array);
      if (!Utils.isUndefined(separator)) {
        separator = Utils.result(separator);
      }
      return array.join(Utils.isUndefined(separator) ? ' ' : separator);
    } else {
      return Utils.err('{{join}} takes at least one argument (array).');
    }
  });

  Swag.addHelper('sort', function(array, field) {
    if (!Utils.isUndefined(array)) {
      array = Utils.result(array);
      if (Utils.isUndefined(field)) {
        return array.sort();
      } else {
        field = Utils.result(field);
        return array.sort(function(a, b) {
          return a[field] > b[field];
        });
      }
    } else {
      return Utils.err('{{sort}} takes at least one argument (array).');
    }
  });

  Swag.addHelper('withSort', function(array, field, options) {
    var item, result, _i, _len;
    if (!Utils.isUndefined(array)) {
      array = Utils.result(array);
      result = '';
      if (Utils.isUndefined(field)) {
        options = field;
        array = array.sort();
        for (_i = 0, _len = array.length; _i < _len; _i++) {
          item = array[_i];
          result += options.fn(item);
        }
      } else {
        field = Utils.result(field);
        array = array.sort(function(a, b) {
          return a[field] > b[field];
        });
        for (item in array) {
          result += options.fn(array[item]);
        }
      }
      return result;
    } else {
      return Utils.err('{{withSort}} takes at least one argument (array).');
    }
  });

  Swag.addHelper('length', function(array) {
    if (!Utils.isUndefined(array)) {
      array = Utils.result(array);
      return array.length;
    } else {
      return Utils.err('{{length}} takes one argument (array).');
    }
  });

  Swag.addHelper('lengthEqual', function(array, length, options) {
    if (!Utils.isUndefined(array)) {
      array = Utils.result(array);
      if (!Utils.isUndefined(length)) {
        length = parseFloat(Utils.result(length));
      }
      if (array.length === length) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    } else {
      return Utils.err('{{lengthEqual}} takes two arguments (array, number).');
    }
  });

  Swag.addHelper('empty', function(array, options) {
    if (!Utils.isHandlebarsSpecific(array)) {
      array = Utils.result(array);
      if (!array || array.length <= 0) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    } else {
      return Utils.err('{{empty}} takes one argument (array).');
    }
  });

  Swag.addHelper('any', function(array, options) {
    if (!Utils.isHandlebarsSpecific(array)) {
      array = Utils.result(array);
      if (array && array.length > 0) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    } else {
      return Utils.err('{{any}} takes one argument (array).');
    }
  });

  Swag.addHelper('inArray', function(array, value, options) {
    if (!((Utils.isUndefined(array)) && (Utils.isUndefined(value)))) {
      array = Utils.result(array);
      value = Utils.result(value);
      if (__indexOf.call(array, value) >= 0) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    } else {
      return Utils.err('{{inArray}} takes two arguments (array, string|number).');
    }
  });

  Swag.addHelper('inArrayNew', function(array, value, options) {
    if (!((Utils.isUndefined(array)) && (Utils.isUndefined(value)))) {
      array = Utils.result(array);
      value = Utils.result(value);
      if (value.constructor === Array) {
	if (__indexOf.call(array, value[0]) >= 0) {
        	return options.fn(this);
        } else {
        	return options.inverse(this);
        }
      }
      else {
	if (__indexOf.call(array, value) >= 0) {
        	return options.fn(this);
        } else {
        	return options.inverse(this);
        }

      }     
    } else {
      return Utils.err('{{inArray}} takes two arguments (array, string|number).');
    }
  });

  Swag.addHelper('eachIndex', function(array, options) {
    var index, result, value, _i, _len;
    if (!Utils.isUndefined(array)) {
      array = Utils.result(array);
      result = '';
      for (index = _i = 0, _len = array.length; _i < _len; index = ++_i) {
        value = array[index];
        result += options.fn({
          item: value,
          index: index
        });
      }
      return result;
    } else {
      return Utils.err('{{eachIndex}} takes one argument (array).');
    }
  });

  Swag.addHelper('eachProperty', function(obj, options) {
    var key, result, value;
    if (!Utils.isUndefined(obj)) {
      obj = Utils.result(obj);
      result = '';
      for (key in obj) {
        value = obj[key];
        result += options.fn({
          key: key,
          value: value
        });
      }
      return result;
    } else {
      return Utils.err('{{eachProperty}} takes one argument (object).');
    }
  });

  Swag.addHelper('add', function(value, addition) {
    if (!((Utils.isUndefined(value)) && (Utils.isUndefined(addition)))) {
      value = parseFloat(Utils.result(value));
      addition = parseFloat(Utils.result(addition));
      return value + addition;
    } else {
      return Utils.err('{{add}} takes two arguments (number, number).');
    }
  });

  Swag.addHelper('subtract', function(value, substraction) {
    if (!((Utils.isUndefined(value)) && (Utils.isUndefined(substraction)))) {
      value = parseFloat(Utils.result(value));
      substraction = parseFloat(Utils.result(substraction));
      return value - substraction;
    } else {
      return Utils.err('{{subtract}} takes two arguments (number, number).');
    }
  });

  Swag.addHelper('divide', function(value, divisor) {
    if (!((Utils.isUndefined(value)) && (Utils.isUndefined(divisor)))) {
      value = parseFloat(Utils.result(value));
      divisor = parseFloat(Utils.result(divisor));
      return value / divisor;
    } else {
      return Utils.err('{{divide}} takes two arguments (number, number).');
    }
  });

  Swag.addHelper('multiply', function(value, multiplier) {
    if (!((Utils.isUndefined(value)) && (Utils.isUndefined(multiplier)))) {
      value = parseFloat(Utils.result(value));
      multiplier = parseFloat(Utils.result(multiplier));
      return value * multiplier;
    } else {
      return Utils.err('{{multiply}} takes two arguments (number, number).');
    }
  });

  Swag.addHelper('floor', function(value) {
    if (!(Utils.isUndefined(value))) {
      value = parseFloat(Utils.result(value));
      return Math.floor(value);
    } else {
      return Utils.err('{{floor}} takes one argument (number).');
    }
  });

  Swag.addHelper('ceil', function(value) {
    if (!(Utils.isUndefined(value))) {
      value = parseFloat(Utils.result(value));
      return Math.ceil(value);
    } else {
      return Utils.err('{{ceil}} takes one argument (number).');
    }
  });

  Swag.addHelper('round', function(value) {
    if (!(Utils.isUndefined(value))) {
      value = parseFloat(Utils.result(value));
      return Math.round(value);
    } else {
      return Utils.err('{{round}} takes one argument (number).');
    }
  });

  Swag.addHelper('toFixed', function(number, digits) {
    if (!Utils.isUndefined(number)) {
      number = parseFloat(Utils.result(number));
      digits = Utils.isUndefined(digits) ? 0 : Utils.result(digits);
      return number.toFixed(digits);
    } else {
      return "-";
      return Utils.err('{{toFixed}} takes at least one argument (number).');
    }
  });

  Swag.addHelper('toPrice', function(number) {
    if (!Utils.isUndefined(number)) {
		number = parseFloat(Utils.result(number));
		return '$' + number.toFixed(2);
    } else {
	  return '-';
    }
  });
  
  Swag.addHelper('toPrecision', function(number, precision) {
    if (!Utils.isUndefined(number)) {
      number = parseFloat(Utils.result(number));
      precision = Utils.isUndefined(precision) ? 1 : Utils.result(precision);
      return number.toPrecision(precision);
    } else {
      return Utils.err('{{toPrecision}} takes at least one argument (number).');
    }
  });

  Swag.addHelper('toExponential', function(number, fractions) {
    if (!Utils.isUndefined(number)) {
      number = parseFloat(Utils.result(number));
      fractions = Utils.isUndefined(fractions) ? 0 : Utils.result(fractions);
      return number.toExponential(fractions);
    } else {
      return Utils.err('{{toExponential}} takes at least one argument (number).');
    }
  });

  Swag.addHelper('toInt', function(number) {
    if (!Utils.isUndefined(number)) {
      number = Utils.result(number);
      return parseInt(number, 10);
    } else {
      return Utils.err('{{toInt}} takes one argument (number).');
    }
  });

  Swag.addHelper('toFloat', function(number) {
    if (!Utils.isUndefined(number)) {
      number = Utils.result(number);
      return parseFloat(number);
    } else {
      return Utils.err('{{toFloat}} takes one argument (number).');
    }
  });

  Swag.addHelper('digitGrouping', function(number, separator) {
    if (!Utils.isUndefined(number)) {
      number = parseFloat(Utils.result(number));
      separator = Utils.isUndefined(separator) ? ',' : Utils.result(separator);
      return number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + separator);
    } else {
      return Utils.err('{{digitGrouping}} takes at least one argument (number).');
    }
  });

  Swag.addHelper('is', function(value, test, options) {
    if (!((Utils.isHandlebarsSpecific(value)) && (Utils.isHandlebarsSpecific(value)))) {
      value = Utils.result(value);
      test = Utils.result(test);
      if (value && value === test) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    } else {
      return Utils.err('{{is}} takes two arguments (string|number, string|number).');
    }
  });

  Swag.addHelper('isnt', function(value, test, options) {
    if (!((Utils.isHandlebarsSpecific(value)) && (Utils.isHandlebarsSpecific(test)))) {
      value = Utils.result(value);
      test = Utils.result(test);
      if (!value || value !== test) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    } else {
      return Utils.err('{{isnt}} takes two arguments (string|number, string|number).');
    }
  });

  Swag.addHelper('gt', function(value, test, options) {
    if (!((Utils.isHandlebarsSpecific(value)) && (Utils.isHandlebarsSpecific(test)))) {
      value = Utils.result(value);
      test = Utils.result(test);
      if (value > test) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    } else {
      return Utils.err('{{gt}} takes two arguments (string|number, string|number).');
    }
  });
  
  


  Swag.addHelper('gradualColors', function(currentValue, maxValue, options) {
    // console.log(currentValue);
    // console.log(maxValue);


    c_i_v = currentValue / maxValue;

    r = parseInt(0 + 220 * (1-c_i_v), 10);
    g = parseInt(180 + 40 * (1-c_i_v), 10);
    b = parseInt(0 + 220 * (1-c_i_v), 10);

    console.log(r, g, b);

    result = 'color:rgb(' + r + ',' + g + ',' + b + ')';


    return new Handlebars.SafeString(result);
  });
  
  Swag.addHelper('abrWords', function(content, options) {
  if (content == "[WORD_-3]") {
    content = "[W_-3]";
  }
  if (content == "[WORD_-2]") {
    content = "[W_-2]";
  }
  if (content == "[WORD_-1]") {
    content = "[W_-1]";
  }
  if (content == "[WORD_+1]") {
    content = "[W_+1]";
  }
  if (content == "[WORD_+2]") {
    content = "[W_+2]";
  }
  if (content == "[WORD_+3]") {
    content = "[W_+3]";
  }
  if (content == "[WORD_-3]") {
    content = "[W_-3]";
  }
  if (content == "[WORD_OTHER]") {
    content = "[W_OTH]";
  }
  if (content == "[CHECK_FAILED]") {
    content = "[FAILED]";
  }
  if (content == "[TREATS]") {
    content = "[T]";
  }
  if (content == "[CAUSES]") {
    content = "[C]";
  }
  if (content == "[PREVENTS]") {
    content = "[P]";
  }
  if (content == "[IS_A]") {
    content = "[IS_A]";
  }
  if (content == "[OTHER]") {
    content = "[OTH]";
  }
  if (content == "[NONE]") {
    content = "[NONE]";
  }
  if (content == "[PART_OF]") {
    content = "[PO]";
  }
  if (content == "[DIAGNOSE_BY_TEST_OR_DRUG]") {
    content = "[D]";
  }
  if (content == "[ASSOCIATED_WITH]") {
    content = "[AW]";
  }
  if (content == "[SIDE_EFFECT]") {
    content = "[SE]";
  }
  if (content == "[SYMPTOM]") {
    content = "[S]";
  }
  if (content == "[LOCATION]") {
    content = "[L]";
  }
  if (content == "[MANIFESTATION]") {
    content = "[M]";
  }
  if (content == "[CONTRAINDICATES]") {
    content = "[CI]";
  }
  return new Handlebars.SafeString(content);
  });

  Swag.addHelper('createPercentage', function(value, options) {
  return Math.round(value * 100);
  });

  function replaceStr(str, pos, value){
    var arr = str.split('');
    arr[pos]=value;
    return arr.join('');
  }
 

  Swag.addHelper('explodeLastSlash', function(value, options) {
    var arrayID = value.split("/");
    return arrayID[arrayID.length - 1];
  });

function objSort() {
    var args = arguments,
        array = args[0],
        case_sensitive, keys_length, key, desc, a, b, i;

    if (typeof arguments[arguments.length - 1] === 'boolean') {
        case_sensitive = arguments[arguments.length - 1];
        keys_length = arguments.length - 1;
    } else {
        case_sensitive = false;
        keys_length = arguments.length;
    }

    return array.sort(function (obj1, obj2) {
        for (i = 1; i < keys_length; i++) {
            key = args[i];
            if (typeof key !== 'string') {
                desc = key[1];
                key = key[0];
                a = obj1[args[i][0]];
                b = obj2[args[i][0]];
            } else {
                desc = false;
                a = obj1[args[i]];
                b = obj2[args[i]];
            }

            if (case_sensitive === false && typeof a === 'string') {
                a = String.prototype.toLowerCase.call(a);
                b = String.prototype.toLowerCase.call(b);
            }

            if (! desc) {
                if (a < b) return -1;
                if (a > b) return 1;
            } else {
                if (a > b) return -1;
                if (a < b) return 1;
            }
        }
        return 0;
    });
} //end of objSort() function

Swag.addHelper('highautomatedEvents', function(searchQuery, content, options) {
  var metadataDescription = content.description;
  var buffer = [];
  var position = metadataDescription.length;

  if (content.automatedEvents){

//  content.features.entities.sort(function(a, b) { 
//     return a["startOffset"] >= b["startOffset"]?1:-1;
//  });
  objSort(content.automatedEvents, 'startOffset', 'endOffset');

  console.log(content.automatedEvents);

  for(var i = content.automatedEvents.length - 1; i >= 0; i --) {
    var entity = content.automatedEvents[i]["label"];
    var startOffset = content.automatedEvents[i]["startOffset"];
    var endOffset = content.automatedEvents[i]["endOffset"];
    console.log(metadataDescription);
  //  console.log("--" + metadataDescription.substring(0, startOffset) + "--");
    //metadataDescription = metadataDescription.html().substring(0, startOffset) + '<span class="highlightEntity" data-toggle="tooltip" data-placement="top" title="Term 1" style="background-color:' + color[i] + '">' + entity + '</span>' + metadataDescription.substring(endOffset, metadataDescription.length);
    //pair = indices[i];
  //  var extractors = content.features.automatedEvents[i]["extractors"].join();
        buffer.unshift('<span class="highlightEntity" data-toggle="tooltip" data-placement="top" style="background-color:yellow">',
                       metadataDescription.substring(startOffset, endOffset),
                       "</span>",
                       metadataDescription.substring(endOffset, position));
        position = startOffset;
    }
    buffer.unshift(metadataDescription.substring(0, position));
    console.log(buffer);
    metadataDescription = buffer.join("");
  }

//if(typeof searchQuery)
    if(searchQuery.match["content.description"])
    {
      var highlightedSearchTerm = searchQuery.match["content.description"].like;
      var regEx = new RegExp("(?![^<>]*>)" + Utils.escapeRegexp(highlightedSearchTerm, '/'), "ig");
      metadataDescription = metadataDescription.replace(regEx, 
        function replacer(match, p1, p2, p3, offset, string){
         return '<span class="highlightedSearchTerm" data-toggle="tooltip" data-placement="bottom" title="Your search term">' + match + '</span>';
      });
    }

    return new Handlebars.SafeString(metadataDescription);
  });

Swag.addHelper('highcrowdEvents', function(searchQuery, content, options) {
  var metadataDescription = content.description;
  var buffer = [];
  var position = metadataDescription.length;

  if (content.crowdEvents){

//  content.features.entities.sort(function(a, b) { 
//     return a["startOffset"] >= b["startOffset"]?1:-1;
//  });
  objSort(content.crowdEvents, 'startOffset', 'endOffset');

  console.log(content.crowdEvents);

  for(var i = content.crowdEvents.length - 1; i >= 0; i --) {
    var entity = content.crowdEvents[i]["label"];
    var startOffset = content.crowdEvents[i]["startOffset"];
    var endOffset = content.crowdEvents[i]["endOffset"];
    console.log(metadataDescription);
  //  console.log("--" + metadataDescription.substring(0, startOffset) + "--");
    //metadataDescription = metadataDescription.html().substring(0, startOffset) + '<span class="highlightEntity" data-toggle="tooltip" data-placement="top" title="Term 1" style="background-color:' + color[i] + '">' + entity + '</span>' + metadataDescription.substring(endOffset, metadataDescription.length);
    //pair = indices[i];
  //  var extractors = content.features.automatedEvents[i]["extractors"].join();
        buffer.unshift('<span class="highlightEntity" data-toggle="tooltip" data-placement="top" style="background-color:yellow">',
                       metadataDescription.substring(startOffset, endOffset),
                       "</span>",
                       metadataDescription.substring(endOffset, position));
        position = startOffset;
    }
    buffer.unshift(metadataDescription.substring(0, position));
    console.log(buffer);
    metadataDescription = buffer.join("");
  }

//if(typeof searchQuery)
    if(searchQuery.match["content.description"])
    {
      var highlightedSearchTerm = searchQuery.match["content.description"].like;
      var regEx = new RegExp("(?![^<>]*>)" + Utils.escapeRegexp(highlightedSearchTerm, '/'), "ig");
      metadataDescription = metadataDescription.replace(regEx, 
        function replacer(match, p1, p2, p3, offset, string){
         return '<span class="highlightedSearchTerm" data-toggle="tooltip" data-placement="bottom" title="Your search term">' + match + '</span>';
      });
    }

    return new Handlebars.SafeString(metadataDescription);
  });

Swag.addHelper('highlightautomatedEvents', function(searchQuery, content, options) {
  var metadataDescription = content.description;
  var buffer = [];
  var position = metadataDescription.length;

  if (content.features.automatedEvents){

//  content.features.entities.sort(function(a, b) { 
//     return a["startOffset"] >= b["startOffset"]?1:-1;
//  });
  objSort(content.features.automatedEvents, 'startOffset', 'endOffset');

  console.log(content.features.automatedEvents);

  for(var i = content.features.automatedEvents.length - 1; i >= 0; i --) {
    var entity = content.features.automatedEvents[i]["label"];
    var startOffset = content.features.automatedEvents[i]["startOffset"];
    var endOffset = content.features.automatedEvents[i]["endOffset"];
    console.log(metadataDescription);
  //  console.log("--" + metadataDescription.substring(0, startOffset) + "--");
    //metadataDescription = metadataDescription.html().substring(0, startOffset) + '<span class="highlightEntity" data-toggle="tooltip" data-placement="top" title="Term 1" style="background-color:' + color[i] + '">' + entity + '</span>' + metadataDescription.substring(endOffset, metadataDescription.length);
    //pair = indices[i];
  //  var extractors = content.features.automatedEvents[i]["extractors"].join();
        buffer.unshift('<span class="highlightEntity" data-toggle="tooltip" data-placement="top" style="background-color:blue">',
                       metadataDescription.substring(startOffset, endOffset),
                       "</span>",
                       metadataDescription.substring(endOffset, position));
        position = startOffset;
    }
    buffer.unshift(metadataDescription.substring(0, position));
    console.log(buffer);
    metadataDescription = buffer.join("");
  }

//if(typeof searchQuery)
    if(searchQuery.match["content.description"])
    {
      var highlightedSearchTerm = searchQuery.match["content.description"].like;
      var regEx = new RegExp("(?![^<>]*>)" + Utils.escapeRegexp(highlightedSearchTerm, '/'), "ig");
      metadataDescription = metadataDescription.replace(regEx, 
        function replacer(match, p1, p2, p3, offset, string){
         return '<span class="highlightedSearchTerm" data-toggle="tooltip" data-placement="bottom" title="Your search term">' + match + '</span>';
      });
    }

    return new Handlebars.SafeString(metadataDescription);
  });

Swag.addHelper('highlightPeople', function(searchQuery, content, options) {
  var metadataDescription = content.description;
  var buffer = [];
  var position = metadataDescription.length;

  if (content.features.people){

//  content.features.entities.sort(function(a, b) { 
//     return a["startOffset"] >= b["startOffset"]?1:-1;
//  });
  objSort(content.features.people, 'startOffset', 'endOffset');

  console.log(content.features.people);

  for(var i = content.features.people.length - 1; i >= 0; i --) {
    var entity = content.features.people[i]["label"];
    var startOffset = content.features.people[i]["startOffset"];
    var endOffset = content.features.people[i]["endOffset"];
    console.log(metadataDescription);
  //  console.log("--" + metadataDescription.substring(0, startOffset) + "--");
    //metadataDescription = metadataDescription.html().substring(0, startOffset) + '<span class="highlightEntity" data-toggle="tooltip" data-placement="top" title="Term 1" style="background-color:' + color[i] + '">' + entity + '</span>' + metadataDescription.substring(endOffset, metadataDescription.length);
    //pair = indices[i];
  //  var extractors = content.features.automatedEvents[i]["extractors"].join();
        buffer.unshift('<span class="highlightEntity" data-toggle="tooltip" data-placement="top" style="background-color:red">',
                       metadataDescription.substring(startOffset, endOffset),
                       "</span>",
                       metadataDescription.substring(endOffset, position));
        position = startOffset;
    }
    buffer.unshift(metadataDescription.substring(0, position));
    console.log(buffer);
    metadataDescription = buffer.join("");
  }

//if(typeof searchQuery)
    if(searchQuery.match["content.description"])
    {
      var highlightedSearchTerm = searchQuery.match["content.description"].like;
      var regEx = new RegExp("(?![^<>]*>)" + Utils.escapeRegexp(highlightedSearchTerm, '/'), "ig");
      metadataDescription = metadataDescription.replace(regEx, 
        function replacer(match, p1, p2, p3, offset, string){
         return '<span class="highlightedSearchTerm" data-toggle="tooltip" data-placement="bottom" title="Your search term">' + match + '</span>';
      });
    }

    return new Handlebars.SafeString(metadataDescription);
  });


Swag.addHelper('highlightOther', function(searchQuery, content, options) {
  var metadataDescription = content.description;
  var buffer = [];
  var position = metadataDescription.length;

  if (content.features.other){

//  content.features.entities.sort(function(a, b) { 
//     return a["startOffset"] >= b["startOffset"]?1:-1;
//  });
  objSort(content.features.other, 'startOffset', 'endOffset');

  console.log(content.features.other);

  for(var i = content.features.other.length - 1; i >= 0; i --) {
    var entity = content.features.other[i]["label"];
    var startOffset = content.features.other[i]["startOffset"];
    var endOffset = content.features.other[i]["endOffset"];
    console.log(metadataDescription);
  //  console.log("--" + metadataDescription.substring(0, startOffset) + "--");
    //metadataDescription = metadataDescription.html().substring(0, startOffset) + '<span class="highlightEntity" data-toggle="tooltip" data-placement="top" title="Term 1" style="background-color:' + color[i] + '">' + entity + '</span>' + metadataDescription.substring(endOffset, metadataDescription.length);
    //pair = indices[i];
  //  var extractors = content.features.automatedEvents[i]["extractors"].join();
        buffer.unshift('<span class="highlightEntity" data-toggle="tooltip" data-placement="top" style="background-color:red">',
                       metadataDescription.substring(startOffset, endOffset),
                       "</span>",
                       metadataDescription.substring(endOffset, position));
        position = startOffset;
    }
    buffer.unshift(metadataDescription.substring(0, position));
    console.log(buffer);
    metadataDescription = buffer.join("");
  }

//if(typeof searchQuery)
    if(searchQuery.match["content.description"])
    {
      var highlightedSearchTerm = searchQuery.match["content.description"].like;
      var regEx = new RegExp("(?![^<>]*>)" + Utils.escapeRegexp(highlightedSearchTerm, '/'), "ig");
      metadataDescription = metadataDescription.replace(regEx, 
        function replacer(match, p1, p2, p3, offset, string){
         return '<span class="highlightedSearchTerm" data-toggle="tooltip" data-placement="bottom" title="Your search term">' + match + '</span>';
      });
    }

    return new Handlebars.SafeString(metadataDescription);
  });

Swag.addHelper('highlightLocation', function(searchQuery, content, options) {
  var metadataDescription = content.description;
  var buffer = [];
  var position = metadataDescription.length;

  if (content.features.location){

//  content.features.entities.sort(function(a, b) { 
//     return a["startOffset"] >= b["startOffset"]?1:-1;
//  });
  objSort(content.features.location, 'startOffset', 'endOffset');

  console.log(content.features.location);

  for(var i = content.features.location.length - 1; i >= 0; i --) {
    var entity = content.features.location[i]["label"];
    var startOffset = content.features.location[i]["startOffset"];
    var endOffset = content.features.location[i]["endOffset"];
    console.log(metadataDescription);
  //  console.log("--" + metadataDescription.substring(0, startOffset) + "--");
    //metadataDescription = metadataDescription.html().substring(0, startOffset) + '<span class="highlightEntity" data-toggle="tooltip" data-placement="top" title="Term 1" style="background-color:' + color[i] + '">' + entity + '</span>' + metadataDescription.substring(endOffset, metadataDescription.length);
    //pair = indices[i];
  //  var extractors = content.features.automatedEvents[i]["extractors"].join();
        buffer.unshift('<span class="highlightEntity" data-toggle="tooltip" data-placement="top" style="background-color:green">',
                       metadataDescription.substring(startOffset, endOffset),
                       "</span>",
                       metadataDescription.substring(endOffset, position));
        position = startOffset;
    }
    buffer.unshift(metadataDescription.substring(0, position));
    console.log(buffer);
    metadataDescription = buffer.join("");
  }

//if(typeof searchQuery)
    if(searchQuery.match["content.description"])
    {
      var highlightedSearchTerm = searchQuery.match["content.description"].like;
      var regEx = new RegExp("(?![^<>]*>)" + Utils.escapeRegexp(highlightedSearchTerm, '/'), "ig");
      metadataDescription = metadataDescription.replace(regEx, 
        function replacer(match, p1, p2, p3, offset, string){
         return '<span class="highlightedSearchTerm" data-toggle="tooltip" data-placement="bottom" title="Your search term">' + match + '</span>';
      });
    }

    return new Handlebars.SafeString(metadataDescription);
  });

Swag.addHelper('highlightTime', function(searchQuery, content, options) {
  var metadataDescription = content.description;
  var buffer = [];
  var position = metadataDescription.length;

  if (content.features.time){

//  content.features.entities.sort(function(a, b) { 
//     return a["startOffset"] >= b["startOffset"]?1:-1;
//  });
  objSort(content.features.time, 'startOffset', 'endOffset');

  console.log(content.features.time);

  for(var i = content.features.time.length - 1; i >= 0; i --) {
    var entity = content.features.time[i]["label"];
    var startOffset = content.features.time[i]["startOffset"];
    var endOffset = content.features.time[i]["endOffset"];
    console.log(metadataDescription);
  //  console.log("--" + metadataDescription.substring(0, startOffset) + "--");
    //metadataDescription = metadataDescription.html().substring(0, startOffset) + '<span class="highlightEntity" data-toggle="tooltip" data-placement="top" title="Term 1" style="background-color:' + color[i] + '">' + entity + '</span>' + metadataDescription.substring(endOffset, metadataDescription.length);
    //pair = indices[i];
  //  var extractors = content.features.automatedEvents[i]["extractors"].join();
        buffer.unshift('<span class="highlightEntity" data-toggle="tooltip" data-placement="top" style="background-color:yellow">',
                       metadataDescription.substring(startOffset, endOffset),
                       "</span>",
                       metadataDescription.substring(endOffset, position));
        position = startOffset;
    }
    buffer.unshift(metadataDescription.substring(0, position));
    console.log(buffer);
    metadataDescription = buffer.join("");
  }

//if(typeof searchQuery)
    if(searchQuery.match["content.description"])
    {
      var highlightedSearchTerm = searchQuery.match["content.description"].like;
      var regEx = new RegExp("(?![^<>]*>)" + Utils.escapeRegexp(highlightedSearchTerm, '/'), "ig");
      metadataDescription = metadataDescription.replace(regEx, 
        function replacer(match, p1, p2, p3, offset, string){
         return '<span class="highlightedSearchTerm" data-toggle="tooltip" data-placement="bottom" title="Your search term">' + match + '</span>';
      });
    }

    return new Handlebars.SafeString(metadataDescription);
  });

  // highlight terms based on tags
  Swag.addHelper('highlightTagged', function(searchQuery, passage, options) {
    
	passage = passage.replace(/{/g, '<span class="highlightTermOne" data-toggle="tooltip" data-placement="top" title="Term 1">').replace(/}/g, '</span>');
	passage = passage.replace(/\[/g, '<span class="highlightTermTwo" data-toggle="tooltip" data-placement="top" title="Term 2">').replace(/\]/g, '</span>');

	// get search field
	for(search in searchQuery.match) {
		if(search != "documentType") {
			var match = search;
		}
	}
	
    if(searchQuery.match[match])
    {
      var highlightedSearchTerm = searchQuery.match[match].like;
      var regEx = new RegExp("(?![^<>]*>)" + Utils.escapeRegexp(highlightedSearchTerm, '/'), "ig");
   //   formattedSentence = formattedSentence.replace(regEx, '<span class="highlightedSearchTerm" data-toggle="tooltip" data-placement="top" title="Your search term">$1</span>');

      passage = passage.replace(regEx, 
        function replacer(match, p1, p2, p3, offset, string){
          // p1 is nondigits, p2 digits, and p3 non-alphanumerics
          return '<span class="highlightedSearchTerm" data-toggle="tooltip" data-placement="bottom" title="Your search term">' + match + '</span>';
      });
    }
	
    return new Handlebars.SafeString(passage);
  });

  
  // highlight terms
  Swag.addHelper('highlightTerms', function(searchQuery, content, options) {
    var formattedSentence = content.sentence.formatted;
    var t1 = content.terms.first.formatted;
    var t2 = content.terms.second.formatted;

	formattedSentence = formattedSentence.replace(t1, '<span class="highlightTermOne" data-toggle="tooltip" data-placement="top" title="Term 1">' + t1 + '</span>');
	formattedSentence = formattedSentence.replace(t2, '<span class="highlightTermTwo" data-toggle="tooltip" data-placement="top" title="Term 2">' + t2 + '</span>');
    
	var relation = content.relation.noPrefix;
    if(relation == "diagnose")
    {
      relation = "diagnos";
    } else if(relation == "cause")
    {
      relation = "caus";
    } else if(relation == "location")
    {
      relation = "locat";
    }

    var regEx = new RegExp(relation, "ig");
    formattedSentence = formattedSentence.replace(regEx, '<span class="highlightRelation" data-toggle="tooltip" data-placement="top" title="Possible Relation">' + relation + '</span>');

    var regEx = new RegExp(";", "g");
    formattedSentence = formattedSentence.replace(regEx, '<span class="highlightSemicolon" data-toggle="tooltip" data-placement="top" title="Semicolon">;</span>');

    if(searchQuery.match["content.sentence.formatted"])
    {
      var highlightedSearchTerm = searchQuery.match["content.sentence.formatted"].like;
      var regEx = new RegExp("(?![^<>]*>)" + Utils.escapeRegexp(highlightedSearchTerm, '/'), "ig");
   //   formattedSentence = formattedSentence.replace(regEx, '<span class="highlightedSearchTerm" data-toggle="tooltip" data-placement="top" title="Your search term">$1</span>');

      formattedSentence = formattedSentence.replace(regEx, 
        function replacer(match, p1, p2, p3, offset, string){
          // p1 is nondigits, p2 digits, and p3 non-alphanumerics
          return '<span class="highlightedSearchTerm" data-toggle="tooltip" data-placement="bottom" title="Your search term">' + match + '</span>';
      });
    }

    return new Handlebars.SafeString(formattedSentence);
  });

Swag.addHelper('highlightTermsInVideoAbstract', function(searchQuery, content, options) {
    var searchFieldAbstract = this.content.metadata.abstract.nl;
    var searchFieldTitle = this.content.metadata.title.nl;
    var searchFieldSubject = this.content.metadata.subject.nl;
    var searchFieldDescription = this.content.metadata.description.nl;
    var searchFieldSpatial = this.content.metadata.spatial.nl;
 
     if(searchQuery.match["content.metadata.abstract.nl"]) {
      var highlightedSearchTerm = searchQuery.match["content.metadata.abstract.nl"].like;
      var regEx = new RegExp("(?![^<>]*>)" + Utils.escapeRegexp(highlightedSearchTerm, '/'), "ig");

      searchFieldAbstract = searchFieldAbstract.replace(regEx, 
        function replacer(match, p1, p2, p3, offset, string){
          // p1 is nondigits, p2 digits, and p3 non-alphanumerics
          return '<span class="highlightedSearchTerm" data-toggle="tooltip" data-placement="bottom" title="Your search term">' + match + '</span>';
      });
    }
    return new Handlebars.SafeString(searchFieldAbstract);
  });

Swag.addHelper('highlightTermsInVideoAbstract', function(searchQuery, content, options) {
    var searchFieldAbstract = this.content.metadata.abstract.nl;
    if(searchQuery.match["content.metadata.abstract.nl"]) {
      var highlightedSearchTerm = searchQuery.match["content.metadata.abstract.nl"].like;
      var regEx = new RegExp("(?![^<>]*>)" + Utils.escapeRegexp(highlightedSearchTerm, '/'), "ig");

      searchFieldAbstract = searchFieldAbstract.replace(regEx, 
        function replacer(match, p1, p2, p3, offset, string){
          // p1 is nondigits, p2 digits, and p3 non-alphanumerics
          return '<span class="highlightedSearchTerm" data-toggle="tooltip" data-placement="bottom" title="Your search term">' + match + '</span>';
      });
    }
    return new Handlebars.SafeString(searchFieldAbstract);
  });

Swag.addHelper('highlightTermsInVideoTitle', function(searchQuery, content, options) {
    var searchFieldTitle = this.content.metadata.title.nl;
 
     if(searchQuery.match["content.metadata.title.nl"]) {
      var highlightedSearchTerm = searchQuery.match["content.metadata.title.nl"].like;
      var regEx = new RegExp("(?![^<>]*>)" + Utils.escapeRegexp(highlightedSearchTerm, '/'), "ig");

      searchFieldTitle = searchFieldTitle.replace(regEx, 
        function replacer(match, p1, p2, p3, offset, string){
          // p1 is nondigits, p2 digits, and p3 non-alphanumerics
          return '<span class="highlightedSearchTerm" data-toggle="tooltip" data-placement="bottom" title="Your search term">' + match + '</span>';
      });
    }
    return new Handlebars.SafeString(searchFieldTitle);
  });

Swag.addHelper('highlightTermsInVideoSubject', function(searchQuery, content, options) {
    var searchFieldSubject = this.content.metadata.subject.nl.join();
 
     if(searchQuery.match["content.metadata.subject.nl"]) {
      var highlightedSearchTerm = searchQuery.match["content.metadata.subject.nl"].like;
      var regEx = new RegExp("(?![^<>]*>)" + Utils.escapeRegexp(highlightedSearchTerm, '/'), "ig");

      searchFieldSubject = searchFieldSubject.replace(regEx, 
        function replacer(match, p1, p2, p3, offset, string){
          // p1 is nondigits, p2 digits, and p3 non-alphanumerics
          return '<span class="highlightedSearchTerm" data-toggle="tooltip" data-placement="bottom" title="Your search term">' + match + '</span>';
      });
    }
    return new Handlebars.SafeString(searchFieldSubject);
  });

Swag.addHelper('highlightTermsInVideoSpatial', function(searchQuery, content, options) {
    var searchFieldSpatial = this.content.metadata.spatial.nl.join();
 
     if(searchQuery.match["content.metadata.spatial.nl"]) {
      var highlightedSearchTerm = searchQuery.match["content.metadata.spatial.nl"].like;
      var regEx = new RegExp("(?![^<>]*>)" + Utils.escapeRegexp(highlightedSearchTerm, '/'), "ig");

      searchFieldSpatial = searchFieldSpatial.replace(regEx, 
        function replacer(match, p1, p2, p3, offset, string){
          // p1 is nondigits, p2 digits, and p3 non-alphanumerics
          return '<span class="highlightedSearchTerm" data-toggle="tooltip" data-placement="bottom" title="Your search term">' + match + '</span>';
      });
    }
    return new Handlebars.SafeString(searchFieldSpatial);
  });

Swag.addHelper('ifarray', function(object, options) {
    if (object.constructor === Array) return object[0];
    else return object;

  });

Swag.addHelper('booltostring', function(object, options) {
  
  return object.toString();;

  });

Swag.addHelper('addDocumentTypeLabel', function(documentType, options) {
    var documentTypeLabel = documentType;
    if (documentType == "fullvideo") {
	documentTypeLabel = "Sound & Vision News Video";
    }
    if (documentType == "relex-structured-sentence") {
	documentTypeLabel = "Watson Medical RelEx Sentence";
    }
    if (documentType == "painting") {
	documentTypeLabel = "Rijksmuseum Painting";
    }
    if (documentType == "drawing") {
	documentTypeLabel = "Rijksmuseum Drawing";
    }
    
    return documentTypeLabel;
  });

  Swag.addHelper('gte', function(value, test, options) {
    if (!((Utils.isHandlebarsSpecific(value)) && (Utils.isHandlebarsSpecific(test)))) {
      value = Utils.result(value);
      test = Utils.result(test);
      if (value >= test) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    } else {
      return Utils.err('{{gte}} takes two arguments (string|number, string|number).');
    }
  });

  Swag.addHelper('lt', function(value, test, options) {
    if (!((Utils.isHandlebarsSpecific(value)) && (Utils.isHandlebarsSpecific(test)))) {
      value = Utils.result(value);
      test = Utils.result(test);
      if (value < test) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    } else {
      return Utils.err('{{lt}} takes two arguments (string|number, string|number).');
    }
  });

  Swag.addHelper('lte', function(value, test, options) {
    if (!((Utils.isHandlebarsSpecific(value)) && (Utils.isHandlebarsSpecific(test)))) {
      value = Utils.result(value);
      test = Utils.result(test);
      if (value <= test) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    } else {
      return Utils.err('{{lte}} takes two arguments (string|number, string|number).');
    }
  });

  Swag.addHelper('or', function(testA, testB, options) {
    if (!((Utils.isHandlebarsSpecific(testA)) && (Utils.isHandlebarsSpecific(testB)))) {
      testA = Utils.result(testA);
      testB = Utils.result(testB);
      if (testA || testB) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    } else {
      return Utils.err('{{or}} takes two arguments (string|number, string|number).');
    }
  });

  Swag.addHelper('and', function(testA, testB, options) {
    if (!((Utils.isHandlebarsSpecific(testA)) && (Utils.isHandlebarsSpecific(testB)))) {
      testA = Utils.result(testA);
      testB = Utils.result(testB);
      if (testA && testB) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    } else {
      return Utils.err('{{and}} takes two arguments (string|number, string|number).');
    }
  });

  Dates = {};

  Dates.padNumber = function(num, count, padCharacter) {
    var lenDiff, padding;
    if (typeof padCharacter === 'undefined') {
      padCharacter = '0';
    }
    lenDiff = count - String(num).length;
    padding = '';
    if (lenDiff > 0) {
      while (lenDiff--) {
        padding += padCharacter;
      }
    }
    return padding + num;
  };

  Dates.dayOfYear = function(date) {
    var oneJan;
    oneJan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((date - oneJan) / 86400000);
  };

  Dates.weekOfYear = function(date) {
    var oneJan;
    oneJan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((((date - oneJan) / 86400000) + oneJan.getDay() + 1) / 7);
  };

  Dates.isoWeekOfYear = function(date) {
    var dayDiff, dayNr, jan4, target;
    target = new Date(date.valueOf());
    dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    jan4 = new Date(target.getFullYear(), 0, 4);
    dayDiff = (target - jan4) / 86400000;
    return 1 + Math.ceil(dayDiff / 7);
  };

  Dates.tweleveHour = function(date) {
    if (date.getHours() > 12) {
      return date.getHours() - 12;
    } else {
      return date.getHours();
    }
  };

  Dates.timeZoneOffset = function(date) {
    var hoursDiff, result;
    hoursDiff = -date.getTimezoneOffset() / 60;
    result = Dates.padNumber(Math.abs(hoursDiff), 4);
    return (hoursDiff > 0 ? '+' : '-') + result;
  };

  Dates.format = function(date, format) {
    return format.replace(Dates.formats, function(m, p) {
      switch (p) {
        case 'a':
          return Dates.abbreviatedWeekdays[date.getDay()];
        case 'A':
          return Dates.fullWeekdays[date.getDay()];
        case 'b':
          return Dates.abbreviatedMonths[date.getMonth()];
        case 'B':
          return Dates.fullMonths[date.getMonth()];
        case 'c':
          return date.toLocaleString();
        case 'C':
          return Math.round(date.getFullYear() / 100);
        case 'd':
          return Dates.padNumber(date.getDate(), 2);
        case 'D':
          return Dates.format(date, '%m/%d/%y');
        case 'e':
          return Dates.padNumber(date.getDate(), 2, ' ');
        case 'F':
          return Dates.format(date, '%Y-%m-%d');
        case 'h':
          return Dates.format(date, '%b');
        case 'H':
          return Dates.padNumber(date.getHours(), 2);
        case 'I':
          return Dates.padNumber(Dates.tweleveHour(date), 2);
        case 'j':
          return Dates.padNumber(Dates.dayOfYear(date), 3);
        case 'k':
          return Dates.padNumber(date.getHours(), 2, ' ');
        case 'l':
          return Dates.padNumber(Dates.tweleveHour(date), 2, ' ');
        case 'L':
          return Dates.padNumber(date.getMilliseconds(), 3);
        case 'm':
          return Dates.padNumber(date.getMonth() + 1, 2);
        case 'M':
          return Dates.padNumber(date.getMinutes(), 2);
        case 'n':
          return '\n';
        case 'p':
          if (date.getHours() > 11) {
            return 'PM';
          } else {
            return 'AM';
          }
        case 'P':
          return Dates.format(date, '%p').toLowerCase();
        case 'r':
          return Dates.format(date, '%I:%M:%S %p');
        case 'R':
          return Dates.format(date, '%H:%M');
        case 's':
          return date.getTime() / 1000;
        case 'S':
          return Dates.padNumber(date.getSeconds(), 2);
        case 't':
          return '\t';
        case 'T':
          return Dates.format(date, '%H:%M:%S');
        case 'u':
          if (date.getDay() === 0) {
            return 7;
          } else {
            return date.getDay();
          }
        case 'U':
          return Dates.padNumber(Dates.weekOfYear(date), 2);
        case 'v':
          return Dates.format(date, '%e-%b-%Y');
        case 'V':
          return Dates.padNumber(Dates.isoWeekOfYear(date), 2);
        case 'W':
          return Dates.padNumber(Dates.weekOfYear(date), 2);
        case 'w':
          return Dates.padNumber(date.getDay(), 2);
        case 'x':
          return date.toLocaleDateString();
        case 'X':
          return date.toLocaleTimeString();
        case 'y':
          return String(date.getFullYear()).substring(2);
        case 'Y':
          return date.getFullYear();
        case 'z':
          return Dates.timeZoneOffset(date);
        default:
          return match;
      }
    });
  };

  Dates.formats = /%(a|A|b|B|c|C|d|D|e|F|h|H|I|j|k|l|L|m|M|n|p|P|r|R|s|S|t|T|u|U|v|V|W|w|x|X|y|Y|z)/g;

  Dates.abbreviatedWeekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];

  Dates.fullWeekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  Dates.abbreviatedMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  Dates.fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  Swag.addHelper('formatDate', function(date, format) {
    if (!Utils.isUndefined(date)) {
      date = Utils.result(date);
      format = Utils.result(format);
      date = new Date(date);
      return Dates.format(date, format);
    } else {
      return Utils.err('{{formatDate}} takes two arguments (string|number|date, string).');
    }
  });

  Swag.addHelper('now', function(format) {
    var date;
    if (!Utils.isUndefined(format)) {
      format = Utils.result(format);
    }
    date = new Date();
    if (Utils.isUndefined(format)) {
      return date;
    } else {
      return Dates.format(date, format);
    }
  });

  Swag.addHelper('timeago', function(date) {
    var interval, seconds;
    if (!Utils.isUndefined(date)) {
      date = Utils.result(date);
      date = new Date(date);
      seconds = Math.floor((new Date() - date) / 1000);
      interval = Math.floor(seconds / 31536000);
      if (interval > 1) {
        return "" + interval + " years ago";
      }
      interval = Math.floor(seconds / 2592000);
      if (interval > 1) {
        return "" + interval + " months ago";
      }
      interval = Math.floor(seconds / 86400);
      if (interval > 1) {
        return "" + interval + " days ago";
      }
      interval = Math.floor(seconds / 3600);
      if (interval > 1) {
        return "" + interval + " hours ago";
      }
      interval = Math.floor(seconds / 60);
      if (interval > 1) {
        return "" + interval + " minutes ago";
      }
      if (Math.floor(seconds) === 0) {
        return 'Just now';
      } else {
        return Math.floor(seconds) + ' seconds ago';
      }
    } else {
      return Utils.err('{{timeago}} takes one argument (string|number|date).');
    }
  });

  Swag.addHelper('inflect', function(count, singular, plural, include) {
    var word;
    if (!((Utils.isUndefined(count)) && (Utils.isUndefined(singular)) && (Utils.isUndefined(plural)))) {
      count = parseFloat(Utils.result(count));
      singular = Utils.result(singular);
      plural = Utils.result(plural);
      word = count > 1 || count === 0 ? plural : singular;
      if (Utils.isUndefined(include) || include === false) {
        return word;
      } else {
        return "" + count + " " + word;
      }
    } else {
      return Utils.err('{{inflect}} takes at least three arguments (number, string, string).');
    }
  });

  Swag.addHelper('ordinalize', function(value) {
    var normal, _ref;
    if (!Utils.isUndefined(value)) {
      value = parseFloat(Utils.result(value));
      normal = Math.abs(Math.round(value));
      if (_ref = normal % 100, __indexOf.call([11, 12, 13], _ref) >= 0) {
        return "" + value + "th";
      } else {
        switch (normal % 10) {
          case 1:
            return "" + value + "st";
          case 2:
            return "" + value + "nd";
          case 3:
            return "" + value + "rd";
          default:
            return "" + value + "th";
        }
      }
    } else {
      return Utils.err('{{ordinalize}} takes one arguments (number).');
    }
  });

  HTML = {};

  HTML.parseAttributes = function(hash) {
    return Object.keys(hash).map(function(key) {
      return "" + key + "=\"" + hash[key] + "\"";
    }).join(' ');
  };

  Swag.addHelper('ul', function(context, options) {
    return ("<ul " + (HTML.parseAttributes(options.hash)) + ">") + context.map(function(item) {
      return "<li>" + (options.fn(Utils.result(item))) + "</li>";
    }).join('\n') + "</ul>";
  });

  Swag.addHelper('ol', function(context, options) {
    return ("<ol " + (HTML.parseAttributes(options.hash)) + ">") + context.map(function(item) {
      return "<li>" + (options.fn(Utils.result(item))) + "</li>";
    }).join('\n') + "</ol>";
  });

  Swag.addHelper('br', function(count, options) {
    var br, i;
    br = '<br>';
    if (!Utils.isUndefined(count)) {
      i = 0;
      count = Utils.result(count);
      while (i < (parseFloat(count)) - 1) {
        br += '<br>';
        i++;
      }
    }
    return Utils.safeString(br);
  });

  Swag.addHelper('log', function(value) {
    if (!Utils.isUndefined(value)) {
      value = Utils.result(value);
      return console.log(value);
    } else {
      return Utils.err('{{log}} takes one arguments (string|number|boolean|array|object).');
    }
  });

  Swag.addHelper('debug', function(value) {
    if (!Utils.isUndefined(value)) {
      value = Utils.result(value);
    }
    console.log('Context: ', this);
    if (!Utils.isUndefined(value)) {
      console.log('Value: ', value);
    }
    return console.log('-----------------------------------------------');
  });

  Swag.addHelper('default', function(value, defaultValue) {
    if (!((Utils.isHandlebarsSpecific(value)) && (Utils.isUndefined(defaultValue)))) {
      value = Utils.result(value);
      defaultValue = Utils.result(defaultValue);
      return value || defaultValue;
    } else {
      return Utils.err('{{default}} takes two arguments (string|number, string|number).');
    }
  });

  if (typeof Ember === "undefined" || Ember === null) {
    Swag.addHelper('partial', function(name, data, template) {
      var path;
      if (!(Utils.isUndefined(name))) {
        name = Utils.result(name);
        data = Utils.result(data);
        path = Swag.Config.partialsPath + name;
        if (!Utils.isUndefined(template)) {
          template = Utils.result(template);
        }
        if (Swag.Handlebars.partials[name] == null) {
          if (!Utils.isUndefined(template)) {
            if (Utils.isString(template)) {
              template = Swag.Handlebars.compile(template);
            }
            Swag.Handlebars.registerPartial(name, template);
          } else if ((typeof define !== "undefined" && define !== null) && (Utils.isFunc(define)) && define.amd) {
            if (!Swag.Config.precompiledTemplates) {
              path = "!text" + path;
            }
            require([path], function(template) {
              if (Utils.isString(template)) {
                template = Swag.Handlebars.compile(template);
              }
              return Swag.Handlebars.registerPartial(name, template);
            });
          } else if (typeof require !== "undefined" && require !== null) {
            template = require(path);
            if (Utils.isString(template)) {
              template = Swag.Handlebars.compile(template);
            }
            Swag.Handlebars.registerPartial(name, template);
          } else {
            Utils.err('{{partial}} no amd or commonjs module support found.');
          }
        }
        return Utils.safeString(Swag.Handlebars.partials[name](data));
      } else {
        return Utils.err('{{partial}} takes at least one argument (string).');
      }
    });
  }

}).call(this);
