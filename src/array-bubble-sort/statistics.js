function average(values) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce(function (sum, a) { return sum + a }, 0) / (values.length || 1);
}

// https://stackoverflow.com/questions/45309447/calculating-median-javascript
function median(values) {
  if (values.length === 0) {
    return 0;
  }

  values.sort(function (a, b) {
    return a - b;
  });

  var half = Math.floor(values.length / 2);

  if (values.length % 2) {
    return values[half];
  }

  return (values[half - 1] + values[half]) / 2.0;
}

// https://medium.com/@nhuynh/finding-mode-javascript-ffb40af2708f
function mode(arr) {
  return arr.reduce(function (current, num) {
    const freq = (num in current.numMap) ? ++current.numMap[num] : (current.numMap[num] = 1)
    if (freq > current.modeFreq && freq > 1) {
      current.modeFreq = freq
      current.mode = num
    }
    return current;
  }, { mode: null, modeFreq: 0, numMap: {} }).mode
}

// https://gist.github.com/IceCreamYou/6ffa1b18c4c8f6aeaad2
// Returns the value at a given percentile in a sorted numeric array.
// "Linear interpolation between closest ranks" method
function percentile(arr, p) {
  if (arr.length === 0) {
    return 0;
  }
  if (typeof p !== 'number') {
    throw new TypeError('p must be a number');
  }
  if (p <= 0) {
    return arr[0];
  }
  if (p >= 1) {
    return arr[arr.length - 1];
  }

  var index = (arr.length - 1) * p,
    lower = Math.floor(index),
    upper = lower + 1,
    weight = index % 1;

  if (upper >= arr.length) {
    return arr[lower];
  }
  return arr[lower] * (1 - weight) + arr[upper] * weight;
}
// Returns the percentile of the given value in a sorted numeric array.
function percentRank(arr, v) {
  if (typeof v !== 'number') {
    throw new TypeError('v must be a number');
  }
  for (var i = 0, l = arr.length; i < l; i++) {
    if (v <= arr[i]) {
      while (i < l && v === arr[i]) {
        i++;
      }
      if (i === 0) {
        return 0;
      }
      if (v !== arr[i - 1]) {
        i += (v - arr[i - 1]) / (arr[i] - arr[i - 1]);
      }
      return i / l;
    }
  }
  return 1;
}