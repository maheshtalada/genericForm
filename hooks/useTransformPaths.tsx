function traversePath(obj, path, value) {
  
  let currentPathKey = path.shift();
  let indexComponent = currentPathKey.match(/\(([0-9]*)\)/),
  isArrayItem = indexComponent !== null,
  arrayIndex = (isArrayItem) ? indexComponent[1] : null;
  // parenthesis not used in actual path key creation, strip it
  currentPathKey = currentPathKey.replace(/\([0-9]*\)/, '');
  if (!obj[currentPathKey]) {
    // Key does not exist. Either create array or object.
    if (isArrayItem) {
      obj[currentPathKey] = [];
    } else {
      obj[currentPathKey] = {};
    }
  }
  
  if (isArrayItem) {
    // For arrays, add the index back into the set of paths to
    // traverse. The array will later be re-indexed to ensure
    // indexes are consecutive and dense.
    if (arrayIndex === '') {
      // Maintain backwards compatibility. Assume 0 index for
      // unspecified indexes
      arrayIndex = '0';
    }
    path.unshift(arrayIndex);
  }
  
  if (path.length === 0) {
    // At the last point in the path we can set the value directly
    obj[currentPathKey] = value;
  } else {
    // Otherwise recursively continue to go down the path
    traversePath(obj[currentPathKey], path, value);
  }
}

function isObject(obj) {	
  return typeof obj === 'object' && obj !== null && ! Array.isArray(obj)
};

function removeEmptyItems(input, data) {
  for (const index in input) {
    if (isObject(input[index]) && !data.hasOwnProperty(index)) {
      delete input[index]
    }
    
    if(index === 'undefined'){
      delete input[index]
    }
  }
}

function useTransformer(input) {
  const transformed = {};
  // Loop through each key/value pair
  // Deconstruct each key into an array of path components
  for (const pathString in input) {
    const pathComponents = pathString.split('.'),
    path = pathComponents.slice(0);
    path.length > 0 && !transformed[pathString] && traversePath(transformed, path, input[pathString]);
  }
  removeEmptyItems(transformed, input);
  return transformed;
}

export default useTransformer;