export default class ArrayList {
  constructor(arr) {
    // arr是传来的数组
    this.array = arr
  }
  // 选择排序O(n²)
  select() {
    let arr = JSON.parse(JSON.stringify(this.array))
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] > arr[j]) {
          [arr[i], arr[j]] = [arr[j], arr[i]]
        }
      }
    }
    return arr
  }

  // 冒泡排序O(n²)
  bubbling() {
    let arr = JSON.parse(JSON.stringify(this.array))
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        }
      }
    }
    return arr
  }

  // 插入排序，比选择和冒泡排序要快一半左右
  // 核心思想是局部有序，标记符左边的这部分数据是排好序的，而右边的数据是没有排序的，这个时候取出数据项，存储到临时变量中
  // 然后从刚移除的位置左边第一个单元开始，每次把有序的数据向右移动一个单元，直到临时变量的数据可以成功插入为止
  insert() {
    let arr = JSON.parse(JSON.stringify(this.array))
    // 从下标值为1的位置开始，向前面局部有序进行插入
    for (let i = 1; i < arr.length; i++) {
      let j = i - 1
      let t = arr[i] // 注意一定要先保存arr[i]，因为后面会把arr[i]覆盖掉
      for (; j >= 0; j--) {
        if (arr[j] <= t) break
        arr[j + 1] = arr[j]
      }
      arr[j + 1] = t
    }
    return arr
  }

  // 希尔排序，跟增量有关系，要好于O(n²)，但是最坏的情况下也是O(n²)，但是在某些合适的情况下还可能好于快速排序，一般来说比快速排序差
  // 希尔排序是插入排序的一种改进版，效率比插入排序更快，在希尔排序之前时间复杂度都不会低于O(n²)
  // 插入排序的问题：右侧出现很小的数据项，那么就会把前面的所有排好序的元素都往后移，非常耗时
  // 从数组的整个长度的一半开始取，每次都取一半的增量间隔，然后分组排序，同一个间隔的数据放到一组进行排序
  // 比如数组长度为100，那么间隔为50，25，12，6，3，1
  shellSort() {
    let arr = JSON.parse(JSON.stringify(this.array))
    let gap = Math.floor(arr.length / 2) // gap就是每次的间隔
    while (gap >= 1) {
      for (let i = gap; i < arr.length; i++) {
        let j = i - gap
        let t = arr[i]
        for (; j >= 0; j -= gap) {
          if (arr[j] <= t) break
          arr[j + gap] = arr[j]
        }
        arr[j + gap] = t
      }
      gap = Math.floor(gap / 2)
    }
    return arr
  }

  // 快速排序O(nlogn)
  // 大多数情况下是最快的
  // 思想为分治，它将数组拆分为两个子数组，其中一个子数组的所有元素都比另一个子数组的元素小，然后对这两个子数组再重复进行上述操作
  // 要选择枢纽，一般的策略是选择最左侧，中间的，最右侧，三个元素的中位数作为枢纽
  quickSort() {
    let arr = JSON.parse(JSON.stringify(this.array))
    let center = Math.floor((left + right) / 2)
    // 将这三个元素排序选择中位数
    
    return arr
  }
}
