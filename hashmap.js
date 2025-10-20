function hash(key, capacity) {
  let hashCode = 0;

  const primeNumber = 31;
  for (let i = 0; i < key.length; i++) {
    hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % capacity;
  }
  return hashCode;
}

class HashMap {
  #loadFactor;
  #capacity;
  #bucket;

  constructor() {
    this.#capacity = 16;
    this.#bucket = new Array(this.#capacity);
    this.#loadFactor = 0.75;
  }

  static indexOf(key, array) {
    for (let i = 0; i < array.length; i++) {
      if (array[i] === undefined) continue;
      if (Array.isArray(array[i])) {
        let innerIndex = this.indexOf(key, array[i]);
        if (innerIndex >= 0) return innerIndex;
      } else {
        const [[existingKey, value]] = Object.entries(array[i]);
        if (existingKey === key) return i;
      }
    }
    return -1;
  }

  grow(){
    if (this.length() > (this.#capacity * this.#loadFactor)){
        this.#capacity *= 2;
        const oldArray = this.#bucket
        this.#bucket = new Array(this.#capacity)
        for (const item of oldArray){
            if (item === undefined) continue;
            else if (Array.isArray(item)){
                item.forEach(object =>{
                    const [[existingKey, value]] = Object.entries(object);
                    this.set(existingKey, value)
                })
            }
            else{
                const [[existingKey, value]] = Object.entries(item);
                this.set(existingKey, value)
            }
        }
    }
  }

  set(key, value) {
    const newObject = { [key]: value };
    const hashCode = hash(key, this.#capacity);
    if (hashCode < 0 || hashCode >= this.#capacity) {
      throw new Error("Trying to access index out of bounds");
    }
    const existingValues = this.#bucket[hashCode];

    //add if empty
    if (existingValues === undefined) {
      this.#bucket[hashCode] = newObject;
      this.grow();
    }
    //if a single object exists, check if same and replace or turn into array if not same
    else if (!Array.isArray(existingValues)) {
      const [[existingKeyName, val]] = Object.entries(existingValues);
      if (existingKeyName === key)
        this.#bucket[hashCode][existingKeyName] = value;
      else {
        this.#bucket[hashCode] = [existingValues, newObject];
        this.grow();
      }
    }
    //else if more than 1 (array) exists
    else {
      const index = HashMap.indexOf(key, this.#bucket);
      //push if its unique
      if (index == -1) {
        this.#bucket[hashCode] = [...existingValues, newObject];
      }
      //replace if the same
      if (index) {
        this.#bucket[hashCode][index] = newObject;
      }
    }
  }

  get(key) {
    let code = hash(key, this.#capacity);
    if (this.#bucket[code] && Array.isArray(this.#bucket[code])) {
      for (let i = 0; i < this.#bucket[code].length; i++) {
        const [[existingKey, value]] = Object.entries(this.#bucket[code][i]);
        if (existingKey === key) return value;
      }
      return null;
    } else {
      return this.#bucket[code]?.[key] ?? null;
    }
  }

  has(key) {
    let code = hash(key, this.#capacity);
    if (this.#bucket[code] && Array.isArray(this.#bucket[code])) {
      for (let i = 0; i < this.#bucket[code].length; i++) {
        const [[existingKey, value]] = Object.entries(this.#bucket[code][i]);
        if (existingKey === key) return true;
      }
      return false;
    } else {
      return this.#bucket[code]?.[key] ? true : false;
    }
  }

  remove(key) {
    let code = hash(key, this.#capacity);

    if (this.has(key) === false) return false;
    else {
      if (Array.isArray(this.#bucket[code])) {
        let newArray = this.#bucket[code].filter((object) => {
          let existingKey = Object.keys(object)[0];
          return existingKey !== key;
        });
        this.#bucket[code] = newArray;
        return true;
      } else {
        this.#bucket[code] = undefined;
        return true;
      }
    }
  }

  length() {
    let length = 0;
    for (let i = 0; i < this.#bucket.length; i++) {
      if (Array.isArray(this.#bucket[i])) {
        length += this.#bucket[i].length;
      } else if (this.#bucket[i] !== undefined) {
        length++;
      }
    }
    return length;
  }

  clear() {
    this.#capacity = 16
    this.#bucket = new Array(this.#capacity);
  }

  keys() {
    let array = [];
    for (let i = 0; i < this.#bucket.length; i++) {
      if (Array.isArray(this.#bucket[i])) {
        for (let j = 0; j < this.#bucket[i].length; j++) {
          array.push(Object.keys(this.#bucket[i][j])[0]);
        }
      } else {
        if (this.#bucket[i]) {
            array.push(Object.keys(this.#bucket[i])[0]);
        }
        else continue;
      }
    }
    return array;
  }

  values(){
    let array = [];
    for (let i = 0; i < this.#bucket.length; i++) {
      if (Array.isArray(this.#bucket[i])) {
        for (let j = 0; j < this.#bucket[i].length; j++) {
          array.push(Object.values(this.#bucket[i][j])[0]);
        }
      } else {
        if (this.#bucket[i]) {
            array.push(Object.values(this.#bucket[i])[0]);
        }
        else continue;
      }
    }
    return array;
  }

  entries(){
    let array = [];
    for (let i = 0; i < this.#bucket.length; i++) {
      if (Array.isArray(this.#bucket[i])) {
        for (let j = 0; j < this.#bucket[i].length; j++) {
          array.push(Object.entries(this.#bucket[i][j])[0]);
        }
      } else {
        if (this.#bucket[i]) {
            array.push(Object.entries(this.#bucket[i])[0]);
        }
        else continue;
      }
    }
    return array;
  }

  log() {
    console.log(this.#bucket);
    console.log('capacity ', this.#capacity)
  }
}

