class BSTNode {
  constructor({ key, value, parent, left, right }) {
    this.key = key;
    this.value = value;
    this.parent = parent;
    this.left = left;
    this.right = right;
  }
}

class BinarySearchTree {
  constructor(Node = BSTNode) {
    this.Node = Node;
    this._count = 0;
    this._root = undefined;
  }

  insert(key, value = true) {
    let { node, parent } = this._findNodeAndParent(key);

    if (node) {  // replace key if already exists in the tree
      node.value = value;
      return node.value;
    }
    const newNode = new this.Node({key: key, value: value, parent: parent})
    this._count += 1;

    if (parent) {
      if (key < parent.key) {
        parent.left = newNode;
      } else {
        parent.right = newNode;
      }
    } else {
      this._root = newNode;
    }
    return newNode.value;

    // Implementation 2
    // let node = this._getClosestNode(key);
    // if (node === undefined) {  // tree is empty
    //   this._root = new this.Node({key: key, value: value});
    // } else if (key === node.key) {
    //   node.value = value;
    //   return;  // don't increase count
    // } else if (key < node.key) {
    //   node.left = new this.Node({key: key, value: value, parent: node});
    // } else { // key > node.right
    //   node.right = new this.Node({key: key, value: value, parent: node});
    // }
    // this._count += 1;

    // Implementation 3
    // let node = this._root;
    //
    // while(node) {
    //   if (key < node.key && node.left) {
    //     node = node.left;
    //   } else if (key > node.key && node.right) {
    //     node = node.right;
    //   } else if (key === node.key) { // keys are equal, replace value
    //       node.value = value;
    //       return;
    //   } else { // insert node
    //     let newNode = new this.Node({key: key, value: value, parent: node});
    //     (key < node.key ? node.left = newNode: node.right = newNode);
    //     this._count += 1;
    //     return;
    //   }
    // }
    // // tree is empty
    // this._root = new this.Node({key: key, value: value});
    // this._count += 1;
  }

  lookup(key) {
    let node = this._findNodeAndParent(key).node;
    return node?.value;

    // Implementation 2
    // let node = this._getClosestNode(key);
    // if (node && key === node.key) {
    //   return node.value;
    // }

    // Implementation 3
    // let node = this._root;
    //
    // while (node) {
    //   if (key < node.key) {
    //     node = node.left;
    //   } else if (key > node.key) {
    //     node = node.right;
    //   } else { // equal
    //     return node.value;
    //   }
    // }
  }

  _getClosestNode(key) { // return obj of node & parent
    let node = this._root;

    while(node) {
      if (key < node.key && node.left) {
        node = node.left;
      } else if (key > node.key && node.right) {
        node = node.right;
      } else {
        return node; // at value or closest node to value
      }
    }
  }

  _findNodeAndParent(key) {
    let node = this._root;
    let parent = node?.parent;

    while(node) {
      if (key < node.key) {
        parent = node;
        node = node.left;
      } else if (key > node.key) {
        parent = node;
        node = node.right;
      } else if (key === node.key) {
        parent = node.parent;
        break;
      }
    }
    return { node, parent };
  }

  delete(key) {
    let { node, parent } = this._findNodeAndParent(key);
    let replacementNode;

    if (node === undefined) {
      return;
    }

    if (node.left && node.right) {
      // replace with in order successor (R node or L most child of R node)
      replacementNode = node.right;
      let child = node.right;

      while (child) {
        if (child.key < replacementNode.key) {
          replacementNode = child;
        }
        child = child.left;
      }

      // 
      //
      // replacementNode = node.right;
      // let child = node.right;
      //
      // while (child && child.left) {
      //   child = child.left;
      // }
      //
      // replacementNode = (node.right.key < child.key) ? node.right: child;


      //
      // replacementNode = node.right;
      //
      // while (replacementNode && replacementNode.left) {
      //   replacementNode = replacementNode.left;
      // }
      //
      // if (node.right.key < replacementNode.right.key) {
      //   replacementNode = node.right
      // }

      replacementNode.left = node.left;
      node.left.parent = replacementNode;

      if (replacementNode != node.right) { // L most child of R node -> no children
        replacementNode.right = node.right;
        replacementNode.parent.left = undefined;
        node.right.parent = replacementNode;
      }

    } else if (node.left) {
      replacementNode = node.left;

    } else if (node.right) {
      replacementNode = node.right;
    }

    // update replacement node's parent
    // no replacement node if last node in tree
    if (replacementNode) {
      replacementNode.parent = parent;
    }

    // update parent node reference to node
    if (parent) {
      if (parent.left?.key === key) {
        parent.left = replacementNode;
      } else {
        parent.right = replacementNode;
      }
    } else {
      this._root = replacementNode;
    }

    this._count -= 1;
    return node.value;
  }

  count() {
    return this._count;
  }

  forEach(callback) {
    // This is a little different from the version presented in the video.
    // The form is similar, but it invokes the callback with more arguments
    // to match the interface for Array.forEach:
    //   callback({ key, value }, i, this)
    const visitSubtree = (node, callback, i = 0) => {
      if (node) {
        i = visitSubtree(node.left, callback, i);
        callback({ key: node.key, value: node.value }, i, this);
        i = visitSubtree(node.right, callback, i + 1);
      }
      return i;
    }
    visitSubtree(this._root, callback)
  }
}

export default BinarySearchTree;
