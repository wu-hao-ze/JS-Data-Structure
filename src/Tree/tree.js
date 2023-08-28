// 只包括左子节点和兄弟节点，就可以把所有的树转成二叉树
// 如果是完全二叉树可以使用数组，左子节点的序号是自身节点的两倍
// 但普遍的树使用链表才是关键
// 节点封装：data，left，right
// 节点类
class Node {
  constructor(key) {
    this.key = key;
    this.left = null;
    this.right = null;
  }
}

// 二叉搜索树BST：可以为空，如果不为空则要满足：
// 非空左子树的每一个节点的键值小于其根节点的键值
// 非空右子树的每一个节点的键值大于其根节点的键值
// 并且左右子树本身也要是二叉搜索树
// 封装二叉搜索树（特点：左子树节点值 < 根节点，右子树节点值 > 根节点）
export class BinarySearchTree {
  // 对于二叉搜索树来说，只需保存根节点就可以，因为其他节点都可以通过根节点找到
  constructor() {
    this.root = null;
  }

  // insert(key) 插入数据
  insert(key) {
    const newNode = new Node(key);
    if (this.root === null) {
      this.root = newNode;
    } else {
      this.insertNode(this.root, newNode);
    }
  }

  insertNode(root, node) {
    if (node.key < root.key) { // 往左边查找插入
      if (root.left === null) {
        root.left = node;
      } else {
        this.insertNode(root.left, node);
      }
    } else if (node.key > root.key) { // 往右边查找插入
      if (root.right === null) {
        root.right = node;
      } else {
        this.insertNode(root.right, node);
      }
    } else {
      // 不考虑相等的情况
    }
  }

  // ----------- 二叉树遍历 ----------- //
  // 先序遍历（根左右 DLR）
  preorderTraversal() {
    const result = [];
    this.preorderTraversalNode(this.root, result);
    return result;
  }
  // 先序遍历是先处理根节点
  preorderTraversalNode(node, result) {
    if (node === null) return result;
    result.push(node.key);
    this.preorderTraversalNode(node.left, result);
    this.preorderTraversalNode(node.right, result);
  }

  // 中序遍历（左根右 LDR）
  inorderTraversal() {
    const result = [];
    this.inorderTraversalNode(this.root, result);
    return result;
  }
  // 中序遍历是在中间处理根节点，所以中序遍历是从小到大的排序
  inorderTraversalNode(node, result) {
    if (node === null) return result;
    this.inorderTraversalNode(node.left, result);
    result.push(node.key);
    this.inorderTraversalNode(node.right, result);
  }

  // 后序遍历（左右根 LRD）
  postorderTraversal() {
    const result = [];
    this.postorderTraversalNode(this.root, result);
    return result;
  }
  // 后序遍历是最后处理根节点
  postorderTraversalNode(node, result) {
    if (node === null) return result;
    this.postorderTraversalNode(node.left, result);
    this.postorderTraversalNode(node.right, result);
    result.push(node.key);
  }

  // min() 获取二叉搜索树最小值
  min() {
    if (!this.root) return null;
    let node = this.root;
    while (node.left !== null) {
      node = node.left;
    }
    return node.key;
  }

  // max() 获取二叉搜索树最大值
  max() {
    if (!this.root) return null;
    let node = this.root;
    while (node.right !== null) {
      node = node.right;
    }
    return node.key;
  }

  // search(key) 查找二叉搜索树中是否有相同的key，存在返回 true，否则返回 false
  search(key) {
    return this.searchNode(this.root, key);
  }

  // 通过递归实现
  searchNode(node, key) {
    if (node === null) return false;
    if (key < node.key) {
      return this.searchNode(node.left, key);
    } else if (key > node.key) {
      return this.searchNode(node.right, key);
    } else {
      return true;
    }
  }

  // 通过 while 循环实现
  search2(key) {
    let node = this.root;
    while (node !== null) {
      if (key < node.key) {
        node = node.left;
      } else if (key > node.key) {
        node = node.right;
      } else {
        return true;
      }
    }
    return false;
  }

