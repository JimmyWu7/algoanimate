export interface AlgorithmCode {
  python: string;
  cpp: string;
  typescript: string;
  java: string;
}

export const ALGORITHM_CODES: Record<string, AlgorithmCode> = {
  "bubble-sort": {
    python: `def bubble_sort(arr):
      """
      Bubble Sort: O(N²) average and worst-case comparison sort.
      Stable and in-place.
      """
      n = len(arr)
      for i in range(n):
          swapped = False
          for j in range(0, n - i - 1):
              if arr[j] > arr[j + 1]:
                  # Swap elements
                  arr[j], arr[j + 1] = arr[j + 1], arr[j]
                  swapped = True
          # If no elements were swapped, array is already sorted
          if not swapped:
              break
      return arr
  `,
    cpp: `#include <vector>
  #include <algorithm>
  
  /**
   * Bubble Sort: O(N²) average and worst-case comparison sort.
   * Stable and in-place.
   */
  void bubbleSort(std::vector<int>& arr) {
      int n = arr.size();
      for (int i = 0; i < n; i++) {
          bool swapped = false;
          for (int j = 0; j < n - i - 1; j++) {
              if (arr[j] > arr[j + 1]) {
                  std::swap(arr[j], arr[j + 1]);
                  swapped = true;
              }
          }
          if (!swapped) break;
      }
  }
  `,
    typescript: `/**
   * Bubble Sort: O(N²) average and worst-case comparison sort.
   * Stable and in-place.
   */
  function bubbleSort(arr: number[]): number[] {
    const n = arr.length;
    const temp = [...arr];
    for (let i = 0; i < n; i++) {
      let swapped = false;
      for (let j = 0; j < n - i - 1; j++) {
        if (temp[j] > temp[j + 1]) {
          [temp[j], temp[j + 1]] = [temp[j + 1], temp[j]];
          swapped = true;
        }
      }
      if (!swapped) break;
    }
    return temp;
  }
  `,
    java: `public class BubbleSort {
      /**
       * Bubble Sort: O(N²) average and worst-case comparison sort.
       * Stable and in-place.
       */
      public static void bubbleSort(int[] arr) {
          int n = arr.length;
          for (int i = 0; i < n; i++) {
              boolean swapped = false;
              for (int j = 0; j < n - i - 1; j++) {
                  if (arr[j] > arr[j + 1]) {
                      int temp = arr[j];
                      arr[j] = arr[j + 1];
                      arr[j + 1] = temp;
                      swapped = true;
                  }
              }
              if (!swapped) break;
          }
      }
  }
  `,
  },
  "heap-sort": {
    python: `def heap_sort(arr):
      """
      Heap Sort: O(N log N) comparison sort.
      In-place, but unstable.
      """
      n = len(arr)
  
      # Build max heap
      for i in range(n // 2 - 1, -1, -1):
          heapify(arr, n, i)
  
      # Extract elements one by one
      for i in range(n - 1, 0, -1):
          arr[i], arr[0] = arr[0], arr[i] # swap
          heapify(arr, i, 0)
      return arr
  
  def heapify(arr, n, i):
      largest = i
      l = 2 * i + 1
      r = 2 * i + 2
  
      if l < n and arr[l] > arr[largest]:
          largest = l
      if r < n and arr[r] > arr[largest]:
          largest = r
  
      if largest != i:
          arr[i], arr[largest] = arr[largest], arr[i]
          heapify(arr, n, largest)
  `,
    cpp: `#include <vector>
  #include <algorithm>
  
  void heapify(std::vector<int>& arr, int n, int i) {
      int largest = i;
      int l = 2 * i + 1;
      int r = 2 * i + 2;
  
      if (l < n && arr[l] > arr[largest])
          largest = l;
      if (r < n && arr[r] > arr[largest])
          largest = r;
  
      if (largest != i) {
          std::swap(arr[i], arr[largest]);
          heapify(arr, n, largest);
      }
  }
  
  void heapSort(std::vector<int>& arr) {
      int n = arr.size();
      for (int i = n / 2 - 1; i >= 0; i--)
          heapify(arr, n, i);
  
      for (int i = n - 1; i > 0; i--) {
          std::swap(arr[0], arr[i]);
          heapify(arr, i, 0);
      }
  }
  `,
    typescript: `function heapify(arr: number[], n: number, i: number): void {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
  
    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }
    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }
  
    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      heapify(arr, n, largest);
    }
  }
  
  function heapSort(arr: number[]): number[] {
    const temp = [...arr];
    const n = temp.length;
  
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(temp, n, i);
    }
  
    for (let i = n - 1; i > 0; i--) {
      [temp[0], temp[i]] = [temp[i], temp[0]];
      heapify(temp, i, 0);
    }
    return temp;
  }
  `,
    java: `public class HeapSort {
      private static void heapify(int[] arr, int n, int i) {
          int largest = i;
          int l = 2 * i + 1;
          int r = 2 * i + 2;
  
          if (l < n && arr[l] > arr[largest]) {
              largest = l;
          }
          if (r < n && arr[r] > arr[largest]) {
              largest = r;
          }
  
          if (largest != i) {
              int swap = arr[i];
              arr[i] = arr[largest];
              arr[largest] = swap;
              heapify(arr, n, largest);
          }
      }
  
      public static void heapSort(int[] arr) {
          int n = arr.length;
          for (int i = n / 2 - 1; i >= 0; i--) {
              heapify(arr, n, i);
          }
  
          for (int i = n - 1; i > 0; i--) {
              int temp = arr[0];
              arr[0] = arr[i];
              arr[i] = temp;
              heapify(arr, i, 0);
          }
      }
  }
  `,
  },
  "radix-sort": {
    python: `def radix_sort(arr):
      """
      Radix Sort (LSD): O(d * (N + k)) non-comparative sort.
      Stable, requires auxiliary memory.
      """
      if not arr:
          return arr
      max_val = max(arr)
      exp = 1
      while max_val // exp > 0:
          counting_sort_by_digit(arr, exp)
          exp *= 10
      return arr
  
  def counting_sort_by_digit(arr, exp):
      n = len(arr)
      output = [0] * n
      count = [0] * 10
  
      for i in range(n):
          index = (arr[i] // exp) % 10
          count[index] += 1
  
      for i in range(1, 10):
          count[i] += count[i - 1]
  
      for i in range(n - 1, -1, -1):
          index = (arr[i] // exp) % 10
          output[count[index] - 1] = arr[i]
          count[index] -= 1
  
      for i in range(n):
          arr[i] = output[i]
  `,
    cpp: `#include <vector>
  #include <algorithm>
  
  void countingSortByDigit(std::vector<int>& arr, int exp) {
      int n = arr.size();
      std::vector<int> output(n);
      std::vector<int> count(10, 0);
  
      for (int i = 0; i < n; i++) {
          count[(arr[i] / exp) % 10]++;
      }
  
      for (int i = 1; i < 10; i++) {
          count[i] += count[i - 1];
      }
  
      for (int i = n - 1; i >= 0; i--) {
          int digit = (arr[i] / exp) % 10;
          output[count[digit] - 1] = arr[i];
          count[digit]--;
      }
  
      for (int i = 0; i < n; i++) {
          arr[i] = output[i];
      }
  }
  
  void radixSort(std::vector<int>& arr) {
      if (arr.empty()) return;
      int maxVal = *std::max_element(arr.begin(), arr.end());
      for (int exp = 1; maxVal / exp > 0; exp *= 10) {
          countingSortByDigit(arr, exp);
      }
  }
  `,
    typescript: `function countingSortByDigit(arr: number[], exp: number): void {
    const n = arr.length;
    const output = new Array(n).fill(0);
    const count = new Array(10).fill(0);
  
    for (let i = 0; i < n; i++) {
      const digit = Math.floor(arr[i] / exp) % 10;
      count[digit]++;
    }
  
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }
  
    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10;
      output[count[digit] - 1] = arr[i];
      count[digit]--;
    }
  
    for (let i = 0; i < n; i++) {
      arr[i] = output[i];
    }
  }
  
  function radixSort(arr: number[]): number[] {
    const temp = [...arr];
    if (temp.length === 0) return temp;
    const maxVal = Math.max(...temp);
    for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
      countingSortByDigit(temp, exp);
    }
    return temp;
  }
  `,
    java: `import java.util.Arrays;
  
  public class RadixSort {
      private static void countingSortByDigit(int[] arr, int exp) {
          int n = arr.length;
          int[] output = new int[n];
          int[] count = new int[10];
  
          for (int i = 0; i < n; i++) {
              count[(arr[i] / exp) % 10]++;
          }
  
          for (int i = 1; i < 10; i++) {
              count[i] += count[i - 1];
          }
  
          for (int i = n - 1; i >= 0; i--) {
              int digit = (arr[i] / exp) % 10;
              output[count[digit] - 1] = arr[i];
              count[digit]--;
          }
  
          for (int i = 0; i < n; i++) {
              arr[i] = output[i];
          }
      }
  
      public static void radixSort(int[] arr) {
          if (arr.length == 0) return;
          int maxVal = Arrays.stream(arr).max().getAsInt();
          for (int exp = 1; maxVal / exp > 0; exp *= 10) {
              countingSortByDigit(arr, exp);
          }
      }
  }
  `,
  },
  "bucket-sort": {
    python: `def bucket_sort(arr):
      """
      Bucket Sort: O(N + k) average non-comparative sort.
      Distributes elements into k buckets, sorts each, and concatenates.
      """
      if not arr:
          return arr
      
      bucket_count = len(arr)
      max_val = max(arr)
      min_val = min(arr)
      
      # Avoid division by zero
      val_range = (max_val - min_val) / bucket_count
      if val_range == 0:
          return arr
  
      buckets = [[] for _ in range(bucket_count)]
  
      # Put elements in buckets
      for num in arr:
          idx = int((num - min_val) / val_range)
          if idx == bucket_count:
              idx -= 1
          buckets[idx].append(num)
  
      # Sort buckets and concatenate
      sorted_arr = []
      for bucket in buckets:
          bucket.sort() # typically insertion sort in theory
          sorted_arr.extend(bucket)
  
      for i in range(len(arr)):
          arr[i] = sorted_arr[i]
      return arr
  `,
    cpp: `#include <vector>
  #include <algorithm>
  
  void bucketSort(std::vector<int>& arr) {
      if (arr.empty()) return;
      int n = arr.size();
      int minVal = *std::min_element(arr.begin(), arr.end());
      int maxVal = *std::max_element(arr.begin(), arr.end());
      
      double range = (double)(maxVal - minVal) / n;
      if (range == 0) return;
  
      std::vector<std::vector<int>> buckets(n);
  
      for (int i = 0; i < n; i++) {
          int bucketIndex = (int)((arr[i] - minVal) / range);
          if (bucketIndex == n) bucketIndex--;
          buckets[bucketIndex].push_back(arr[i]);
      }
  
      for (int i = 0; i < n; i++) {
          std::sort(buckets[i].begin(), buckets[i].end());
      }
  
      int idx = 0;
      for (int i = 0; i < n; i++) {
          for (int j = 0; j < buckets[i].size(); j++) {
              arr[idx++] = buckets[i][j];
          }
      }
  }
  `,
    typescript: `function bucketSort(arr: number[]): number[] {
    const temp = [...arr];
    if (temp.length === 0) return temp;
    const n = temp.length;
    const minVal = Math.min(...temp);
    const maxVal = Math.max(...temp);
  
    const range = (maxVal - minVal) / n;
    if (range === 0) return temp;
  
    const buckets: number[][] = Array.from({ length: n }, () => []);
  
    for (let i = 0; i < n; i++) {
      let bucketIndex = Math.floor((temp[i] - minVal) / range);
      if (bucketIndex === n) {
        bucketIndex--;
      }
      buckets[bucketIndex] = buckets[bucketIndex] ? buckets[bucketIndex].concat(temp[i]) : [temp[i]];
    }
  
    for (let i = 0; i < n; i++) {
      buckets[i].sort((a, b) => a - b);
    }
  
    let idx = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < buckets[i].length; j++) {
        temp[idx++] = buckets[i][j];
      }
    }
    return temp;
  }
  `,
    java: `import java.util.ArrayList;
  import java.util.Collections;
  import java.util.List;
  
  public class BucketSort {
      public static void bucketSort(int[] arr) {
          if (arr.length == 0) return;
          int n = arr.length;
          int minVal = arr[0];
          int maxVal = arr[0];
          for (int num : arr) {
              if (num < minVal) minVal = num;
              if (num > maxVal) maxVal = num;
          }
  
          double range = (double)(maxVal - minVal) / n;
          if (range == 0) return;
  
          List<List<Integer>> buckets = new ArrayList<>(n);
          for (int i = 0; i < n; i++) {
              buckets.add(new ArrayList<>());
          }
  
          for (int num : arr) {
              int bucketIndex = (int)((num - minVal) / range);
              if (bucketIndex == n) bucketIndex--;
              buckets.get(bucketIndex).add(num);
          }
  
          for (int i = 0; i < n; i++) {
              Collections.sort(buckets.get(i));
          }
  
          int idx = 0;
          for (int i = 0; i < n; i++) {
              for (int num : buckets.get(i)) {
                  arr[idx++] = num;
              }
          }
      }
  }
  `,
  },
  "selection-sort": {
    python: `def selection_sort(arr):
      """
      Selection Sort: O(N²) comparison sort.
      Minimizes memory writes (at most N swaps).
      """
      n = len(arr)
      for i in range(n - 1):
          min_idx = i
          for j in range(i + 1, n):
              if arr[j] < arr[min_idx]:
                  min_idx = j
          if min_idx != i:
              arr[i], arr[min_idx] = arr[min_idx], arr[i]
      return arr
  `,
    cpp: `#include <vector>
  #include <algorithm>
  
  /**
   * Selection Sort: O(N²) comparison sort.
   * Minimizes memory writes (at most N swaps).
   */
  void selectionSort(std::vector<int>& arr) {
      int n = arr.size();
      for (int i = 0; i < n - 1; i++) {
          int min_idx = i;
          for (int j = i + 1; j < n; j++) {
              if (arr[j] < arr[min_idx]) {
                  min_idx = j;
              }
          }
          if (min_idx != i) {
              std::swap(arr[i], arr[min_idx]);
          }
      }
  }
  `,
    typescript: `/**
   * Selection Sort: O(N²) comparison sort.
   * Minimizes memory writes (at most N swaps).
   */
  function selectionSort(arr: number[]): number[] {
    const n = arr.length;
    const temp = [...arr];
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        if (temp[j] < temp[minIdx]) {
          minIdx = j;
        }
      }
      if (minIdx !== i) {
        [temp[i], temp[minIdx]] = [temp[minIdx], temp[i]];
      }
    }
    return temp;
  }
  `,
    java: `public class SelectionSort {
      /**
       * Selection Sort: O(N²) comparison sort.
       * Minimizes memory writes (at most N swaps).
       */
      public static void selectionSort(int[] arr) {
          int n = arr.length;
          for (int i = 0; i < n - 1; i++) {
              int minIdx = i;
              for (int j = i + 1; j < n; j++) {
                  if (arr[j] < arr[minIdx]) {
                      minIdx = j;
                  }
              }
              if (minIdx != i) {
                  int temp = arr[i];
                  arr[i] = arr[minIdx];
                  arr[minIdx] = temp;
              }
          }
      }
  }
  `,
  },
  "insertion-sort": {
    python: `def insertion_sort(arr):
      """
      Insertion Sort: O(N²) comparison sort.
      Highly adaptive: O(N) for nearly sorted inputs.
      """
      for i in range(1, len(arr)):
          key = arr[i]
          j = i - 1
          while j >= 0 and arr[j] > key:
              arr[j + 1] = arr[j]
              j -= 1
          arr[j + 1] = key
      return arr
  `,
    cpp: `#include <vector>
  
  /**
   * Insertion Sort: O(N²) comparison sort.
   * Highly adaptive: O(N) for nearly sorted inputs.
   */
  void insertionSort(std::vector<int>& arr) {
      int n = arr.size();
      for (int i = 1; i < n; i++) {
          int key = arr[i];
          int j = i - 1;
          while (j >= 0 && arr[j] > key) {
              arr[j + 1] = arr[j];
              j = j - 1;
          }
          arr[j + 1] = key;
      }
  }
  `,
    typescript: `/**
   * Insertion Sort: O(N²) comparison sort.
   * Highly adaptive: O(N) for nearly sorted inputs.
   */
  function insertionSort(arr: number[]): number[] {
    const temp = [...arr];
    for (let i = 1; i < temp.length; i++) {
      const key = temp[i];
      let j = i - 1;
      while (j >= 0 && temp[j] > key) {
        temp[j + 1] = temp[j];
        j--;
      }
      temp[j + 1] = key;
    }
    return temp;
  }
  `,
    java: `public class InsertionSort {
      /**
       * Insertion Sort: O(N²) comparison sort.
       * Highly adaptive: O(N) for nearly sorted inputs.
       */
      public static void insertionSort(int[] arr) {
          int n = arr.length;
          for (int i = 1; i < n; ++i) {
              int key = arr[i];
              int j = i - 1;
              while (j >= 0 && arr[j] > key) {
                  arr[j + 1] = arr[j];
                  j = j - 1;
              }
              arr[j + 1] = key;
          }
      }
  }
  `,
  },
  "merge-sort": {
    python: `def merge_sort(arr):
      """
      Merge Sort: Stable divide-and-conquer algorithm.
      Time: O(N log N) worst/avg. Space: O(N).
      """
      if len(arr) <= 1:
          return arr
      
      mid = len(arr) // 2
      left = merge_sort(arr[:mid])
      right = merge_sort(arr[mid:])
      
      return merge(left, right)
  
  def merge(left, right):
      result = []
      i = j = 0
      while i < len(left) and j < len(right):
          if left[i] <= right[j]:
              result.append(left[i])
              i += 1
          else:
              result.append(right[j])
              j += 1
      result.extend(left[i:])
      result.extend(right[j:])
      return result
  `,
    cpp: `#include <vector>
  
  void merge(std::vector<int>& arr, int l, int m, int r) {
      int n1 = m - l + 1;
      int n2 = r - m;
      std::vector<int> L(n1), R(n2);
      for (int i = 0; i < n1; i++) L[i] = arr[l + i];
      for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
      
      int i = 0, j = 0, k = l;
      while (i < n1 && j < n2) {
          if (L[i] <= R[j]) {
              arr[k] = L[i];
              i++;
          } else {
              arr[k] = R[j];
              j++;
          }
          k++;
      }
      while (i < n1) { arr[k] = L[i]; i++; k++; }
      while (j < n2) { arr[k] = R[j]; j++; k++; }
  }
  
  /**
   * Merge Sort: Stable divide-and-conquer algorithm.
   * Time: O(N log N) worst/avg. Space: O(N).
   */
  void mergeSort(std::vector<int>& arr, int l, int r) {
      if (l >= r) return;
      int m = l + (r - l) / 2;
      mergeSort(arr, l, m);
      mergeSort(arr, m + 1, r);
      merge(arr, l, m, r);
  }
  `,
    typescript: `/**
   * Merge Sort: Stable divide-and-conquer algorithm.
   * Time: O(N log N) worst/avg. Space: O(N).
   */
  function mergeSort(arr: number[]): number[] {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    return merge(left, right);
  }
  
  function merge(left: number[], right: number[]): number[] {
    const result: number[] = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        result.push(left[i++]);
      } else {
        result.push(right[j++]);
      }
    }
    return [...result, ...left.slice(i), ...right.slice(j)];
  }
  `,
    java: `public class MergeSort {
      /**
       * Merge Sort: Stable divide-and-conquer algorithm.
       * Time: O(N log N) worst/avg. Space: O(N).
       */
      public static void mergeSort(int[] arr, int l, int r) {
          if (l < r) {
              int m = l + (r - l) / 2;
              mergeSort(arr, l, m);
              mergeSort(arr, m + 1, r);
              merge(arr, l, m, r);
          }
      }
  
      private static void merge(int[] arr, int l, int m, int r) {
          int n1 = m - l + 1;
          int n2 = r - m;
          int[] L = new int[n1];
          int[] R = new int[n2];
          System.arraycopy(arr, l, L, 0, n1);
          System.arraycopy(arr, m + 1, R, 0, n2);
          
          int i = 0, j = 0, k = l;
          while (i < n1 && j < n2) {
              if (L[i] <= R[j]) {
                  arr[k] = L[i++];
              } else {
                  arr[k] = R[j++];
              }
              k++;
          }
          while (i < n1) arr[k++] = L[i++];
          while (j < n2) arr[k++] = R[j++];
      }
  }
  `,
  },
  "quick-sort": {
    python: `def quick_sort(arr, low=0, high=None):
      """
      Quicksort: Efficient divide-and-conquer, in-place.
      Time: O(N log N) average, O(N²) worst-case.
      """
      if high is None:
          high = len(arr) - 1
          
      if low < high:
          p = partition(arr, low, high)
          quick_sort(arr, low, p - 1)
          quick_sort(arr, p + 1, high)
      return arr
  
  def partition(arr, low, high):
      pivot = arr[high]
      i = low - 1
      for j in range(low, high):
          if arr[j] < pivot:
              i += 1
              arr[i], arr[j] = arr[j], arr[i]
      arr[i + 1], arr[high] = arr[high], arr[i + 1]
      return i + 1
  `,
    cpp: `#include <vector>
  #include <algorithm>
  
  int partition(std::vector<int>& arr, int low, int high) {
      int pivot = arr[high];
      int i = low - 1;
      for (int j = low; j < high; j++) {
          if (arr[j] < pivot) {
              i++;
              std::swap(arr[i], arr[j]);
          }
      }
      std::swap(arr[i + 1], arr[high]);
      return i + 1;
  }
  
  /**
   * Quicksort: Efficient divide-and-conquer, in-place.
   * Time: O(N log N) average, O(N²) worst-case.
   */
  void quickSort(std::vector<int>& arr, int low, int high) {
      if (low < high) {
          int p = partition(arr, low, high);
          quickSort(arr, low, p - 1);
          quickSort(arr, p + 1, high);
      }
  }
  `,
    typescript: `/**
   * Quicksort: Efficient divide-and-conquer, in-place.
   * Time: O(N log N) average, O(N²) worst-case.
   */
  function quickSort(arr: number[], low: number = 0, high: number = arr.length - 1): number[] {
    const temp = [...arr];
    quickSortHelper(temp, low, high);
    return temp;
  }
  
  function quickSortHelper(arr: number[], low: number, high: number) {
    if (low < high) {
      const p = partition(arr, low, high);
      quickSortHelper(arr, low, p - 1);
      quickSortHelper(arr, p + 1, high);
    }
  }
  
  function partition(arr: number[], low: number, high: number): number {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
  }
  `,
    java: `public class QuickSort {
      /**
       * Quicksort: Efficient divide-and-conquer, in-place.
       * Time: O(N log N) average, O(N²) worst-case.
       */
      public static void quickSort(int[] arr, int low, int high) {
          if (low < high) {
              int p = partition(arr, low, high);
              quickSort(arr, low, p - 1);
              quickSort(arr, p + 1, high);
          }
      }
  
      private static int partition(int[] arr, int low, int high) {
          int pivot = arr[high];
          int i = low - 1;
          for (int j = low; j < high; j++) {
              if (arr[j] < pivot) {
                  i++;
                  int temp = arr[i];
                  arr[i] = arr[j];
                  arr[j] = temp;
              }
          }
          int temp = arr[i + 1];
          arr[i + 1] = arr[high];
          arr[high] = temp;
          return i + 1;
      }
  }
  `,
  },
  "binary-search": {
    python: `def binary_search(arr, target):
      """
      Binary Search: O(log N) search on a sorted list.
      """
      low = 0
      high = len(arr) - 1
      while low <= high:
          mid = (low + high) // 2
          if arr[mid] == target:
              return mid
          elif arr[mid] < target:
              low = mid + 1
          else:
              high = mid - 1
      return -1
  `,
    cpp: `#include <vector>
  
  /**
   * Binary Search: O(log N) search on a sorted vector.
   */
  int binarySearch(const std::vector<int>& arr, int target) {
      int low = 0;
      int high = arr.size() - 1;
      while (low <= high) {
          int mid = low + (high - low) / 2;
          if (arr[mid] == target) return mid;
          if (arr[mid] < target) low = mid + 1;
          else high = mid - 1;
      }
      return -1;
  }
  `,
    typescript: `/**
   * Binary Search: O(log N) search on a sorted list.
   */
  function binarySearch(arr: number[], target: number): number {
    let low = 0;
    let high = arr.length - 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (arr[mid] === target) return mid;
      else if (arr[mid] < target) low = mid + 1;
      else high = mid - 1;
    }
    return -1;
  }
  `,
    java: `public class BinarySearch {
      /**
       * Binary Search: O(log N) search on a sorted list.
       */
      public static int binarySearch(int[] arr, int target) {
          int low = 0;
          int high = arr.length - 1;
          while (low <= high) {
              int mid = low + (high - low) / 2;
              if (arr[mid] == target) return mid;
              if (arr[mid] < target) low = mid + 1;
              else high = mid - 1;
          }
          return -1;
      }
  }
  `,
  },
  bfs: {
    python: `from collections import deque
  
  def bfs(graph, start_node):
      """
      Sequential Breadth-First Search: traversal using queue.
      Time: O(V + E), Space: O(V).
      """
      visited = {start_node}
      queue = deque([start_node])
      order = []
      
      while queue:
          vertex = queue.popleft()
          order.append(vertex)
          
          for neighbor in graph[vertex]:
              if neighbor not in visited:
                  visited.add(neighbor)
                  queue.append(neighbor)
                  
      return order
  `,
    cpp: `#include <vector>
  #include <queue>
  
  /**
   * Sequential Breadth-First Search: traversal using queue.
   * Time: O(V + E), Space: O(V).
   */
  std::vector<int> bfs(const std::vector<std::vector<int>>& adj, int start) {
      int n = adj.size();
      std::vector<bool> visited(n, false);
      std::queue<int> q;
      std::vector<int> order;
  
      visited[start] = true;
      q.push(start);
  
      while (!q.empty()) {
          int u = q.front();
          q.pop();
          order.push_back(u);
  
          for (int v : adj[u]) {
              if (!visited[v]) {
                  visited[v] = true;
                  q.push(v);
              }
          }
      }
      return order;
  }
  `,
    typescript: `/**
   * Sequential Breadth-First Search: traversal using queue.
   * Time: O(V + E), Space: O(V).
   */
  function bfs(adjList: number[][], startNode: number): number[] {
    const visited = new Set<number>([startNode]);
    const queue: number[] = [startNode];
    const order: number[] = [];
  
    while (queue.length > 0) {
      const node = queue.shift()!;
      order.push(node);
  
      for (const neighbor of adjList[node]) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    return order;
  }
  `,
    java: `import java.util.*;
  
  public class BFS {
      /**
       * Sequential Breadth-First Search: traversal using queue.
       * Time: O(V + E), Space: O(V).
       */
      public static List<Integer> bfs(List<List<Integer>> adj, int start) {
          List<Integer> order = new ArrayList<>();
          boolean[] visited = new boolean[adj.size()];
          Queue<Integer> q = new LinkedList<>();
  
          visited[start] = true;
          q.add(start);
  
          while (!q.isEmpty()) {
              int u = q.poll();
              order.add(u);
  
              for (int v : adj.get(u)) {
                  if (!visited[v]) {
                      visited[v] = true;
                      q.add(v);
                  }
              }
          }
          return order;
      }
  }
  `,
  },
  dijkstra: {
    python: `import heapq
  
  def dijkstra(graph, source):
      """
      Dijkstra's Shortest Path on weighted graphs.
      Time: O((V + E) log V). Space: O(V).
      """
      distances = {node: float('infinity') for node in graph}
      distances[source] = 0
      pq = [(0, source)] # min-heap
      
      while pq:
          current_distance, current_node = heapq.heappop(pq)
          
          # Check if we found a shorter path already
          if current_distance > distances[current_node]:
              continue
              
          for neighbor, weight in graph[current_node]:
              distance = current_distance + weight
              if distance < distances[neighbor]:
                  distances[neighbor] = distance
                  heapq.heappush(pq, (distance, neighbor))
                  
      return distances
  `,
    cpp: `#include <vector>
  #include <queue>
  #include <utility>
  
  const int INF = 1e9;
  
  /**
   * Dijkstra's Shortest Path on weighted graphs.
   * Time: O((V + E) log V). Space: O(V).
   */
  std::vector<int> dijkstra(const std::vector<std::vector<std::pair<int, int>>>& adj, int src) {
      int n = adj.size();
      std::vector<int> dist(n, INF);
      std::priority_queue<std::pair<int, int>, 
                          std::vector<std::pair<int, int>>, 
                          std::greater<std::pair<int, int>>> pq;
  
      dist[src] = 0;
      pq.push({0, src});
  
      while (!pq.empty()) {
          int u = pq.top().second;
          int d = pq.top().first;
          pq.pop();
  
          if (d > dist[u]) continue;
  
          for (auto edge : adj[u]) {
              int v = edge.first;
              int weight = edge.second;
              if (dist[u] + weight < dist[v]) {
                  dist[v] = dist[u] + weight;
                  pq.push({dist[v], v});
              }
          }
      }
      return dist;
  }
  `,
    typescript: `interface Edge {
    node: number;
    weight: number;
  }
  
  /**
   * Dijkstra's Shortest Path on weighted graphs.
   * Time: O((V + E) log V). Space: O(V).
   */
  function dijkstra(graph: Edge[][], source: number): number[] {
    const dist = Array(graph.length).fill(Infinity);
    const visited = Array(graph.length).fill(false);
    dist[source] = 0;
  
    for (let i = 0; i < graph.length - 1; i++) {
      let u = -1;
      let minD = Infinity;
      for (let v = 0; v < graph.length; v++) {
        if (!visited[v] && dist[v] < minD) {
          minD = dist[v];
          u = v;
        }
      }
  
      if (u === -1) break;
      visited[u] = true;
  
      for (const edge of graph[u]) {
        if (!visited[edge.node] && dist[u] + edge.weight < dist[edge.node]) {
          dist[edge.node] = dist[u] + edge.weight;
        }
      }
    }
    return dist;
  }
  `,
    java: `import java.util.*;
  
  public class Dijkstra {
      static class Edge {
          int node, weight;
          Edge(int node, int weight) { this.node = node; this.weight = weight; }
      }
  
      /**
       * Dijkstra's Shortest Path on weighted graphs.
       * Time: O((V + E) log V). Space: O(V).
       */
      public static int[] dijkstra(List<List<Edge>> graph, int src) {
          int n = graph.size();
          int[] dist = new int[n];
          Arrays.fill(dist, Integer.MAX_VALUE);
          dist[src] = 0;
  
          PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));
          pq.add(new int[]{src, 0});
  
          while (!pq.isEmpty()) {
              int[] curr = pq.poll();
              int u = curr[0];
              int d = curr[1];
  
              if (d > dist[u]) continue;
  
              for (Edge edge : graph.get(u)) {
                  if (dist[u] + edge.weight < dist[edge.node]) {
                      dist[edge.node] = dist[u] + edge.weight;
                      pq.add(new int[]{edge.node, dist[edge.node]});
                  }
              }
          }
          return dist;
      }
  }
  `,
  },
  "parallel-reduction": {
    python: `def parallel_reduction_sum(arr):
      """
      PRAM-EREW Parallel Reduction (Sum): log(N) tree lanes.
      This emulates concurrent active processes completing tree merges.
      """
      n = len(arr)
      data = list(arr)
      step = 1
      while step < n:
          # In a real parallel machine, each index addition executes concurrently
          # on different processors.
          for i in range(0, n, step * 2):
              if i + step < n:
                  data[i] += data[i + step]
          step *= 2
      return data[0]
  `,
    cpp: `#include <vector>
  #include <thread>
  
  /**
   * Parallel Tree-Based Reduction Sum (PRAM-EREW emulation)
   * Spawns concurrent lanes joining values at each level.
   */
  int parallelReductionSum(std::vector<int>& arr) {
      int n = arr.size();
      for (int step = 1; step < n; step *= 2) {
          std::vector<std::thread> threads;
          for (int i = 0; i < n; i += step * 2) {
              if (i + step < n) {
                  threads.push_back(std::thread([&arr, i, step]() {
                      arr[i] += arr[i + step];
                  }));
              }
          }
          for (auto& t : threads) {
              if (t.joinable()) t.join(); // Barrier synchronization at each level
          }
      }
      return arr[0];
  }
  `,
    typescript: `/**
   * Parallel Tree-Based Reduction Sum (PRAM-EREW emulation)
   * Spawns concurrent tasks synchronizing via Promise.all
   */
  async function parallelReductionSum(arr: number[]): Promise<number> {
    const data = [...arr];
    const n = data.length;
    for (let step = 1; step < n; step *= 2) {
      const tasks: Promise<void>[] = [];
      for (let i = 0; i < n; i += step * 2) {
        if (i + step < n) {
          tasks.push((async () => {
            data[i] += data[i + step];
          })());
        }
      }
      await Promise.all(tasks); // Barrier synchronization (join)
    }
    return data[0];
  }
  `,
    java: `import java.util.concurrent.ForkJoinPool;
  import java.util.concurrent.RecursiveTask;
  
  /**
   * Parallel reduction using Fork/Join Framework
   */
  public class ParallelReduction extends RecursiveTask<Integer> {
      private final int[] arr;
      private final int start, end;
      private static final int THRESHOLD = 2;
  
      public ParallelReduction(int[] arr, int start, int end) {
          this.arr = arr; this.start = start; this.end = end;
      }
  
      @Override
      protected Integer compute() {
          if (end - start <= THRESHOLD) {
              int sum = 0;
              for (int i = start; i < end; i++) sum += arr[i];
              return sum;
          }
          int mid = start + (end - start) / 2;
          ParallelReduction left = new ParallelReduction(arr, start, mid);
          ParallelReduction right = new ParallelReduction(arr, mid, end);
          left.fork();
          return right.compute() + left.join();
      }
  }
  `,
  },
  "parallel-prefix-sum": {
    python: `import math
  
  def hillis_steele_prefix_sum(arr):
      """
      Hillis-Steele Parallel Prefix Sum (PRAM-CREW).
      Time: O(log N) steps. Work: O(N log N).
      """
      n = len(arr)
      a = list(arr)
      temp = [0] * n
      steps = math.ceil(math.log2(n))
      
      for d in range(steps):
          offset = 2**d
          # Concurrently calculate values (simulated)
          for i in range(n):
              if i >= offset:
                  temp[i] = a[i] + a[i - offset]
              else:
                  temp[i] = a[i]
          a = list(temp) # Copy back (acts as Barrier synchronization)
      return a
  `,
    cpp: `#include <vector>
  #include <thread>
  #include <cmath>
  
  /**
   * Hillis-Steele Parallel Prefix Sum (PRAM-CREW)
   * Concurrently spawns threads to process index shifts and synchronized steps.
   */
  void parallelPrefixSum(std::vector<int>& arr) {
      int n = arr.size();
      std::vector<int> temp(n);
      int steps = std::ceil(std::log2(n));
  
      for (int d = 0; d < steps; d++) {
          int offset = 1 << d;
          std::vector<std::thread> threads;
  
          for (int i = 0; i < n; i++) {
              threads.push_back(std::thread([&arr, &temp, i, offset]() {
                  if (i >= offset) {
                      temp[i] = arr[i] + arr[i - offset];
                  } else {
                      temp[i] = arr[i];
                  }
              }));
          }
          for (auto& t : threads) t.join(); // Barrier synchronization (joining)
          arr = temp; // Copy back for next logarithmic step
      }
  }
  `,
    typescript: `/**
   * Hillis-Steele Parallel Prefix Sum (PRAM-CREW)
   * Concurrently processes steps using asynchronous tasks.
   */
  async function parallelPrefixSum(arr: number[]): Promise<number[]> {
    const n = arr.length;
    let a = [...arr];
    const temp = Array(n).fill(0);
    const steps = Math.ceil(Math.log2(n));
  
    for (let d = 0; d < steps; d++) {
      const offset = 1 << d;
      const tasks: Promise<void>[] = [];
  
      for (let i = 0; i < n; i++) {
        tasks.push((async () => {
          if (i >= offset) {
            temp[i] = a[i] + a[i - offset];
          } else {
            temp[i] = a[i];
          }
        })());
      }
      await Promise.all(tasks); // Barrier Sync (join)
      a = [...temp];
    }
    return a;
  }
  `,
    java: `import java.util.concurrent.CyclicBarrier;
  
  /**
   * Hillis-Steele Parallel Prefix Sum (PRAM-CREW)
   * Multi-threaded implementation using Java Threads.
   */
  public class ParallelPrefixSum {
      public static void prefixSum(int[] arr) {
          int n = arr.length;
          int[] temp = new int[n];
          int steps = (int) Math.ceil(Math.log(n) / Math.log(2));
  
          for (int d = 0; d < steps; d++) {
              final int offset = 1 << d;
              final int[] activeSource = (d % 2 == 0) ? arr : temp;
              final int[] activeTarget = (d % 2 == 0) ? temp : arr;
  
              Thread[] threads = new Thread[n];
              for (int i = 0; i < n; i++) {
                  final int idx = i;
                  threads[i] = new Thread(() -> {
                      if (idx >= offset) {
                          activeTarget[idx] = activeSource[idx] + activeSource[idx - offset];
                      } else {
                          activeTarget[idx] = activeSource[idx];
                      }
                  });
                  threads[i].start();
              }
              try {
                  for (Thread t : threads) t.join(); // Barrier sync
              } catch (InterruptedException e) {
                  e.printStackTrace();
              }
          }
          if (steps % 2 != 0) {
              System.arraycopy(temp, 0, arr, 0, n);
          }
      }
  }
  `,
  },
  "bitonic-sort": {
    python: `def bitonic_sort(arr):
      """
      Bitonic Sort: O(log² N) parallel comparison-based sorting network.
      Assumes array length is a power of 2.
      """
      n = len(arr)
      bitonic_sort_rec(arr, 0, n, 1) # 1 for Ascending
      return arr
  
  def bitonic_sort_rec(arr, low, cnt, direction):
      if cnt > 1:
          k = cnt // 2
          # Sort left half in ascending order
          bitonic_sort_rec(arr, low, k, 1)
          # Sort right half in descending order
          bitonic_sort_rec(arr, low + k, k, 0)
          # Merge the halves
          bitonic_merge(arr, low, cnt, direction)
  
  def bitonic_merge(arr, low, cnt, direction):
      if cnt > 1:
          k = cnt // 2
          for i in range(low, low + k):
              compare_and_swap(arr, i, i + k, direction)
          bitonic_merge(arr, low, k, direction)
          bitonic_merge(arr, low + k, k, direction)
  
  def compare_and_swap(arr, i, j, direction):
      if (direction == 1 and arr[i] > arr[j]) or (direction == 0 and arr[i] < arr[j]):
          arr[i], arr[j] = arr[j], arr[i]
  `,
    cpp: `#include <vector>
  #include <algorithm>
  
  void compareAndSwap(std::vector<int>& arr, int i, int j, int dir) {
      if ((dir == 1 && arr[i] > arr[j]) || (dir == 0 && arr[i] < arr[j])) {
          std::swap(arr[i], arr[j]);
      }
  }
  
  void bitonicMerge(std::vector<int>& arr, int low, int cnt, int dir) {
      if (cnt > 1) {
          int k = cnt / 2;
          for (int i = low; i < low + k; i++) {
              compareAndSwap(arr, i, i + k, dir);
          }
          bitonicMerge(arr, low, k, dir);
          bitonicMerge(arr, low + k, k, dir);
      }
  }
  
  /**
   * Bitonic Sort: O(log² N) parallel comparison-based sorting network.
   * Assumes array length is a power of 2.
   */
  void bitonicSortHelper(std::vector<int>& arr, int low, int cnt, int dir) {
      if (cnt > 1) {
          int k = cnt / 2;
          bitonicSortHelper(arr, low, k, 1);
          bitonicSortHelper(arr, low + k, k, 0);
          bitonicMerge(arr, low, cnt, dir);
      }
  }
  
  void bitonicSort(std::vector<int>& arr) {
      bitonicSortHelper(arr, 0, arr.size(), 1);
  }
  `,
    typescript: `/**
   * Bitonic Sort: O(log² N) parallel comparison-based sorting network.
   * Assumes array length is a power of 2.
   */
  function bitonicSort(arr: number[]): number[] {
    const temp = [...arr];
    bitonicSortRec(temp, 0, temp.length, 1);
    return temp;
  }
  
  function bitonicSortRec(arr: number[], low: number, cnt: number, dir: number) {
    if (cnt > 1) {
      const k = Math.floor(cnt / 2);
      bitonicSortRec(arr, low, k, 1);
      bitonicSortRec(arr, low + k, k, 0);
      bitonicMerge(arr, low, cnt, dir);
    }
  }
  
  function bitonicMerge(arr: number[], low: number, cnt: number, dir: number) {
    if (cnt > 1) {
      const k = Math.floor(cnt / 2);
      for (let i = low; i < low + k; i++) {
        compareAndSwap(arr, i, i + k, dir);
      }
      bitonicMerge(arr, low, k, dir);
      bitonicMerge(arr, low + k, k, dir);
    }
  }
  
  function compareAndSwap(arr: number[], i: number, j: number, dir: number) {
    if ((dir === 1 && arr[i] > arr[j]) || (dir === 0 && arr[i] < arr[j])) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  `,
    java: `public class BitonicSort {
      /**
       * Bitonic Sort: O(log² N) parallel comparison-based sorting network.
       * Assumes array length is a power of 2.
       */
      public static void sort(int[] arr) {
          bitonicSort(arr, 0, arr.length, 1);
      }
  
      private static void bitonicSort(int[] arr, int low, int cnt, int dir) {
          if (cnt > 1) {
              int k = cnt / 2;
              bitonicSort(arr, low, k, 1);
              bitonicSort(arr, low + k, k, 0);
              bitonicMerge(arr, low, cnt, dir);
          }
      }
  
      private static void bitonicMerge(int[] arr, int low, int cnt, int dir) {
          if (cnt > 1) {
              int k = cnt / 2;
              for (int i = low; i < low + k; i++) {
                  compareAndSwap(arr, i, i + k, dir);
              }
              bitonicMerge(arr, low, k, dir);
              bitonicMerge(arr, low + k, k, dir);
          }
      }
  
      private static void compareAndSwap(int[] arr, int i, int j, int dir) {
          if ((dir == 1 && arr[i] > arr[j]) || (dir == 0 && arr[i] < arr[j])) {
              int temp = arr[i];
              arr[i] = arr[j];
              arr[j] = temp;
          }
      }
  }
  `,
  },
  "odd-even-sort": {
    python: `def odd_even_transposition_sort(arr):
      """
      Odd-Even Transposition Sort (Ring / linear networks).
      Concurrently processes indices swapping adjacent elements.
      """
      n = len(arr)
      is_sorted = False
      while not is_sorted:
          is_sorted = True
          # Odd phase
          for i in range(1, n - 1, 2):
              if arr[i] > arr[i + 1]:
                  arr[i], arr[i + 1] = arr[i + 1], arr[i]
                  is_sorted = False
          # Even phase
          for i in range(0, n - 1, 2):
              if arr[i] > arr[i + 1]:
                  arr[i], arr[i + 1] = arr[i + 1], arr[i]
                  is_sorted = False
      return arr
  `,
    cpp: `#include <vector>
  #include <thread>
  #include <algorithm>
  
  /**
   * Parallel Odd-Even Transposition Sort
   * Uses threads to concurrently compare index segments on odd/even phases.
   */
  void oddEvenSort(std::vector<int>& arr) {
      int n = arr.size();
      bool isSorted = false;
      while (!isSorted) {
          isSorted = true;
  
          // Odd Phase (Concurrently compare)
          std::vector<std::thread> oddThreads;
          for (int i = 1; i < n - 1; i += 2) {
              oddThreads.push_back(std::thread([&arr, &isSorted, i]() {
                  if (arr[i] > arr[i + 1]) {
                      std::swap(arr[i], arr[i + 1]);
                      isSorted = false;
                  }
              }));
          }
          for (auto& t : oddThreads) t.join();
  
          // Even Phase (Concurrently compare)
          std::vector<std::thread> evenThreads;
          for (int i = 0; i < n - 1; i += 2) {
              evenThreads.push_back(std::thread([&arr, &isSorted, i]() {
                  if (arr[i] > arr[i + 1]) {
                      std::swap(arr[i], arr[i + 1]);
                      isSorted = false;
                  }
              }));
          }
          for (auto& t : evenThreads) t.join();
      }
  }
  `,
    typescript: `/**
   * Parallel Odd-Even Transposition Sort
   * Runs concurrent checks on index pairs in odd and even phases.
   */
  async function oddEvenSort(arr: number[]): Promise<number[]> {
    const temp = [...arr];
    const n = temp.length;
    let isSorted = false;
  
    while (!isSorted) {
      isSorted = true;
      
      // Odd phase
      const oddTasks: Promise<void>[] = [];
      for (let i = 1; i < n - 1; i += 2) {
        oddTasks.push((async () => {
          if (temp[i] > temp[i + 1]) {
            [temp[i], temp[i + 1]] = [temp[i + 1], temp[i]];
            isSorted = false;
          }
        })());
      }
      await Promise.all(oddTasks);
  
      // Even phase
      const evenTasks: Promise<void>[] = [];
      for (let i = 0; i < n - 1; i += 2) {
        evenTasks.push((async () => {
          if (temp[i] > temp[i + 1]) {
            [temp[i], temp[i + 1]] = [temp[i + 1], temp[i]];
            isSorted = false;
          }
        })());
      }
      await Promise.all(evenTasks);
    }
    return temp;
  }
  `,
    java: `public class OddEvenSort {
      /**
       * Parallel Odd-Even Transposition Sort
       */
      public static void oddEvenSort(int[] arr) {
          int n = arr.length;
          boolean isSorted = false;
          while (!isSorted) {
              isSorted = true;
              // Odd phase
              for (int i = 1; i < n - 1; i += 2) {
                  if (arr[i] > arr[i + 1]) {
                      int temp = arr[i];
                      arr[i] = arr[i + 1];
                      arr[i + 1] = temp;
                      isSorted = false;
                  }
              }
              // Even phase
              for (int i = 0; i < n - 1; i += 2) {
                  if (arr[i] > arr[i + 1]) {
                      int temp = arr[i];
                      arr[i] = arr[i + 1];
                      arr[i + 1] = temp;
                      isSorted = false;
                  }
              }
          }
      }
  }
  `,
  },
  "pointer-jumping": {
    python: `import math
  
  def pointer_jumping(next_ptr, d):
      """
      Pointer Jumping (List Ranking): O(log N) parallel path-compression technique.
      Finds distance of every node to the list tail.
      """
      n = len(next_ptr)
      steps = math.ceil(math.log2(n))
      
      for _ in range(steps):
          next_temp = list(next_ptr)
          d_temp = list(d)
          
          # Concurrently jump pointers
          for i in range(n):
              if next_ptr[i] is not None:
                  d_temp[i] = d[i] + d[next_ptr[i]]
                  next_temp[i] = next_ptr[next_ptr[i]]
                  
          next_ptr = next_temp
          d = d_temp
      return d
  `,
    cpp: `#include <vector>
  #include <thread>
  #include <cmath>
  
  /**
   * Pointer Jumping / List Ranking algorithm
   * Compresses parent paths logarithmically using concurrent threads.
   */
  void pointerJumping(std::vector<int>& next, std::vector<int>& d) {
      int n = next.size();
      int steps = std::ceil(std::log2(n));
  
      for (int step = 0; step < steps; step++) {
          std::vector<int> next_temp = next;
          std::vector<int> d_temp = d;
          std::vector<std::thread> threads;
  
          for (int i = 0; i < n; i++) {
              threads.push_back(std::thread([&next, &d, &next_temp, &d_temp, i]() {
                  if (next[i] != -1) {
                      d_temp[i] = d[i] + d[next[i]];
                      next_temp[i] = next[next[i]];
                  }
              }));
          }
          for (auto& t : threads) t.join(); // Barrier synchronization (join)
          next = next_temp;
          d = d_temp;
      }
  }
  `,
    typescript: `/**
   * Pointer Jumping / List Ranking algorithm
   * Compresses parent paths logarithmically using concurrent tasks.
   */
  async function pointerJumping(next: (number | null)[], d: number[]): Promise<number[]> {
    const n = next.length;
    let currentNext = [...next];
    let currentD = [...d];
    const steps = Math.ceil(Math.log2(n));
  
    for (let step = 0; step < steps; step++) {
      const nextTemp = [...currentNext];
      const dTemp = [...currentD];
      const tasks: Promise<void>[] = [];
  
      for (let i = 0; i < n; i++) {
        tasks.push((async () => {
          const nextNode = currentNext[i];
          if (nextNode !== null) {
            dTemp[i] = currentD[i] + currentD[nextNode];
            nextTemp[i] = currentNext[nextNode];
          }
        })());
      }
      await Promise.all(tasks); // Barrier Sync (join)
      currentNext = nextTemp;
      currentD = dTemp;
    }
    return currentD;
  }
  `,
    java: `/**
   * Pointer Jumping / List Ranking algorithm
   */
  public class PointerJumping {
      public static void pointerJumping(Integer[] next, int[] d) {
          int n = next.length;
          int steps = (int) Math.ceil(Math.log(n) / Math.log(2));
  
          for (int step = 0; step < steps; step++) {
              Integer[] nextTemp = next.clone();
              int[] dTemp = d.clone();
              Thread[] threads = new Thread[n];
  
              for (int i = 0; i < n; i++) {
                  final int idx = i;
                  threads[i] = new Thread(() -> {
                      if (next[idx] != null) {
                          dTemp[idx] = d[idx] + d[next[idx]];
                          nextTemp[idx] = next[next[idx]];
                      }
                  });
                  threads[i].start();
              }
              try {
                  for (Thread t : threads) t.join(); // Barrier Sync
              } catch (InterruptedException e) {
                  e.printStackTrace();
              }
              next = nextTemp;
              d = dTemp;
          }
      }
  }
  `,
  },
  "parallel-bfs": {
    python: `def parallel_bfs(graph, start_node):
      """
      Parallel Breadth-First Search (PRAM-CREW frontier expansion).
      Time: O(diameter * log V).
      """
      levels = {start_node: 0}
      frontier = [start_node]
      
      while frontier:
          next_frontier = []
          # In a parallel engine, expansion from all frontier nodes runs concurrently
          for u in frontier:
              for v in graph[u]:
                  if v not in levels:
                      levels[v] = levels[u] + 1
                      next_frontier.append(v)
          frontier = next_frontier
      return levels
  `,
    cpp: `#include <vector>
  #include <thread>
  #include <mutex>
  
  /**
   * Parallel Breadth First Search (PRAM-CREW frontier expansion)
   * Uses threads to concurrently expand vertex frontiers.
   */
  void parallelBFS(const std::vector<std::vector<int>>& adj, int start, std::vector<int>& level) {
      int n = adj.size();
      level.assign(n, -1);
      level[start] = 0;
  
      std::vector<int> frontier = {start};
      std::mutex mtx;
  
      while (!frontier.empty()) {
          std::vector<int> next_frontier;
          std::vector<std::thread> threads;
  
          for (int u : frontier) {
              threads.push_back(std::thread([&adj, &level, u, &next_frontier, &mtx]() {
                  for (int v : adj[u]) {
                      bool assigned = false;
                      mtx.lock();
                      if (level[v] == -1) {
                          level[v] = level[u] + 1;
                          assigned = true;
                      }
                      mtx.unlock();
                      if (assigned) {
                          std::lock_guard<std::mutex> lock(mtx);
                          next_frontier.push_back(v);
                      }
                  }
              }));
          }
          for (auto& t : threads) t.join(); // Sync step barrier
          frontier = next_frontier;
      }
  }
  `,
    typescript: `/**
   * Parallel Breadth First Search (PRAM-CREW frontier expansion)
   * Uses async tasks to concurrently expand vertex frontiers.
   */
  async function parallelBFS(adjList: number[][], startNode: number): Promise<number[]> {
    const n = adjList.length;
    const level = Array(n).fill(-1);
    level[startNode] = 0;
  
    let frontier: number[] = [startNode];
  
    while (frontier.length > 0) {
      const nextFrontier: number[] = [];
      const tasks: Promise<void>[] = [];
  
      for (const u of frontier) {
        tasks.push((async () => {
          for (const v of adjList[u]) {
            if (level[v] === -1) {
              level[v] = level[u] + 1;
              nextFrontier.push(v);
            }
          }
        })());
      }
      await Promise.all(tasks); // Barrier Sync
      frontier = nextFrontier;
    }
    return level;
  }
  `,
    java: `import java.util.*;
  import java.util.concurrent.ConcurrentLinkedQueue;
  
  /**
   * Parallel Breadth First Search (PRAM-CREW frontier expansion)
   */
  public class ParallelBFS {
      public static int[] parallelBFS(List<List<Integer>> adj, int start) {
          int n = adj.size();
          int[] level = new int[n];
          Arrays.fill(level, -1);
          level[start] = 0;
  
          List<Integer> frontier = new ArrayList<>();
          frontier.add(start);
  
          while (!frontier.isEmpty()) {
              ConcurrentLinkedQueue<Integer> nextFrontier = new ConcurrentLinkedQueue<>();
              Thread[] threads = new Thread[frontier.size()];
  
              for (int i = 0; i < frontier.size(); i++) {
                  final int u = frontier.get(i);
                  threads[i] = new Thread(() -> {
                      for (int v : adj.get(u)) {
                          synchronized (adj) {
                              if (level[v] == -1) {
                                  level[v] = level[u] + 1;
                                  nextFrontier.add(v);
                              }
                          }
                      }
                  });
                  threads[i].start();
              }
              try {
                  for (Thread t : threads) t.join(); // Barrier Sync
              } catch (InterruptedException e) {
                  e.printStackTrace();
              }
              frontier = new ArrayList<>(nextFrontier);
          }
          return level;
      }
  }
  `,
  },
  dfs: {
    python: `def dfs(graph, start_node):
      """
      Sequential Depth-First Search: traversal using stack.
      Time: O(V + E), Space: O(V).
      """
      visited = {start_node}
      stack = [start_node]
      order = []
      
      while stack:
          vertex = stack.pop()
          order.append(vertex)
          
          # Traverse in original order by pushing in reverse
          for neighbor in reversed(graph[vertex]):
              if neighbor not in visited:
                  visited.add(neighbor)
                  stack.append(neighbor)
                  
      return order
  `,
    cpp: `#include <vector>
  #include <stack>
  #include <algorithm>
  
  /**
   * Sequential Depth-First Search: traversal using stack.
   * Time: O(V + E), Space: O(V).
   */
  std::vector<int> dfs(const std::vector<std::vector<int>>& adj, int start) {
      int n = adj.size();
      std::vector<bool> visited(n, false);
      std::stack<int> s;
      std::vector<int> order;
  
      visited[start] = true;
      s.push(start);
  
      while (!s.empty()) {
          int u = s.top();
          s.pop();
          order.push_back(u);
  
          // Traverse in original order by pushing in reverse
          for (auto it = adj[u].rbegin(); it != adj[u].rend(); ++it) {
              int v = *it;
              if (!visited[v]) {
                  visited[v] = true;
                  s.push(v);
              }
          }
      }
      return order;
  }
  `,
    typescript: `/**
   * Sequential Depth-First Search: traversal using stack.
   * Time: O(V + E), Space: O(V).
   */
  function dfs(adjList: number[][], startNode: number): number[] {
    const visited = new Set<number>([startNode]);
    const stack: number[] = [startNode];
    const order: number[] = [];
  
    while (stack.length > 0) {
      const node = stack.pop()!;
      order.push(node);
  
      const neighbors = adjList[node] || [];
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const neighbor = neighbors[i];
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          stack.push(neighbor);
        }
      }
    }
    return order;
  }
  `,
    java: `import java.util.*;
  
  public class DFS {
      /**
       * Sequential Depth-First Search: traversal using stack.
       * Time: O(V + E), Space: O(V).
       */
      public static List<Integer> dfs(List<List<Integer>> adj, int start) {
          List<Integer> order = new ArrayList<>();
          boolean[] visited = new boolean[adj.size()];
          Stack<Integer> s = new Stack<>();
  
          visited[start] = true;
          s.push(start);
  
          while (!s.isEmpty()) {
              int u = s.pop();
              order.add(u);
  
              List<Integer> neighbors = adj.get(u);
              for (int i = neighbors.size() - 1; i >= 0; i--) {
                  int v = neighbors.get(i);
                  if (!visited[v]) {
                      visited[v] = true;
                      s.push(v);
                  }
              }
          }
          return order;
      }
  }
  `,
  },
  astar: {
    python: `import heapq
  
  def astar(graph, source, goal, h):
      """
      A* Shortest Path search using heuristics.
      Time: O(E log V), Space: O(V).
      """
      g_score = {node: float('infinity') for node in graph}
      g_score[source] = 0
      
      f_score = {node: float('infinity') for node in graph}
      f_score[source] = h[source]
      
      open_set = [(f_score[source], source)] # min-heap
      parent = {}
      
      while open_set:
          _, current = heapq.heappop(open_set)
          
          if current == goal:
              path = []
              while current in parent:
                  path.append(current)
                  current = parent[current]
              path.append(source)
              return path[::-1] # Return shortest path
              
          for neighbor, weight in graph[current]:
              tentative_g = g_score[current] + weight
              if tentative_g < g_score[neighbor]:
                  parent[neighbor] = current
                  g_score[neighbor] = tentative_g
                  f_score[neighbor] = tentative_g + h[neighbor]
                  heapq.heappush(open_set, (f_score[neighbor], neighbor))
                  
      return []
  `,
    cpp: `#include <vector>
  #include <queue>
  #include <utility>
  #include <algorithm>
  
  const int INF = 1e9;
  
  /**
   * A* Shortest Path search using heuristics.
   * Time: O(E log V), Space: O(V).
   */
  std::vector<int> astar(const std::vector<std::vector<std::pair<int, int>>>& adj, 
                         int src, int goal, const std::vector<int>& h) {
      int n = adj.size();
      std::vector<int> g_score(n, INF);
      std::vector<int> f_score(n, INF);
      std::vector<int> parent(n, -1);
      
      // Priority queue storing pair of {fScore, node}
      std::priority_queue<std::pair<int, int>, 
                          std::vector<std::pair<int, int>>, 
                          std::greater<std::pair<int, int>>> open_set;
  
      g_score[src] = 0;
      f_score[src] = h[src];
      open_set.push({f_score[src], src});
  
      while (!open_set.empty()) {
          int u = open_set.top().second;
          open_set.pop();
  
          if (u == goal) {
              std::vector<int> path;
              int curr = goal;
              while (curr != -1) {
                  path.push_back(curr);
                  curr = parent[curr];
              }
              std::reverse(path.begin(), path.end());
              return path;
          }
  
          for (auto edge : adj[u]) {
              int v = edge.first;
              int weight = edge.second;
              int tentative_g = g_score[u] + weight;
              if (tentative_g < g_score[v]) {
                  parent[v] = u;
                  g_score[v] = tentative_g;
                  f_score[v] = tentative_g + h[v];
                  open_set.push({f_score[v], v});
              }
          }
      }
      return {};
  }
  `,
    typescript: `interface Edge {
    node: number;
    weight: number;
  }
  
  /**
   * A* Shortest Path search using heuristics.
   * Time: O(E log V), Space: O(V).
   */
  function astar(graph: Edge[][], source: number, goal: number, h: number[]): number[] {
    const gScore = Array(graph.length).fill(Infinity);
    const fScore = Array(graph.length).fill(Infinity);
    const parent = Array(graph.length).fill(-1);
    const visited = Array(graph.length).fill(false);
  
    gScore[source] = 0;
    fScore[source] = h[source];
  
    for (let i = 0; i < graph.length; i++) {
      let u = -1;
      let minF = Infinity;
      for (let v = 0; v < graph.length; v++) {
        if (!visited[v] && fScore[v] < minF) {
          minF = fScore[v];
          u = v;
        }
      }
  
      if (u === -1 || u === goal) break;
      visited[u] = true;
  
      for (const edge of graph[u]) {
        const v = edge.node;
        const tentativeG = gScore[u] + edge.weight;
        if (tentativeG < gScore[v]) {
          parent[v] = u;
          gScore[v] = tentativeG;
          fScore[v] = tentativeG + h[v];
        }
      }
    }
  
    const path: number[] = [];
    let curr = goal;
    while (curr !== -1) {
      path.push(curr);
      curr = parent[curr];
    }
    return path.reverse();
  }
  `,
    java: `import java.util.*;
  
  public class AStar {
      static class Edge {
          int node, weight;
          Edge(int node, int weight) { this.node = node; this.weight = weight; }
      }
  
      /**
       * A* Shortest Path search using heuristics.
       * Time: O(E log V), Space: O(V).
       */
      public static List<Integer> astar(List<List<Edge>> graph, int src, int goal, int[] h) {
          int n = graph.size();
          int[] gScore = new int[n];
          int[] fScore = new int[n];
          int[] parent = new int[n];
          Arrays.fill(gScore, Integer.MAX_VALUE);
          Arrays.fill(fScore, Integer.MAX_VALUE);
          Arrays.fill(parent, -1);
  
          gScore[src] = 0;
          fScore[src] = h[src];
  
          PriorityQueue<int[]> openSet = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));
          openSet.add(new int[]{src, fScore[src]});
  
          while (!openSet.isEmpty()) {
              int u = openSet.poll()[0];
  
              if (u == goal) {
                  List<Integer> path = new ArrayList<>();
                  int curr = goal;
                  while (curr != -1) {
                      path.add(curr);
                      curr = parent[curr];
                  }
                  Collections.reverse(path);
                  return path;
              }
  
              for (Edge edge : graph.get(u)) {
                  int v = edge.node;
                  int tentativeG = gScore[u] + edge.weight;
                  if (tentativeG < gScore[v]) {
                      parent[v] = u;
                      gScore[v] = tentativeG;
                      fScore[v] = tentativeG + h[v];
                      openSet.add(new int[]{v, fScore[v]});
                  }
              }
          }
          return new ArrayList<>();
      }
  }
  `,
  },
  prim: {
    python: `import heapq
  
  def prim_mst(graph, start=0):
      """
      Prim's Algorithm for Minimum Spanning Tree.
      Time: O(E log V), Space: O(V + E)
      """
      visited = set([start])
      mst = []
      edges = [(weight, start, to) for to, weight in graph[start]]
      heapq.heapify(edges)
      total_weight = 0
  
      while edges and len(visited) < len(graph):
          weight, u, v = heapq.heappop(edges)
          if v in visited:
              continue
          visited.add(v)
          mst.append((u, v, weight))
          total_weight += weight
  
          for next_node, w in graph[v]:
              if next_node not in visited:
                  heapq.heappush(edges, (w, v, next_node))
  
      return mst, total_weight
  `,
    cpp: `#include <vector>
  #include <queue>
  #include <tuple>
  
  using namespace std;
  
  // Prim's Algorithm for Minimum Spanning Tree
  pair<vector<tuple<int, int, int>>, int> primMST(int n, vector<vector<pair<int, int>>>& adj) {
      vector<bool> visited(n, false);
      priority_queue<tuple<int, int, int>, vector<tuple<int, int, int>>, greater<tuple<int, int, int>>> pq;
  
      visited[0] = true;
      for (auto& edge : adj[0]) {
          pq.push({edge.second, 0, edge.first});
      }
  
      vector<tuple<int, int, int>> mst;
      int totalWeight = 0;
  
      while (!pq.empty() && mst.size() < n - 1) {
          auto [weight, u, v] = pq.top();
          pq.pop();
  
          if (visited[v]) continue;
          visited[v] = true;
          mst.push_back({u, v, weight});
          totalWeight += weight;
  
          for (auto& edge : adj[v]) {
              if (!visited[edge.first]) {
                  pq.push({edge.second, v, edge.first});
              }
          }
      }
      return {mst, totalWeight};
  }
  `,
    typescript: `/**
   * Prim's Minimum Spanning Tree algorithm.
   * Time: O(E log V), Space: O(V + E)
   */
  export function primMST(n: number, adj: { node: number; weight: number }[][]): { mst: [number, number, number][]; totalWeight: number } {
    const visited = new Set<number>([0]);
    const mst: [number, number, number][] = [];
    let totalWeight = 0;
  
    const edges: { u: number; v: number; weight: number }[] = [];
    for (const edge of adj[0]) {
      edges.push({ u: 0, v: edge.node, weight: edge.weight });
    }
  
    while (edges.length > 0 && visited.size < n) {
      edges.sort((a, b) => a.weight - b.weight);
      const minEdge = edges.shift()!;
      const { u, v, weight } = minEdge;
  
      if (visited.has(v)) continue;
      visited.add(v);
      mst.push([u, v, weight]);
      totalWeight += weight;
  
      for (const nextEdge of adj[v]) {
        if (!visited.has(nextEdge.node)) {
          edges.push({ u: v, v: nextEdge.node, weight: nextEdge.weight });
        }
      }
    }
  
    return { mst, totalWeight };
  }
  `,
    java: `import java.util.*;
  
  public class PrimMST {
      static class Edge {
          int u, v, weight;
          Edge(int u, int v, int weight) {
              this.u = u; this.v = v; this.weight = weight;
          }
      }
  
      public static int prim(int n, List<List<int[]>> adj) {
          boolean[] visited = new boolean[n];
          PriorityQueue<Edge> pq = new PriorityQueue<>(Comparator.comparingInt(e -> e.weight));
          visited[0] = true;
  
          for (int[] edge : adj.get(0)) {
              pq.add(new Edge(0, edge[0], edge[1]));
          }
  
          int totalWeight = 0, edgesCount = 0;
          while (!pq.isEmpty() && edgesCount < n - 1) {
              Edge e = pq.poll();
              if (visited[e.v]) continue;
  
              visited[e.v] = true;
              totalWeight += e.weight;
              edgesCount++;
  
              for (int[] nextEdge : adj.get(e.v)) {
                  if (!visited[nextEdge[0]]) {
                      pq.add(new Edge(e.v, nextEdge[0], nextEdge[1]));
                  }
              }
          }
          return totalWeight;
      }
  }
  `,
  },
  kruskal: {
    python: `class UnionFind:
      def __init__(self, n):
          self.parent = list(range(n))
  
      def find(self, i):
          if self.parent[i] == i:
              return i
          self.parent[i] = self.find(self.parent[i])
          return self.parent[i]
  
      def union(self, i, j):
          root_i = self.find(i)
          root_j = self.find(j)
          if root_i != root_j:
              self.parent[root_i] = root_j
              return True
          return False
  
  def kruskal_mst(n, edges):
      """
      Kruskal's Algorithm for MST using Union-Find.
      Time: O(E log E), Space: O(V + E)
      """
      edges.sort(key=lambda x: x[2])  # sort by weight
      dsu = UnionFind(n)
      mst = []
      total_weight = 0
  
      for u, v, w in edges:
          if dsu.union(u, v):
              mst.append((u, v, w))
              total_weight += w
  
      return mst, total_weight
  `,
    cpp: `#include <vector>
  #include <algorithm>
  #include <numeric>
  
  using namespace std;
  
  struct Edge {
      int u, v, weight;
      bool operator<(const Edge& other) const {
          return weight < other.weight;
      }
  };
  
  class DSU {
      vector<int> parent;
  public:
      DSU(int n) {
          parent.resize(n);
          iota(parent.begin(), parent.end(), 0);
      }
      int find(int i) {
          if (parent[i] == i) return i;
          return parent[i] = find(parent[i]);
      }
      bool unite(int i, int j) {
          int rootI = find(i), rootJ = find(j);
          if (rootI != rootJ) {
              parent[rootI] = rootJ;
              return true;
          }
          return false;
      }
  };
  
  int kruskalMST(int n, vector<Edge>& edges) {
      sort(edges.begin(), edges.end());
      DSU dsu(n);
      int totalWeight = 0;
      for (const auto& e : edges) {
          if (dsu.unite(e.u, e.v)) {
              totalWeight += e.weight;
          }
      }
      return totalWeight;
  }
  `,
    typescript: `/**
   * Kruskal's Minimum Spanning Tree algorithm using Union-Find.
   * Time: O(E log E), Space: O(V + E)
   */
  export function kruskalMST(n: number, edges: { u: number; v: number; weight: number }[]): { mst: { u: number; v: number; weight: number }[]; totalWeight: number } {
    const parent = Array.from({ length: n }, (_, i) => i);
  
    const find = (i: number): number => {
      if (parent[i] === i) return i;
      parent[i] = find(parent[i]);
      return parent[i];
    };
  
    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
    const mst = [];
    let totalWeight = 0;
  
    for (const edge of sortedEdges) {
      const rootU = find(edge.u);
      const rootV = find(edge.v);
      if (rootU !== rootV) {
        parent[rootU] = rootV;
        mst.push(edge);
        totalWeight += edge.weight;
      }
    }
  
    return { mst, totalWeight };
  }
  `,
    java: `import java.util.*;
  
  public class KruskalMST {
      static class Edge implements Comparable<Edge> {
          int u, v, weight;
          Edge(int u, int v, int weight) { this.u = u; this.v = v; this.weight = weight; }
          public int compareTo(Edge o) { return Integer.compare(this.weight, o.weight); }
      }
  
      public static int kruskal(int n, List<Edge> edges) {
          Collections.sort(edges);
          int[] parent = new int[n];
          for (int i = 0; i < n; i++) parent[i] = i;
  
          int totalWeight = 0;
          for (Edge e : edges) {
              int rootU = find(parent, e.u);
              int rootV = find(parent, e.v);
              if (rootU != rootV) {
                  parent[rootU] = rootV;
                  totalWeight += e.weight;
              }
          }
          return totalWeight;
      }
  
      private static int find(int[] parent, int i) {
          if (parent[i] == i) return i;
          return parent[i] = find(parent, parent[i]);
      }
  }
  `,
  },
  timsort: {
    python: `RUN = 32
  
  def insertion_sort(arr, left, right):
      for i in range(left + 1, right + 1):
          key = arr[i]
          j = i - 1
          while j >= left and arr[j] > key:
              arr[j + 1] = arr[j]
              j -= 1
          arr[j + 1] = key
  
  def merge(arr, l, m, r):
      left = arr[l:m + 1]
      right = arr[m + 1:r + 1]
      i = j = 0
      k = l
      while i < len(left) and j < len(right):
          if left[i] <= right[j]:
              arr[k] = left[i]
              i += 1
          else:
              arr[k] = right[j]
              j += 1
          k += 1
      while i < len(left):
          arr[k] = left[i]
          i += 1; k += 1
      while j < len(right):
          arr[k] = right[j]
          j += 1; k += 1
  
  def timsort(arr):
      n = len(arr)
      for i in range(0, n, RUN):
          insertion_sort(arr, i, min(i + RUN - 1, n - 1))
  
      size = RUN
      while size < n:
          for left in range(0, n, 2 * size):
              mid = left + size - 1
              right = min(left + 2 * size - 1, n - 1)
              if mid < right:
                  merge(arr, left, mid, right)
          size *= 2
      return arr
  `,
    cpp: `#include <vector>
  #include <algorithm>
  
  using namespace std;
  
  const int RUN = 32;
  
  void insertionSort(vector<int>& arr, int left, int right) {
      for (int i = left + 1; i <= right; i++) {
          int temp = arr[i];
          int j = i - 1;
          while (j >= left && arr[j] > temp) {
              arr[j + 1] = arr[j];
              j--;
          }
          arr[j + 1] = temp;
      }
  }
  
  void merge(vector<int>& arr, int l, int m, int r) {
      vector<int> left(arr.begin() + l, arr.begin() + m + 1);
      vector<int> right(arr.begin() + m + 1, arr.begin() + r + 1);
  
      int i = 0, j = 0, k = l;
      while (i < left.size() && j < right.size()) {
          if (left[i] <= right[j]) arr[k++] = left[i++];
          else arr[k++] = right[j++];
      }
      while (i < left.size()) arr[k++] = left[i++];
      while (j < right.size()) arr[k++] = right[j++];
  }
  
  void timSort(vector<int>& arr) {
      int n = arr.size();
      for (int i = 0; i < n; i += RUN)
          insertionSort(arr, i, min(i + RUN - 1, n - 1));
  
      for (int size = RUN; size < n; size = 2 * size) {
          for (int left = 0; left < n; left += 2 * size) {
              int mid = left + size - 1;
              int right = min((left + 2 * size - 1), (n - 1));
              if (mid < right) merge(arr, left, mid, right);
          }
      }
  }
  `,
    typescript: `/**
   * Timsort hybrid sorting algorithm.
   * Time: O(N log N), Space: O(N)
   */
  export function timSort(arr: number[], RUN = 4): number[] {
    const n = arr.length;
    const result = [...arr];
  
    const insertionSort = (left: number, right: number) => {
      for (let i = left + 1; i <= right; i++) {
        const key = result[i];
        let j = i - 1;
        while (j >= left && result[j] > key) {
          result[j + 1] = result[j];
          j--;
        }
        result[j + 1] = key;
      }
    };
  
    const merge = (l: number, m: number, r: number) => {
      const leftArr = result.slice(l, m + 1);
      const rightArr = result.slice(m + 1, r + 1);
      let i = 0, j = 0, k = l;
      while (i < leftArr.length && j < rightArr.length) {
        if (leftArr[i] <= rightArr[j]) result[k++] = leftArr[i++];
        else result[k++] = rightArr[j++];
      }
      while (i < leftArr.length) result[k++] = leftArr[i++];
      while (j < rightArr.length) result[k++] = rightArr[j++];
    };
  
    for (let i = 0; i < n; i += RUN) {
      insertionSort(i, Math.min(i + RUN - 1, n - 1));
    }
  
    for (let size = RUN; size < n; size *= 2) {
      for (let left = 0; left < n; left += 2 * size) {
        const mid = left + size - 1;
        const right = Math.min(left + 2 * size - 1, n - 1);
        if (mid < right) merge(left, mid, right);
      }
    }
  
    return result;
  }
  `,
    java: `import java.util.*;
  
  public class Timsort {
      static final int RUN = 32;
  
      public static void timSort(int[] arr) {
          int n = arr.length;
          for (int i = 0; i < n; i += RUN) {
              insertionSort(arr, i, Math.min(i + RUN - 1, n - 1));
          }
  
          for (int size = RUN; size < n; size *= 2) {
              for (int left = 0; left < n; left += 2 * size) {
                  int mid = left + size - 1;
                  int right = Math.min((left + 2 * size - 1), (n - 1));
                  if (mid < right) merge(arr, left, mid, right);
              }
          }
      }
  
      private static void insertionSort(int[] arr, int left, int right) {
          for (int i = left + 1; i <= right; i++) {
              int temp = arr[i];
              int j = i - 1;
              while (j >= left && arr[j] > temp) {
                  arr[j + 1] = arr[j];
                  j--;
              }
              arr[j + 1] = temp;
          }
      }
  
      private static void merge(int[] arr, int l, int m, int r) {
          int[] left = Arrays.copyOfRange(arr, l, m + 1);
          int[] right = Arrays.copyOfRange(arr, m + 1, r + 1);
          int i = 0, j = 0, k = l;
          while (i < left.length && j < right.length) {
              if (left[i] <= right[j]) arr[k++] = left[i++];
              else arr[k++] = right[j++];
          }
          while (i < left.length) arr[k++] = left[i++];
          while (j < right.length) arr[k++] = right[j++];
      }
  }
  `,
  },
  greedy: {
    python: `class Item:
      def __init__(self, name, weight, value):
          self.name = name
          self.weight = weight
          self.value = value
          self.density = value / weight
  
  def fractional_knapsack(items, capacity):
      """
      Greedy Fractional Knapsack strategy.
      Time: O(N log N), Space: O(N)
      """
      # Sort items by value/weight density in descending order
      items.sort(key=lambda x: x.density, reverse=True)
  
      total_value = 0.0
      current_weight = 0.0
      selections = []
  
      for item in items:
          if current_weight + item.weight <= capacity:
              current_weight += item.weight
              total_value += item.value
              selections.append((item.name, 1.0))
          else:
              remaining = capacity - current_weight
              fraction = remaining / item.weight
              total_value += item.value * fraction
              selections.append((item.name, fraction))
              break
  
      return total_value, selections
  `,
    cpp: `#include <vector>
  #include <string>
  #include <algorithm>
  
  using namespace std;
  
  struct Item {
      string name;
      double weight;
      double value;
      double density() const { return value / weight; }
  };
  
  double fractionalKnapsack(vector<Item>& items, double capacity) {
      sort(items.begin(), items.end(), [](const Item& a, const Item& b) {
          return a.density() > b.density();
      });
  
      double totalValue = 0.0;
      double currentWeight = 0.0;
  
      for (const auto& item : items) {
          if (currentWeight + item.weight <= capacity) {
              currentWeight += item.weight;
              totalValue += item.value;
          } else {
              double remaining = capacity - currentWeight;
              totalValue += item.value * (remaining / item.weight);
              break;
          }
      }
      return totalValue;
  }
  `,
    typescript: `interface KnapsackItem {
    name: string;
    weight: number;
    value: number;
  }
  
  /**
   * Fractional Knapsack using Greedy Density Choice.
   * Time: O(N log N), Space: O(N)
   */
  export function fractionalKnapsack(items: KnapsackItem[], capacity: number): { totalValue: number; taken: { name: string; fraction: number }[] } {
    const sorted = items
      .map(i => ({ ...i, density: i.value / i.weight }))
      .sort((a, b) => b.density - a.density);
  
    let totalValue = 0;
    let currentWeight = 0;
    const taken: { name: string; fraction: number }[] = [];
  
    for (const item of sorted) {
      if (currentWeight + item.weight <= capacity) {
        currentWeight += item.weight;
        totalValue += item.value;
        taken.push({ name: item.name, fraction: 1.0 });
      } else {
        const remaining = capacity - currentWeight;
        const fraction = remaining / item.weight;
        totalValue += item.value * fraction;
        taken.push({ name: item.name, fraction });
        break;
      }
    }
  
    return { totalValue, taken };
  }
  `,
    java: `import java.util.*;
  
  public class FractionalKnapsack {
      static class Item {
          String name;
          double weight, value, density;
          Item(String name, double weight, double value) {
              this.name = name; this.weight = weight; this.value = value;
              this.density = value / weight;
          }
      }
  
      public static double getMaxValue(List<Item> items, double capacity) {
          items.sort((a, b) -> Double.compare(b.density, a.density));
  
          double totalValue = 0.0;
          double currentWeight = 0.0;
  
          for (Item item : items) {
              if (currentWeight + item.weight <= capacity) {
                  currentWeight += item.weight;
                  totalValue += item.value;
              } else {
                  double remaining = capacity - currentWeight;
                  totalValue += item.value * (remaining / item.weight);
                  break;
              }
          }
          return totalValue;
      }
  }
  `,
  },
};
