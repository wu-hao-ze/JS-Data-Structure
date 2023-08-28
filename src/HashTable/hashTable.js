// 用哈希函数来把数组中的某个性质和下标联系起来，将单词的字符串转为下标
// 将大数字转化为数组范围内下标的过程就称之为哈希化
// 将单词的字符串转为大数字，然后将大数字进行哈希化，把这个功能放在一个函数中，这个函数就是哈希函数
// 而最终将数据插入到的这个数组，是对整个结构的封装，称之为哈希表
// 解决冲突的两种方案，链地址法(拉链法)和开放地址法
// 链地址法就是哈希表中的每一个元素都是一个链表或是一个数组，防止冲突的覆盖
// 哈希函数的特点，快速的计算(减少乘法)和均匀的分布(多使用质数)

/**
 * 设计哈希函数，将传入的字符串哈希化，转换成 hashCode
 * @param string 要哈希化的字符串
 * @param limit 哈希表的最大个数（数组长度）
 * @returns {number} hashCode
 */
export function hashFn(string, limit = 7) {

  // 自己采用的一个质数（无强制要求，质数即可）
  const PRIME = 31;

  // 1、定义存储 hashCode 的变量
  let hashCode = 0;

  // 2、使用霍纳法则（秦九韶算法），计算 hashCode 的值
  for (let item of string) {
    hashCode = PRIME * hashCode + item.charCodeAt();
  }

  // 3、对 hashCode 取余，并返回
  return hashCode % limit;
}


/**
 * 判断一个数是否为质数
 * @param number
 * @returns {boolean}
 */
// 方法一，性能比较低
// export function isPrime(number) {
//   if (number <= 1) return false;
//   for (let i = 2; i < number; i++) {
//     if (number % i === 0) {
//       return false;
//     }
//   }
//   return true;
// }

// 方法二，性能较好
export function isPrime(number) {
  if (number <= 1 || number === 4) return false;
  const temp = Math.ceil(Math.sqrt(number));
  for (let i = 2; i < temp; i++) {
    if (number % i === 0) {
      return false;
    }
  }
  return true;
}

// 哈希表的封装
// 最终哈希表的格式是：[[[k, v], [k, v]...], [[k, v], [k, v]...], [[k, v], [k, v]...]...]
export class HashTable {

  constructor() {
    this.storage = []; // 哈希表存储数据的变量
    this.count = 0; // 当前存放的元素个数
    this.limit = 7;  // 哈希表长度（初始设为质数 7）

    // 装填因子(已有个数/总个数)
    // 一般当装填因子大于0.75的时候就要进行扩容，要不然会影响性能
    this.loadFactor = 0.75;
    this.minLoadFactor = 0.25; // 小于0.25就减少容量
  }

  // getPrime(number) 根据传入的 number 获取最临近的质数
  getPrime(number) {
    while (!isPrime(number)) {
      number++;
    }
    return number;
  }

  // put(key, value) 往哈希表里添加数据
  put(key, value) {

    // 1、根据 key 获取要映射到 storage 里面的 index（通过哈希函数获取）
    const index = hashFn(key, this.limit);

    // 2、根据 index 取出对应的 bucket
    let bucket = this.storage[index];

    // 3、判断是否存在 bucket
    if (bucket === undefined) {
      bucket = [];  // 不存在则创建
      this.storage[index] = bucket;
    }

    // 4、判断是插入数据操作还是修改数据操作
    for (let i = 0; i < bucket.length; i++) {
      let tuple = bucket[i]; // tuple 的格式：[key, value]
      if (tuple[0] === key) { // 如果 key 相等，则修改数据
        tuple[1] = value;
        return; // 修改完 tuple 里数据，return 终止，不再往下执行。
      }
    }

    // 5、bucket 新增数据
    bucket.push([key, value]); // bucket 存储元组 tuple，格式为 [key, value]
    this.count++;

    // 判断哈希表是否要扩容，若装填因子 > 0.75，则扩容
    if (this.count / this.limit > this.loadFactor) {
      this.resize(this.getPrime(this.limit * 2));
    }

  }

  // 根据 get(key) 获取 value
  get(key) {
    // 根据给定的key获取哈希表中的index
    const index = hashFn(key, this.limit);
    // 再根据index获取对应的bucket
    const bucket = this.storage[index];
    // 如果bucket都没有，那么肯定没有
    if (bucket === undefined) {
      return null;
    }
    // 如果有bucket，那么遍历该数组中的元素，每一个元素也是一个小数组，是一个键值对[k, v]
    // 如果找到了key，则返回value
    for (const tuple of bucket) {
      if (tuple[0] === key) {
        return tuple[1];
      }
    }
    return null;
  }

  // remove(key) 删除指定 key 的数据
  remove(key) {
    // 根据给定的key获取哈希表中的index
    const index = hashFn(key, this.limit);
    // 再根据index获取对应的bucket
    const bucket = this.storage[index];
    // 如果bucket都没有，那么肯定没有
    if (bucket === undefined) {
      return null;
    }
    // 遍历 bucket，找到对应位置的 tuple，将其删除
    for (let i = 0, len = bucket.length; i < len; i++) {
      const tuple = bucket[i];
      if (tuple[0] === key) {
        bucket.splice(i, 1); // 删除对应位置的数组项
        this.count--;
        // 根据装填因子的大小，判断是否要进行哈希表压缩
        if (this.limit > 7 && this.count / this.limit < this.minLoadFactor) {
          this.resize(this.getPrime(Math.floor(this.limit / 2)));
        }
        return tuple;
      }

    }

  }

  isEmpty() {
    return this.count === 0;
  }

  size() {
    return this.count;
  }

  // 重新调整哈希表大小，扩容或压缩
  resize(newLimit) {

    // 1、保存旧的 storage 数组内容
    const oldStorage = this.storage;

    // 2、重置所有属性
    this.storage = [];
    this.count = 0;
    this.limit = newLimit;

    // 3、遍历 oldStorage，取出所有数据，重新 put 到 this.storage
    for (const bucket of oldStorage) {
      if (bucket) {
        for (const b of bucket) {
          this.put(b[0], b[1]);
        }
      }

    }
  }
}
