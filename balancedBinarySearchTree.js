//You’ll build a balanced BST in this assignment. Do not use duplicate values because they make it more complicated and result in trees that are much harder to balance. Therefore, be sure to always remove duplicate values or check for an existing value before inserting.
const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.rightChild !== null) {
    prettyPrint(node.rightChild, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
  if (node.leftChild !== null) {
    prettyPrint(node.leftChild, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

class Node {
  constructor(value, leftChild = null, rightChild = null) {
    this.value = value;
    this.leftChild = leftChild;
    this.rightChild = rightChild;
  }
}

class Tree {
  root = null;
  constructor(inputArray) {
    this.treeArray = inputArray;
    this.buildTree(this.treeArray);
  }

  buildTree(array) {
    let sortedArray = array.sort((a, b) => a - b);
    let deduplicatedArray = sortedArray.filter((element, index) => {
      return index > 0 ? element !== array[index - 1] : true;
    });
    let startIndex = 0;
    let endIndex = deduplicatedArray.length - 1;
    if (endIndex < startIndex) return null;
    let midIndex = Math.floor((endIndex - startIndex) / 2);
    this.root = new Node(deduplicatedArray[midIndex]);

    let leftSubtree = new Tree(deduplicatedArray.slice(startIndex, midIndex));
    let rightSubtree = new Tree(
      deduplicatedArray.slice(midIndex + 1, endIndex + 1)
    );
    this.root.leftChild = leftSubtree.buildTree(leftSubtree.treeArray);
    this.root.rightChild = rightSubtree.buildTree(rightSubtree.treeArray);
    return this.root;
  }

  insert(value) {
    let obj = this.root;
    while (obj !== null) {
      if (obj.leftChild === null && value < obj.value) {
        obj.leftChild = new Node(value);
        return true;
      }
      if (obj.rightChild === null && value > obj.value) {
        obj.rightChild = new Node(value);
        return true;
      }
      obj.value > value ? (obj = obj.leftChild) : (obj = obj.rightChild);
    }
    return false;
  }

  delete(value) {
    let obj = this.root;
    let parent = null;
    while (obj !== null) {
      //if node has no children, simple delete
      if (
        obj.value === value &&
        obj.leftChild === null &&
        obj.rightChild === null
      ) {
        parent.value > obj.value
          ? (parent.leftChild = null)
          : (parent.rightChild = null);
        return true;
      }
      //if node has one child, set link from nodes's parent to nodes's child
      if (
        obj.value === value &&
        ((obj.leftChild === null && obj.rightChild !== null) ||
          (obj.leftChild !== null && obj.rightChild === null))
      ) {
        parent.value > obj.value
          ? (parent.leftChild =
              obj.leftChild === null ? obj.rightChild : obj.leftChild)
          : (parent.rightChild =
              obj.leftChild === null ? obj.rightChild : obj.leftChild);
        return true;
      }
      //if node has two children, select next smallest/largest
      if (
        obj.value === value &&
        obj.leftChild !== null &&
        obj.rightChild !== null
      ) {
        //find largest node in left subtree
        let replacementNodeParent = obj;
        let replacementNode = obj.leftChild;
        while (replacementNode.rightChild !== null) {
          replacementNodeParent = replacementNode;
          replacementNode = replacementNode.rightChild;
        }
        let valueStore = replacementNode.value;
        this.delete(replacementNode.value);
        obj.value = valueStore;
        return true;
      }
      parent = obj;
      obj.value > value ? (obj = obj.leftChild) : (obj = obj.rightChild);
    }
    return false;
  }

  find(value) {
    let obj = this.root;
    if (obj === null || obj.value === value) return obj;
    while (obj !== null && obj.value !== value) {
      obj.value > value ? (obj = obj.leftChild) : (obj = obj.rightChild);
      if (obj === null || obj.value === value) return obj;
    }
    return null;
  }

  levelOrderForEach(callbackFnc) {
    if (arguments.length === 0)
      throw new Error("No Callback Function Provided.");
    let queue = [];
    let currentObj = this.root;
    queue.push(currentObj);
    for (const node of queue) {
      callbackFnc(node);
      if (node.leftChild) queue.push(node.leftChild);
      if (node.rightChild) queue.push(node.rightChild);
    }
  }

  levelOrderForEachRecursive(callbackFnc, array) {
    if (array.length === 0) return null;
    if (typeof arguments[0] !== "function")
      throw new Error("No Callback Function Provided.");
    let nextLevel = [];
    array.forEach((node) => {
      if (node.leftChild) nextLevel.push(node.leftChild);
      if (node.rightChild) nextLevel.push(node.rightChild);
    });
    array.forEach((node) => callbackFnc(node));
    this.levelOrderForEachRecursive(callbackFnc, nextLevel);
  }

  //following require recursion
  inOrderForEach(callbackFnc, node) {
    if (typeof arguments[0] !== "function")
      throw new Error("No Callback Function Provided.");
    if (node === null) return;
    this.inOrderForEach(callbackFnc, node.leftChild);
    callbackFnc(node);
    this.inOrderForEach(callbackFnc, node.rightChild);
  }

  preOrderForEach(callbackFnc, node) {
    if (typeof arguments[0] !== "function")
      throw new Error("No Callback Function Provided.");
    if (node === null) return;
    callbackFnc(node);
    this.preOrderForEach(callbackFnc, node.leftChild);

    this.preOrderForEach(callbackFnc, node.rightChild);
  }

  postOrderForEach(callbackFnc, node) {
    if (typeof arguments[0] !== "function")
      throw new Error("No Callback Function Provided.");
    if (node === null) return;
    this.postOrderForEach(callbackFnc, node.leftChild);
    this.postOrderForEach(callbackFnc, node.rightChild);
    callbackFnc(node);
  }

  height(value) {
    let node = this.find(value);
    if (!node) return null;
    return this.heightHelperFunc(node);
  }

  heightHelperFunc(nodeObj) {
    if (nodeObj.leftChild === null && nodeObj.rightChild === null) return 0;
    let leftHeight = 0;
    let rightHeight = 0;

    if (nodeObj.leftChild)
      leftHeight = this.heightHelperFunc(nodeObj.leftChild) + 1;
    if (nodeObj.rightChild)
      rightHeight = this.heightHelperFunc(nodeObj.rightChild) + 1;

    // console.log(nodeObj.value, leftHeight, rightHeight);
    let numericalHeight = leftHeight > rightHeight ? leftHeight : rightHeight;
    return numericalHeight;
  }

  depth(value) {
    let node = this.root;
    let increment = 0;
    while (node !== null) {
      if (node.value === value) return increment;
      if (
        node.value !== value &&
        node.leftChild === null &&
        node.rightChild === null
      )
        return null;
      node.value > value ? (node = node.leftChild) : (node = node.rightChild);
      increment++;
    }
    return null;
  }

  isBalanced(node) {
    if (node === null) return true;
    let leftSubTreeBalance = this.isBalanced(node.leftChild);
    let rightSubTreeBalance = this.isBalanced(node.rightChild);
    if (leftSubTreeBalance === false || rightSubTreeBalance === false)
      return false;

    let leftSubTreeHeight =
      node.leftChild === null ? 0 : this.height(node.leftChild.value);
    let rightSubTreeHeight =
      node.rightChild === null ? 0 : this.height(node.rightChild.value);

    let balanceBoolean =
      Math.abs(rightSubTreeHeight - leftSubTreeHeight) > 1 ? false : true;
    if (balanceBoolean === false) return false;
    return true;
  }

  rebalance() {
    if (this.isBalanced(this.root)) return false;
    let array = [];
    this.inOrderForEach((node) => {
      array.push(node.value);
    }, this.root);
    this.root = this.buildTree(array);
  }
}

function testBST(size) {
  let array = [];
  for (let i = 0; i < size; i++) {
    array[i] = Math.floor(Math.random() * 100);
  }
  let testTree = new Tree(array);
  testTree.levelOrderForEach((node) => console.log("LO:", node.value));
  testTree.preOrderForEach(
    (node) => console.log("PreO:", node.value),
    testTree.root
  );
  testTree.postOrderForEach(
    (node) => console.log("PstO:", node.value),
    testTree.root
  );
  testTree.inOrderForEach(
    (node) => console.log("IO:", node.value),
    testTree.root
  );

  for (let i = 0; i < Math.floor(size / 2); i++) {
    testTree.insert(Math.floor(Math.random() * 100 + 100));
  }
  prettyPrint(testTree.root);
  console.log("Before Balance: ", testTree.isBalanced(testTree.root));
  testTree.rebalance();
  console.log("After Balance: ", testTree.isBalanced(testTree.root));
  prettyPrint(testTree.root);
}

testBST(10);