  // 删除节点
  remove(key) {
    let currentNode = this.root;
    let parentNode = null;
    let isLeftChild = true;
    // 循环查找到要删除的节点 currentNode，以及它的 parentNode、isLeftChild
    while (currentNode.key !== key) {
      parentNode = currentNode;
      // 小于，往左查找
      if (key < currentNode.key) {
        isLeftChild = true;
        currentNode = currentNode.left;
      } else {  // 否则往右查找
        isLeftChild = false;
        currentNode = currentNode.right;
      }
      // 找到最后都没找到相等的节点，返回 false
      if (currentNode === null) {
        return false;
      }
    }

    // 1、删除的是叶子节点的情况
    if (currentNode.left === null && currentNode.right === null) {
      if (currentNode === this.root) {
        this.root = null;
      } else if (isLeftChild) {
        parentNode.left = null;
      } else {
        parentNode.right = null;
      }
    }
    // 2、删除的是只有一个子节点的节点
    else if (currentNode.right === null) { // currentNode 只存在左节点
      if (currentNode === this.root) {
        this.root = currentNode.left;
      } else if (isLeftChild) {
        parentNode.left = currentNode.left;
      } else {
        parentNode.right = currentNode.left;
      }
    } else if (currentNode.left === null) { // currentNode 只存在右节点
      if (currentNode === this.root) {
        this.root = currentNode.right;
      } else if (isLeftChild) {
        parentNode.left = currentNode.right;
      } else {
        parentNode.right = currentNode.right;
      }
    }
    // 3、删除的是有两个子节点的节点
    // 思路是从当前节点开始向右找，然后在右子树中找到最小的，也就是按照向左找找到最左的元素，然后把这个元素换到删除的这个位置
    // 而这个右子树中最左的元素，可能是有一个右子节点或者是没有子节点，如果没有的话直接移就好，如果有的话就把右子节点连接上
    else {
      // 1、找到后续节点
      let successor = this.getSuccessor(currentNode);
      // 2、判断是否为根节点
      if (currentNode === this.root) {
        this.root = successor;
      } else if (isLeftChild) {
        parentNode.left = successor;
      } else {
        parentNode.right = successor;
      }
      // 3、重新连接重新找到的节点
      successor.left = currentNode.left;
      // 连接右侧的时候要考虑一下如果选中的替换节点就是当前节点的右侧节点，那么就不需要再执行赋值右侧了
      if (successor !== currentNode.right) successor.right = currentNode.right;
    }
  }

  // 获取后续节点，即从要删除的节点的右边开始查找最小的值
  getSuccessor(delNode) {
    let current = delNode.right; // 当前节点
    let currentParent = delNode; // 当前节点的父节点
    // 循环查找 current 的右子树节点
    while (current.left !== null) {
      currentParent = current;
      current = current.left;
    }
    // 判断寻找到的替换节点是否还有右节点
    if (current.right) currentParent.left = current.right;
    return current;
  }
}


// 比较好的二叉搜索树数据应该是左右均匀分布的，但是插入连续数据后，分布的不均匀，这种就是非平衡树
// 平衡二叉树查找/插入效率为O(logN)，非平衡二叉树相当于编写了个链表，效率为O(N)
// AVL树是最早的一种平衡树，有办法保持树的平衡，但是效率不如红黑树
// 红黑树：
// 节点是红色或者是黑色，根节点是黑色，把所有最后的节点全都用黑色的空节点补齐，NIL节点
// 所以最后达到的效果就是所有的叶子节点都变成了黑色的空节点(NIL节点)
// 1.每个红色节点的两个子节点都是黑色的
// 2.从任一节点到其每个叶子的所有路径都包含相同数目的黑色节点
// 综合上面两点，最短的可能路径就是全都是黑色节点，那么最长的路径就是红黑交替出现，那么根节点和叶子节点都是黑的
// 所以红节点最多只能是该路径的黑节点的数量减一，那么最长路径就不会超过最短路径的两倍，保持一种相对平衡

// 注意，新插入的节点尽量要控制为红色，然后插入红色可能会红红相连，可以通过变色和旋转来解决
// 但是如果插入黑节点，因为要控制任一节点到其每个叶子的所有路径都包含相同数目的黑色节点，所以非常难调整了

// 红黑树的三种变换，变色，左旋转和右旋转
// NPGU对应插入的当前节点，父节点，祖父节点，叔节点





