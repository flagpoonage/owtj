const { Buffer } = require('buffer');
const http = require('http');

// Configuration options. By default, functions are not displayed,
// circular references are displayed as [Circular]
let options = {
  function_display: undefined,
  circular_display: '[Circular]'
};

// Main recursion function.
const refrecurse = function (object, reflog) {

  // Functions are not returned at all, because
  // thats JSON's thing. But could probably make this
  // optional to have a more console loggy feel
  if (typeof object === 'function') {
    return options.function_display;
  }

  // Primitives and null will stringify just fine.
  if (typeof object === 'string' ||
      typeof object === 'number' ||
      typeof object === 'boolean' ||
      !object) {
    
    return object;
  }

  // If this object exists already at a higher level,
  // then this is a circular reference.
  if(reflog.indexOf(object) > -1) {
    return options.circular_display;
  }

  // This is a referenced object, so add it to the 
  // reference list.
  reflog.push(object);
  
  // Arrays need to be looped over for each object
  if (Array.isArray(object)) {
  
    // Run on each object.
    let out = object.map(a => refrecurse(a, reflog));

    // Remove this objects reference before we return to
    // the previous level. This prevents objects that are
    // used in multiple places being marked as circular.
    reflog.splice(reflog.length - 1, 1);
    return out;
  }

  // Buffers often in occur in HTTP responses, generally
  // we don't want the individual bytes to be logged.
  if (Buffer.isBuffer(object)) {
    return Buffer.toString('utf8');
  }

  // Don't overwrite the current object silly billy, thats a recipe
  // for distater. Create a new object to mimic the old.
  let object_out = {};

  // For standard objects, loop over each property.
  for(var i in object) {
    object_out[i] = refrecurse(object[i], reflog);
  }

  // Remove this reference, see above.
  reflog.splice(reflog.length - 1, 1);

  // Return out to the calling recursion
  return object_out;
};


// Main function, past remainder of parameters to JSON.stringify

const exp = (object, ...params) => 
  JSON.stringify(refrecurse(object, []), ...params);

// Allow configuration of circular and function displays.
exp.configure = params => {
  options = Object.assign(options, params);
};

module.exports = exp;