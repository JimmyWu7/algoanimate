def bubble_sort(arr):
    n = len(arr)
    print(n)

    for i in range(n):
        # Last i elements are already in the correct position
        for j in range(0, n - i - 1):
            # print("Comparing:", arr[j], "and", arr[j + 1])
            if arr[j] > arr[j + 1]:
                # Swap adjacent elements
                arr[j], arr[j + 1] = arr[j + 1], arr[j]

    return arr


numbers = [42, 7, 23, 7, 91, 15, 64, 3, 38]
# print(bubble_sort(numbers))


def selection_sort(arr):
    n = len(arr)

    for i in range(n):
        min_index = i

        # Find the smallest element in the remaining array
        for j in range(i + 1, n):
            if arr[j] < arr[min_index]:
                min_index = j

        # Swap into the correct position
        arr[i], arr[min_index] = arr[min_index], arr[i]

    return arr


numbers = [42, 7, 23, 7, 91, 15, 64, 3, 38]
# print(selection_sort(numbers))


def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1

        # Shift larger elements one position to the right
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1

        # Insert the key into its correct position
        arr[j + 1] = key

    return arr


numbers = [42, 7, 23, 7, 91, 15, 64, 3, 38]
# print(insertion_sort(numbers))


def mergesort(arr):
    print("Entry Arr", arr)
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    # print("Mid", mid)x
    left = arr[:mid]
    # print("Left", left)
    right = arr[mid:]
    left = mergesort(left)
    right = mergesort(right)

    return merge(left, right)


def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    print("Result:", result)
    print("\n")
    return result


print(mergesort([42, 7, 23, 7, 91, 15, 64, 3, 38]))


def quicksort(arr):
    print("Array:", arr)
    if len(arr) <= 1:
        print("Base case reached")
        return arr
    pivot = arr[len(arr) // 2]
    print("Pivot:", pivot)
    left = [x for x in arr if x < pivot]
    print("Left:", left)
    middle = [x for x in arr if x == pivot]
    print("Middle:", middle)
    right = [x for x in arr if x > pivot]
    print("Right:", right)
    print("--------------------------------")
    return quicksort(left) + middle + quicksort(right)


# print(quicksort([42, 7, 23, 7, 91, 15, 64, 3, 38]))


def binary_search(arr, target):
    left = 0
    right = len(arr) - 1

    while left <= right:
        mid = (left + right) // 2

        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1


numbers = [3, 7, 7, 15, 23, 38, 42, 64, 91]

target = 38
index = binary_search(numbers, target)

# if index != -1:
#     print(f"Found {target} at index {index}")
# else:
#     print(f"{target} not found")

