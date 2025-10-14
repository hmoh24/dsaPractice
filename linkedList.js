class Node {
  constructor(value = null, nextObject = null) {
    this.value = value;
    this.next = nextObject;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }
  append(value) {
    let node = new Node(value);
    if (this.size === 0) {
      this.head = node;
      this.tail = node;
      this.size++;
    } else {
      this.tail.next = node;
      this.tail = node;
      this.size++;
    }
  }
  prepend(value) {
    let node = new Node(value);
    if (this.size === 0) {
      this.head = node;
      this.tail = node;
      this.size++;
    } else {
      node.next = this.head;
      this.head = node;
      this.size++;
    }
  }
  getHead() {
    return this.head;
  }
  getTail() {
    return this.tail;
  }
  at(index) {
    if (index < 0 || index >= this._size) return null;
    let counter = 0;
    let obj = this.head;
    while (counter <= index) {
      if (counter === index) return obj;
      else {
        counter++;
        obj = obj.next;
      }
    }
  }
  pop() {
    let obj = this.getHead();
    if (obj === null) return;
    if (this.getHead() === this.getTail()) {
      obj = null;
      this.size--;
      this.head = null;
      this.tail = null;
      return;
    }
    while (obj.next != this.getTail()) {
      obj = obj.next;
    }
    obj.next = null;
    this.tail = obj;
    this.size--;
  }
  contains(value) {
    let obj = this.getHead();
    if (obj === null) return false;
    while (obj.value != value) {
      obj = obj.next;
    }
    return obj.value === value;
  }
  find(value) {
    let obj = this.getHead(),
      counter = 0;
    while (obj) {
      if (obj.value === value) return counter;
      counter++;
      obj = obj.next;
    }
    return null;
  }
  toString() {
    let string = "";
    let obj = this.getHead();
    if (obj === null) return string + "( null )";
    while (obj !== null) {
      string += `( ${obj.value} ) -> `;
      if (obj.next === null) {
        string += "( null )";
        return string;
      }
      obj = obj.next;
    }
  }
  getSize() {
    return this.size;
  }
  insertAt(value, index) {
    if (index > this.getSize())
      throw new Error(
        `Index is out of bounds. Linked list length is ${this.getSize()}`
      );
    else if (index === 0) this.prepend(value);
    else if (index === this.getSize()) this.append(value);
    else {
      let node = new Node(value);
      let parent = this.at(index - 1);
      let oldChildNode = this.at(index);
      parent.next = node;
      node.next = oldChildNode;
      this.size++;
    }
  }
  removeAt(index) {
    if (this.getSize() === 0 || index < 0 || index > this.getSize() - 1) return;
    else if (this.getSize() === 1 || index === this.getSize() - 1) this.pop();
    else if (index === 0) {
      let headObj = this.getHead();
      let nextObj = headObj.next;
      headObj.next = null;
      this.head = nextObj;
      this.list = nextObj;
      this.size--;
    } else {
      let parent = this.at(index - 1);
      let oldChildNode = this.at(index);
      let newChild = oldChildNode.next;
      parent.next = newChild;
      this.size--;
    }
  }
}

const list = new LinkedList();
list.append("dog");
list.append("cat");
list.append("parrot");
list.append("hamster");
list.append("snake");
list.append("turtle");
list.insertAt("imposter", 2);
list.removeAt(6);
console.log(list.getSize());

module.exports = { LinkedList };
