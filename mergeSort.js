function mergeSort(arr) {
  if (arr.length === 0) return arr;
  if (arr.length === 1) return arr;
  else {
    let array = [];
    let half = Math.ceil(arr.length / 2);
    console.log(half)
    let left = arr.slice(0, half);
    let right = arr.slice(half);

    let sortedLeft = mergeSort(left);
    let sortedRight = mergeSort(right);
    let length = sortedLeft.length; // 2

    

    for (let i = 0; i < length * 2; i++) {
      if (sortedLeft.length === 0) {
        array = [...array, ...sortedRight];
        sortedRight = [];
      } else if (sortedRight.length === 0) {
        array = [...array, ...sortedLeft];
        sortedLeft = [];
      }

      if (sortedLeft.length && sortedRight.length) {
        if (sortedLeft[0] > sortedRight[0]) {
          array.push(sortedRight.shift());
        } else {
          array.push(sortedLeft.shift());
        }
      }
    }

    return array;
  }
}
