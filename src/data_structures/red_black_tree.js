import BinarySearchTree from './binary_search_tree';

// Exported for the tests :(
export class RBTNode {
  static BLACK = 'black';
  static RED = 'red';
  static sentinel = Object.freeze({ color: RBTNode.BLACK });

  constructor({
    key, value,
    color = RBTNode.RED,
    parent = RBTNode.sentinel,
    left = RBTNode.sentinel,
    right = RBTNode.sentinel,
  }) {
    this.key = key;
    this.value = value;
    this.color = color;
    this.parent = parent;
    this.left = left;
    this.right = right;
  }
}

class RedBlackTree extends BinarySearchTree {
  constructor() {
    super(RBTNode);
  }

  /**
   * The two rotation functions are symetric, and could presumably
   * be collapsed into one that takes a direction 'left' or 'right',
   * calculates the opposite, and uses [] instead of . to access.
   *
   * Felt too confusing to be worth it. Plus I bet* the JIT optimizes two
   * functions with static lookups better than one with dynamic lookups.
   *
   * (*without any evidence whatsoever, 10 points to anyone who tries it out)
   */
  _rotateLeft(node) {
    const child = node.right;

    if (node === RBTNode.sentinel) {
      throw new Error('Cannot rotate a sentinel node');
    } else if (child === RBTNode.sentinel) {
      throw new Error('Cannot rotate away from a sentinal node');
    }

    // turn child's left subtree into node's right subtree
    node.right = child.left;
    if (child.left !== RBTNode.sentinel) {
      child.left.parent = node;
    }

    // link node's parent to child
    child.parent = node.parent;
    if (node === this._root) {
      this._root = child;
    } else if (node === node.parent.left) {
      node.parent.left = child;
    } else {
      node.parent.right = child;
    }

    // put node on child's left
    child.left = node;
    node.parent = child;

    // LOOK AT ME
    // I'M THE PARENT NOW
  }

  _rotateRight(node) {
    const child = node.left;

    if (node === RBTNode.sentinel) {
      throw new Error('Cannot rotate a sentinel node');
    } else if (child === RBTNode.sentinel) {
      throw new Error('Cannot rotate away from a sentinal node');
    }

    // turn child's right subtree into node's left subtree
    node.left = child.right;
    if (child.right !== RBTNode.sentinel) {
      child.right.parent = node;
    }

    // link node's parent to child
    child.parent = node.parent;
    if (node === this._root) {
      this._root = child;
    } else if (node === node.parent.right) {
      node.parent.right = child;
    } else {
      node.parent.left = child;
    }

    // put node on child's right
    child.right = node;
    node.parent = child;
  }

  _insertRebalance(node) {
    // how do we know parent exists?
    // called after insert -> has root. root's parent is sentinel which is black
    while (node.color === RBTNode.RED && node.parent.color === RBTNode.RED) {
      let parent = node.parent;
      const grandparent = parent.parent;

      // possible that grandparent doesn't have a key? no because root is always black
      if (parent === grandparent.left) { // parent is left child of grandparent
        const uncle = grandparent.right;

        if (uncle.color === RBTNode.RED) { // uncle and parent are both red
          uncle.color = RBTNode.BLACK;
          parent.color = RBTNode.BLACK;
          grandparent.color = RBTNode.RED;
          node = grandparent;
        } else { // parent is red; uncle is black

          if (node === parent.right) { // node is right child of parent
            // force node to be left child
            parent = node; // need this?
            node = node.parent;
            this._rotateLeft(node);
          }

          // node is left child of parent
          parent.color = RBTNode.BLACK;
          grandparent.color = RBTNode.RED;

          this._rotateRight(grandparent);
        }
      } else { // parent is right child of grandparent
        const uncle = grandparent.left;

        if (uncle.color === RBTNode.RED) { // uncle and parent are both red
          uncle.color = RBTNode.BLACK;
          parent.color = RBTNode.BLACK;
          grandparent.color = RBTNode.RED;
          node = grandparent;
        } else {

          if (node === parent.left) {
            // force node to be right child;
            parent = node;
            node = node.parent;
            this._rotateRight(node);
          }

          // node is right child of parent
          parent.color = RBTNode.BLACK;
          grandparent.color = RBTNode.RED;

          this._rotateLeft(grandparent);
        }
      }
    }

    this._root.color = RBTNode.BLACK;
  }

  insert(key, value) {
    const node = this._insertInternal(key, value);
    this._insertRebalance(node);
  }

  delete(key) {

  }
}


export default RedBlackTree;
