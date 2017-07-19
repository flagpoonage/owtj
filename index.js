
// Main recursion function.
const refrecurse = function (object, reflog) {

  // Functions are not returned at all, because
  // thats JSON's thing. But could probably make this
  // optional to have a more console loggy feel
  if (typeof object === 'function') {
    return;
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
    return '[Circular]';
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

  // For standard objects, loop over each property.
  for(var i in object) {
    object[i] = refrecurse(object[i], reflog);
  }

  // Remove this reference, see above.
  reflog.splice(reflog.length - 1, 1);

  // Return out to the calling recursion
  return object;
};


// Main function, past remainder of parameters to JSON.stringify

const exp = (object, ...params) => 
  JSON.stringify(refrecurse(object, []), ...params);

module.exports = exp;