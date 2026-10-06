/**
 * Comprehensive Practice Problem Bank
 * 16 Diverse Coding & Data Structure Challenges across multiple categories and difficulty tiers
 */

export const PRACTICE_PROBLEM_BANK = [
  // 1. Two Sum
  {
    id: 'two-sum',
    title: 'Two Sum Target Pair Finder',
    category: 'Arrays & Hashing',
    difficulty: 'Easy',
    xp: 100,
    accuracy: '89.4%',
    solvedCount: '12.4K',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    inputFormat: 'First line contains array `nums`. Second line contains integer `target`.',
    outputFormat: 'Return an array of two indices [index1, index2].',
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Time Complexity Target: O(N)',
      'Space Complexity Target: O(N)'
    ],
    sampleTestCases: [
      { id: 1, input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]', explanation: 'nums[0] + nums[1] == 2 + 7 == 9' },
      { id: 2, input: 'nums = [3, 2, 4], target = 6', output: '[1, 2]', explanation: 'nums[1] + nums[2] == 2 + 4 == 6' }
    ],
    hiddenTestCases: [
      { id: 3, input: 'nums = [3, 3], target = 6', expected: '[0, 1]', type: 'Duplicate Values' },
      { id: 4, input: 'nums = [-1, -8, 10, 5], target = 2', expected: '[2, 0]', type: 'Negative Integers' },
      { id: 5, input: 'nums = [0, 4, 3, 0], target = 0', expected: '[0, 3]', type: 'Zero Pair Target' }
    ],
    hint: 'Use a Hash Map / Object to store each number\'s index and check if complement (target - num) exists in O(1) time.',
    boilerplates: {
      js: `// Function Signature: twoSum(nums, target)\nfunction twoSum(nums, target) {\n  // TODO: Write your code here\n  return [];\n}`,
      python: `def two_sum(nums: list[int], target: int) -> list[int]:\n    # TODO: Write your code here\n    pass`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // TODO: Write your code here\n    return {};\n}`,
      c: `#include <stdlib.h>\n\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    *returnSize = 0;\n    return NULL;\n}`,
      java: `public class Solution {\n    public static int[] twoSum(int[] nums, int target) {\n        return new int[]{};\n    }\n}`
    },
    validate: (clean) => clean.includes('for') || clean.includes('map') || clean.includes('hash') || clean.includes('dict') || clean.includes('target -') || clean.includes('target-')
  },

  // 2. Valid Palindrome
  {
    id: 'valid-palindrome',
    title: 'Valid Palindrome & String Sanitization',
    category: 'Strings & Two Pointers',
    difficulty: 'Easy',
    xp: 100,
    accuracy: '91.2%',
    solvedCount: '15.1K',
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
    inputFormat: 'Single line containing string `s`.',
    outputFormat: 'Return boolean `true` or `false`.',
    constraints: [
      '1 <= s.length <= 2 * 10^5',
      's consists only of printable ASCII characters.',
      'Time Complexity Target: O(N)',
      'Space Complexity Target: O(1)'
    ],
    sampleTestCases: [
      { id: 1, input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { id: 2, input: 's = "race a car"', output: 'false', explanation: '"raceacar" is not a palindrome.' }
    ],
    hiddenTestCases: [
      { id: 3, input: 's = "0P"', expected: 'false', type: 'Non-Alphanumeric Boundary' },
      { id: 4, input: 's = "a."', expected: 'true', type: 'Single Character' }
    ],
    hint: 'Sanitize string using regex `/[^a-z0-9]/gi` or use two pointers stepping inwards while skipping non-alphanumeric characters.',
    boilerplates: {
      js: `function isPalindrome(s) {\n  // TODO: Write your code here\n  return false;\n}`,
      python: `def is_palindrome(s: str) -> bool:\n    # TODO: Write your code here\n    pass`,
      cpp: `#include <string>\nusing namespace std;\n\nbool isPalindrome(string s) {\n    return false;\n}`,
      c: `#include <stdbool.h>\n\nbool isPalindrome(char* s) {\n    return false;\n}`,
      java: `public class Solution {\n    public static boolean isPalindrome(String s) {\n        return false;\n    }\n}`
    },
    validate: (clean) => clean.includes('replace') || clean.includes('reverse') || clean.includes('isalnum') || clean.includes('tolower') || clean.includes('while') || clean.includes('for') || clean.includes('[::-1]')
  },

  // 3. Binary Search
  {
    id: 'binary-search',
    title: 'Binary Search in Sorted Array',
    category: 'Binary Search',
    difficulty: 'Easy',
    xp: 100,
    accuracy: '88.1%',
    solvedCount: '11.8K',
    description: 'Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return -1. You must write an algorithm with O(log n) runtime complexity.',
    inputFormat: 'First line contains sorted array `nums`. Second line contains integer `target`.',
    outputFormat: 'Return integer index or -1.',
    constraints: [
      '1 <= nums.length <= 10^4',
      '-10^4 < nums[i], target < 10^4',
      'All integers in nums are unique.',
      'nums is sorted in ascending order.'
    ],
    sampleTestCases: [
      { id: 1, input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 exists in nums and its index is 4' },
      { id: 2, input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explanation: '2 does not exist in nums so return -1' }
    ],
    hiddenTestCases: [
      { id: 3, input: 'nums = [5], target = 5', expected: '0', type: 'Single Element Found' },
      { id: 4, input: 'nums = [2, 5], target = 0', expected: '-1', type: 'Target Outside Range' }
    ],
    hint: 'Initialize low = 0 and high = nums.length - 1. Calculate mid = low + Math.floor((high - low) / 2) to prevent overflow.',
    boilerplates: {
      js: `function search(nums, target) {\n  // TODO: Implement O(log N) binary search\n  return -1;\n}`,
      python: `def search(nums: list[int], target: int) -> int:\n    # TODO: Implement binary search\n    pass`,
      cpp: `#include <vector>\nusing namespace std;\n\nint search(vector<int>& nums, int target) {\n    return -1;\n}`,
      c: `int search(int* nums, int numsSize, int target) {\n    return -1;\n}`,
      java: `public class Solution {\n    public static int search(int[] nums, int target) {\n        return -1;\n    }\n}`
    },
    validate: (clean) => (clean.includes('mid') || clean.includes('low') || clean.includes('high') || clean.includes('left') || clean.includes('right')) && (clean.includes('while') || clean.includes('search'))
  },

  // 4. Valid Parentheses
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses & Bracket Matching',
    category: 'Stacks & Queues',
    difficulty: 'Easy',
    xp: 100,
    accuracy: '86.7%',
    solvedCount: '14.2K',
    description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid. Open brackets must be closed by the same type of brackets, and open brackets must be closed in the correct order.',
    inputFormat: 'Single string `s` of bracket characters.',
    outputFormat: 'Return boolean `true` or `false`.',
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.'
    ],
    sampleTestCases: [
      { id: 1, input: 's = "()"', output: 'true', explanation: 'Single matched pair' },
      { id: 2, input: 's = "()[]{}"', output: 'true', explanation: 'Multiple adjacent matching pairs' },
      { id: 3, input: 's = "(]"', output: 'false', explanation: 'Mismatched closing bracket' }
    ],
    hiddenTestCases: [
      { id: 4, input: 's = "([)]"', expected: 'false', type: 'Interleaved Brackets' },
      { id: 5, input: 's = "{[]}"', expected: 'true', type: 'Nested Brackets' }
    ],
    hint: 'Use a Stack LIFO data structure. Push open brackets or match the top element with corresponding closing bracket.',
    boilerplates: {
      js: `function isValid(s) {\n  // TODO: Use stack data structure\n  return false;\n}`,
      python: `def is_valid(s: str) -> bool:\n    # TODO: Use stack\n    pass`,
      cpp: `#include <string>\n#include <stack>\nusing namespace std;\n\nbool isValid(string s) {\n    return false;\n}`,
      c: `#include <stdbool.h>\n\nbool isValid(char* s) {\n    return false;\n}`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static boolean isValid(String s) {\n        return false;\n    }\n}`
    },
    validate: (clean) => clean.includes('stack') || clean.includes('push') || clean.includes('pop') || clean.includes('length === 0') || clean.includes('len(')
  },

  // 5. Best Time to Buy and Sell Stock
  {
    id: 'best-time-stock',
    title: 'Best Time to Buy and Sell Stock',
    category: 'Arrays & Sliding Window',
    difficulty: 'Easy',
    xp: 120,
    accuracy: '84.2%',
    solvedCount: '13.1K',
    description: 'You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`-th day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve.',
    inputFormat: 'Array of integer stock prices.',
    outputFormat: 'Return max integer profit.',
    constraints: [
      '1 <= prices.length <= 10^5',
      '0 <= prices[i] <= 10^4'
    ],
    sampleTestCases: [
      { id: 1, input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.' },
      { id: 2, input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'No transactions are done and max profit = 0.' }
    ],
    hiddenTestCases: [
      { id: 3, input: 'prices = [2, 4, 1]', expected: '2', type: 'Minimum after Peak' },
      { id: 4, input: 'prices = [1, 2]', expected: '1', type: 'Simple Ascending' }
    ],
    hint: 'Track the `minPrice` seen so far and calculate `profit = currentPrice - minPrice` on each step.',
    boilerplates: {
      js: `function maxProfit(prices) {\n  // TODO: Write your code here\n  return 0;\n}`,
      python: `def max_profit(prices: list[int]) -> int:\n    pass`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint maxProfit(vector<int>& prices) {\n    return 0;\n}`,
      c: `int maxProfit(int* prices, int pricesSize) {\n    return 0;\n}`,
      java: `public class Solution {\n    public static int maxProfit(int[] prices) {\n        return 0;\n    }\n}`
    },
    validate: (clean) => (clean.includes('min') || clean.includes('profit') || clean.includes('max')) && (clean.includes('for') || clean.includes('while'))
  },

  // 6. Reverse Linked List
  {
    id: 'reverse-linked-list',
    title: 'Reverse Singly Linked List',
    category: 'Linked Lists',
    difficulty: 'Easy',
    xp: 120,
    accuracy: '81.9%',
    solvedCount: '10.5K',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list head node. Optimize for O(N) time and O(1) space complexity.',
    inputFormat: 'Linked list head values: [1,2,3,4,5].',
    outputFormat: 'Return reversed linked list: [5,4,3,2,1].',
    constraints: [
      'The number of nodes in the list is the range [0, 5000].',
      '-5000 <= Node.val <= 5000'
    ],
    sampleTestCases: [
      { id: 1, input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]', explanation: 'Pointers reversed sequentially.' },
      { id: 2, input: 'head = [1,2]', output: '[2,1]', explanation: 'Two nodes reversed.' }
    ],
    hiddenTestCases: [
      { id: 3, input: 'head = []', expected: '[]', type: 'Empty Linked List' },
      { id: 4, input: 'head = [7]', expected: '[7]', type: 'Single Node' }
    ],
    hint: 'Use three pointers: `prev = null`, `curr = head`, and `next = curr.next`. Reassign `curr.next = prev` iteratively.',
    boilerplates: {
      js: `function reverseList(head) {\n  let prev = null;\n  let curr = head;\n  // TODO: Iterate and reverse next pointers\n  return prev;\n}`,
      python: `def reverse_list(head):\n    prev = None\n    curr = head\n    # TODO: Reverse pointers\n    return prev`,
      cpp: `ListNode* reverseList(ListNode* head) {\n    ListNode* prev = nullptr;\n    ListNode* curr = head;\n    return prev;\n}`,
      c: `struct ListNode* reverseList(struct ListNode* head) {\n    struct ListNode* prev = NULL;\n    return prev;\n}`,
      java: `public class Solution {\n    public ListNode reverseList(ListNode head) {\n        ListNode prev = null;\n        return prev;\n    }\n}`
    },
    validate: (clean) => clean.includes('prev') && clean.includes('next') && clean.includes('curr')
  },

  // 7. Fibonacci DP
  {
    id: 'fibonacci-dp',
    title: 'Fibonacci Dynamic Programming',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    xp: 150,
    accuracy: '78.5%',
    solvedCount: '8.7K',
    description: 'Calculate the N-th Fibonacci number F(n) where F(0) = 0, F(1) = 1, and F(n) = F(n-1) + F(n-2). Optimize for O(N) time and O(1) auxiliary space.',
    inputFormat: 'Integer `n`.',
    outputFormat: 'Return integer `F(n)`.',
    constraints: [
      '0 <= n <= 45',
      'Time Complexity Target: O(N)',
      'Space Complexity Target: O(1)'
    ],
    sampleTestCases: [
      { id: 1, input: 'n = 5', output: '5', explanation: 'F(5) = 5' },
      { id: 2, input: 'n = 10', output: '55', explanation: 'F(10) = 55' }
    ],
    hiddenTestCases: [
      { id: 3, input: 'n = 0', expected: '0', type: 'Base Case Zero' },
      { id: 4, input: 'n = 20', expected: '6765', type: 'Large Value Test' }
    ],
    hint: 'Use two variables (prev, curr) to compute bottom-up instead of exponential recursive calls.',
    boilerplates: {
      js: `function fib(n) {\n  // TODO: Write bottom-up DP\n  return 0;\n}`,
      python: `def fib(n: int) -> int:\n    pass`,
      cpp: `int fib(int n) {\n    return 0;\n}`,
      c: `int fib(int n) {\n    return 0;\n}`,
      java: `public class Solution {\n    public static int fib(int n) {\n        return 0;\n    }\n}`
    },
    validate: (clean) => clean.includes('for') || clean.includes('while') || clean.includes('fib(') || clean.includes('range') || clean.includes('prev')
  },

  // 8. Longest Substring Without Repeating Characters
  {
    id: 'longest-substring',
    title: 'Longest Substring Without Repeating Characters',
    category: 'Sliding Window',
    difficulty: 'Medium',
    xp: 150,
    accuracy: '72.1%',
    solvedCount: '6.4K',
    description: 'Given a string `s`, find the length of the longest substring without repeating characters.',
    inputFormat: 'Single line string `s`.',
    outputFormat: 'Return integer length.',
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.',
      'Time Complexity Target: O(N)'
    ],
    sampleTestCases: [
      { id: 1, input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { id: 2, input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' }
    ],
    hiddenTestCases: [
      { id: 3, input: 's = "pwwkew"', expected: '3', type: 'Subsequence vs Substring' },
      { id: 4, input: 's = ""', expected: '0', type: 'Empty String' }
    ],
    hint: 'Use a Sliding Window with a Set or Map storing the latest index of each character.',
    boilerplates: {
      js: `function lengthOfLongestSubstring(s) {\n  // TODO: Sliding window algorithm\n  return 0;\n}`,
      python: `def length_of_longest_substring(s: str) -> int:\n    pass`,
      cpp: `#include <string>\nusing namespace std;\n\nint lengthOfLongestSubstring(string s) {\n    return 0;\n}`,
      c: `int lengthOfLongestSubstring(char* s) {\n    return 0;\n}`,
      java: `public class Solution {\n    public static int lengthOfLongestSubstring(String s) {\n        return 0;\n    }\n}`
    },
    validate: (clean) => clean.includes('set') || clean.includes('map') || clean.includes('freq') || clean.includes('max') || clean.includes('window') || clean.includes('while')
  },

  // 9. Container With Most Water
  {
    id: 'container-water',
    title: 'Container With Most Water',
    category: 'Two Pointers',
    difficulty: 'Medium',
    xp: 160,
    accuracy: '74.8%',
    solvedCount: '7.9K',
    description: 'You are given an integer array `height` of length `n`. Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.',
    inputFormat: 'Array of positive heights: [1,8,6,2,5,4,8,3,7].',
    outputFormat: 'Return max integer area.',
    constraints: [
      'n == height.length',
      '2 <= n <= 10^5',
      '0 <= height[i] <= 10^4'
    ],
    sampleTestCases: [
      { id: 1, input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'Max area is between index 1 and index 8: min(8, 7) * (8 - 1) = 49' },
      { id: 2, input: 'height = [1,1]', output: '1', explanation: '1 * 1 = 1' }
    ],
    hiddenTestCases: [
      { id: 3, input: 'height = [4,3,2,1,4]', expected: '16', type: 'Symmetric Boundary' },
      { id: 4, input: 'height = [1,2,1]', expected: '2', type: 'Short Container' }
    ],
    hint: 'Use two pointers from left = 0 and right = n - 1. Calculate area and increment/decrement pointer pointing to the shorter line.',
    boilerplates: {
      js: `function maxArea(height) {\n  let left = 0, right = height.length - 1;\n  // TODO: Two pointers maximum area\n  return 0;\n}`,
      python: `def max_area(height: list[int]) -> int:\n    pass`,
      cpp: `#include <vector>\nusing namespace std;\n\nint maxArea(vector<int>& height) {\n    return 0;\n}`,
      c: `int maxArea(int* height, int heightSize) {\n    return 0;\n}`,
      java: `public class Solution {\n    public static int maxArea(int[] height) {\n        return 0;\n    }\n}`
    },
    validate: (clean) => clean.includes('left') && clean.includes('right') && (clean.includes('min') || clean.includes('max'))
  },

  // 10. Maximum Subarray (Kadane's Algorithm)
  {
    id: 'max-subarray',
    title: 'Maximum Subarray (Kadane\'s Algorithm)',
    category: 'Dynamic Programming & Arrays',
    difficulty: 'Medium',
    xp: 150,
    accuracy: '76.3%',
    solvedCount: '9.2K',
    description: 'Given an integer array `nums`, find the subarray with the largest sum, and return its sum. Must run in O(N) linear time.',
    inputFormat: 'Array of integers `nums`.',
    outputFormat: 'Return maximum sum integer.',
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    sampleTestCases: [
      { id: 1, input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { id: 2, input: 'nums = [1]', output: '1', explanation: 'Single element subarray' }
    ],
    hiddenTestCases: [
      { id: 3, input: 'nums = [5,4,-1,7,8]', expected: '23', type: 'All Positive Elements' },
      { id: 4, input: 'nums = [-1, -2, -3]', expected: '-1', type: 'All Negative Elements' }
    ],
    hint: 'Kadane\'s Algorithm: currentSum = max(num, currentSum + num), maxSum = max(maxSum, currentSum).',
    boilerplates: {
      js: `function maxSubArray(nums) {\n  // TODO: Kadane's algorithm\n  return 0;\n}`,
      python: `def max_sub_array(nums: list[int]) -> int:\n    pass`,
      cpp: `#include <vector>\nusing namespace std;\n\nint maxSubArray(vector<int>& nums) {\n    return 0;\n}`,
      c: `int maxSubArray(int* nums, int numsSize) {\n    return 0;\n}`,
      java: `public class Solution {\n    public static int maxSubArray(int[] nums) {\n        return 0;\n    }\n}`
    },
    validate: (clean) => (clean.includes('sum') || clean.includes('current') || clean.includes('max')) && (clean.includes('for') || clean.includes('while'))
  },

  // 11. Climbing Stairs
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs DP Combinations',
    category: 'Dynamic Programming',
    difficulty: 'Easy',
    xp: 110,
    accuracy: '87.4%',
    solvedCount: '13.8K',
    description: 'You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    inputFormat: 'Integer number of steps `n`.',
    outputFormat: 'Return distinct combinations count integer.',
    constraints: [
      '1 <= n <= 45'
    ],
    sampleTestCases: [
      { id: 1, input: 'n = 2', output: '2', explanation: '1 step + 1 step, or 2 steps' },
      { id: 2, input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, 2+1' }
    ],
    hiddenTestCases: [
      { id: 3, input: 'n = 4', expected: '5', type: 'Four Steps' },
      { id: 4, input: 'n = 5', expected: '8', type: 'Five Steps' }
    ],
    hint: 'ways(n) = ways(n - 1) + ways(n - 2). Matches the Fibonacci sequence with ways(1)=1, ways(2)=2.',
    boilerplates: {
      js: `function climbStairs(n) {\n  // TODO: Dynamic programming solution\n  return 0;\n}`,
      python: `def climb_stairs(n: int) -> int:\n    pass`,
      cpp: `int climbStairs(int n) {\n    return 0;\n}`,
      c: `int climbStairs(int n) {\n    return 0;\n}`,
      java: `public class Solution {\n    public static int climbStairs(int n) {\n        return 0;\n    }\n}`
    },
    validate: (clean) => clean.includes('for') || clean.includes('while') || clean.includes('climb') || clean.includes('dp') || clean.includes('prev')
  },

  // 12. Invert Binary Tree
  {
    id: 'invert-binary-tree',
    title: 'Invert Binary Tree (Mirroring)',
    category: 'Trees & Recursion',
    difficulty: 'Easy',
    xp: 120,
    accuracy: '85.9%',
    solvedCount: '11.1K',
    description: 'Given the root of a binary tree, invert the tree (swap left and right child at every node), and return its root.',
    inputFormat: 'Binary tree root nodes: [4,2,7,1,3,6,9].',
    outputFormat: 'Return inverted binary tree root: [4,7,2,9,6,3,1].',
    constraints: [
      'The number of nodes in the tree is in the range [0, 100].',
      '-100 <= Node.val <= 100'
    ],
    sampleTestCases: [
      { id: 1, input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]', explanation: 'Subtrees recursively swapped.' }
    ],
    hiddenTestCases: [
      { id: 2, input: 'root = []', expected: '[]', type: 'Null Root' },
      { id: 3, input: 'root = [2,1,3]', expected: '[2,3,1]', type: 'Simple 3-Node Tree' }
    ],
    hint: 'Use DFS or BFS. At each node, swap left and right pointers: [root.left, root.right] = [invertTree(root.right), invertTree(root.left)].',
    boilerplates: {
      js: `function invertTree(root) {\n  if (!root) return null;\n  // TODO: Swap left and right subtrees\n  return root;\n}`,
      python: `def invert_tree(root):\n    if not root:\n        return None\n    # TODO: Swap left and right\n    return root`,
      cpp: `TreeNode* invertTree(TreeNode* root) {\n    if (!root) return nullptr;\n    return root;\n}`,
      c: `struct TreeNode* invertTree(struct TreeNode* root) {\n    if (!root) return NULL;\n    return root;\n}`,
      java: `public class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        return root;\n    }\n}`
    },
    validate: (clean) => clean.includes('left') && clean.includes('right') && (clean.includes('invert') || clean.includes('temp') || clean.includes('swap'))
  },

  // 13. Valid Anagram
  {
    id: 'valid-anagram',
    title: 'Valid Anagram Frequency Checker',
    category: 'Strings & Hash Table',
    difficulty: 'Easy',
    xp: 100,
    accuracy: '92.3%',
    solvedCount: '16.2K',
    description: 'Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise. An Anagram is a word formed by rearranging the letters of a different word.',
    inputFormat: 'Two strings `s` and `t`.',
    outputFormat: 'Return boolean `true` or `false`.',
    constraints: [
      '1 <= s.length, t.length <= 5 * 10^4',
      's and t consist of lowercase English letters.'
    ],
    sampleTestCases: [
      { id: 1, input: 's = "anagram", t = "nagaram"', output: 'true', explanation: 'All characters match frequency.' },
      { id: 2, input: 's = "rat", t = "car"', output: 'false', explanation: 'Characters differ.' }
    ],
    hiddenTestCases: [
      { id: 3, input: 's = "a", t = "ab"', expected: 'false', type: 'Different Lengths' },
      { id: 4, input: 's = "aacc", t = "ccac"', expected: 'false', type: 'Frequency Mismatch' }
    ],
    hint: 'Count frequencies in an array of size 26 or compare sorted representations of both strings.',
    boilerplates: {
      js: `function isAnagram(s, t) {\n  // TODO: Frequency counter or sort\n  return false;\n}`,
      python: `def is_anagram(s: str, t: str) -> bool:\n    pass`,
      cpp: `#include <string>\nusing namespace std;\n\nbool isAnagram(string s, string t) {\n    return false;\n}`,
      c: `#include <stdbool.h>\n\nbool isAnagram(char* s, char* t) {\n    return false;\n}`,
      java: `public class Solution {\n    public static boolean isAnagram(String s, String t) {\n        return false;\n    }\n}`
    },
    validate: (clean) => clean.includes('sort') || clean.includes('split') || clean.includes('map') || clean.includes('count') || clean.includes('charCodeAt') || clean.includes('freq')
  },

  // 14. 3Sum Target Triplet Search
  {
    id: 'three-sum',
    title: '3Sum Zero Triplet Search',
    category: 'Arrays & Two Pointers',
    difficulty: 'Medium',
    xp: 180,
    accuracy: '68.9%',
    solvedCount: '5.9K',
    description: 'Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`. Notice that the solution set must not contain duplicate triplets.',
    inputFormat: 'Array of integers `nums`.',
    outputFormat: 'Return array of triplet arrays.',
    constraints: [
      '3 <= nums.length <= 3000',
      '-10^5 <= nums[i] <= 10^5'
    ],
    sampleTestCases: [
      { id: 1, input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]', explanation: 'Unique triplets adding to zero' },
      { id: 2, input: 'nums = [0,1,1]', output: '[]', explanation: 'No zero sum exists' }
    ],
    hiddenTestCases: [
      { id: 3, input: 'nums = [0,0,0]', expected: '[[0,0,0]]', type: 'All Zeros' },
      { id: 4, input: 'nums = [-2,0,1,1,2]', expected: '[[-2,0,2],[-2,1,1]]', type: 'Multiple Unique Pairs' }
    ],
    hint: 'Sort array first. Fix first element `nums[i]`, then use two pointers `left` and `right` to find pairs matching `-nums[i]`. Skip duplicate values.',
    boilerplates: {
      js: `function threeSum(nums) {\n  nums.sort((a, b) => a - b);\n  // TODO: Two pointers search for triplets\n  return [];\n}`,
      python: `def three_sum(nums: list[int]) -> list[list[int]]:\n    nums.sort()\n    pass`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<vector<int>> threeSum(vector<int>& nums) {\n    return {};\n}`,
      c: `int** threeSum(int* nums, int numsSize, int* returnSize, int** returnColumnSizes) {\n    *returnSize = 0;\n    return NULL;\n}`,
      java: `import java.util.*;\n\npublic class Solution {\n    public static List<List<Integer>> threeSum(int[] nums) {\n        return new ArrayList<>();\n    }\n}`
    },
    validate: (clean) => clean.includes('sort') && clean.includes('left') && clean.includes('right')
  },

  // 15. Coin Change DP
  {
    id: 'coin-change',
    title: 'Coin Change Minimum Coins Problem',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    xp: 170,
    accuracy: '66.4%',
    solvedCount: '5.2K',
    description: 'You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up, return -1.',
    inputFormat: 'First line: coins array. Second line: target amount.',
    outputFormat: 'Return minimum coins count or -1.',
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4'
    ],
    sampleTestCases: [
      { id: 1, input: 'coins = [1,2,5], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1 (3 coins)' },
      { id: 2, input: 'coins = [2], amount = 3', output: '-1', explanation: '3 cannot be formed using coin 2' }
    ],
    hiddenTestCases: [
      { id: 3, input: 'coins = [1], amount = 0', expected: '0', type: 'Zero Amount' },
      { id: 4, input: 'coins = [2, 5, 10], amount = 15', expected: '2', type: '10 + 5' }
    ],
    hint: 'Initialize dp array of size amount + 1 with Infinity. dp[0] = 0. For each coin, dp[i] = min(dp[i], dp[i - coin] + 1).',
    boilerplates: {
      js: `function coinChange(coins, amount) {\n  // TODO: Bottom-up DP table\n  return -1;\n}`,
      python: `def coin_change(coins: list[int], amount: int) -> int:\n    pass`,
      cpp: `#include <vector>\nusing namespace std;\n\nint coinChange(vector<int>& coins, int amount) {\n    return -1;\n}`,
      c: `int coinChange(int* coins, int coinsSize, int amount) {\n    return -1;\n}`,
      java: `public class Solution {\n    public static int coinChange(int[] coins, int amount) {\n        return -1;\n    }\n}`
    },
    validate: (clean) => clean.includes('dp') || clean.includes('coin') || clean.includes('min') || clean.includes('amount')
  },

  // 16. Product of Array Except Self
  {
    id: 'product-except-self',
    title: 'Product of Array Except Self',
    category: 'Arrays & Prefix Products',
    difficulty: 'Medium',
    xp: 160,
    accuracy: '75.1%',
    solvedCount: '7.8K',
    description: 'Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`. Must run in O(N) time without using the division operation.',
    inputFormat: 'Array of integers `nums`.',
    outputFormat: 'Return array of prefix/suffix products.',
    constraints: [
      '2 <= nums.length <= 10^5',
      '-30 <= nums[i] <= 30'
    ],
    sampleTestCases: [
      { id: 1, input: 'nums = [1,2,3,4]', output: '[24,12,8,6]', explanation: 'Product of all except self' },
      { id: 2, input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]', explanation: 'Zero element handling' }
    ],
    hiddenTestCases: [
      { id: 3, input: 'nums = [2, 3]', expected: '[3, 2]', type: 'Two Elements' },
      { id: 4, input: 'nums = [0, 0]', expected: '[0, 0]', type: 'Multiple Zeros' }
    ],
    hint: 'Compute prefix products in a first pass, then iterate backwards computing suffix products and multiplying in-place.',
    boilerplates: {
      js: `function productExceptSelf(nums) {\n  // TODO: Prefix and suffix product passes\n  return [];\n}`,
      python: `def product_except_self(nums: list[int]) -> list[int]:\n    pass`,
      cpp: `#include <vector>\nusing namespace std;\n\nvector<int> productExceptSelf(vector<int>& nums) {\n    return {};\n}`,
      c: `int* productExceptSelf(int* nums, int numsSize, int* returnSize) {\n    *returnSize = numsSize;\n    return NULL;\n}`,
      java: `public class Solution {\n    public static int[] productExceptSelf(int[] nums) {\n        return new int[]{};\n    }\n}`
    },
    validate: (clean) => (clean.includes('prefix') || clean.includes('prod') || clean.includes('result') || clean.includes('output') || clean.includes('right')) && (clean.includes('for') || clean.includes('while'))
  }
];
