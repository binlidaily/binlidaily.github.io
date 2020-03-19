---
layout: post
title: 193. Valid Phone Numbers
subtitle: Easy
author: Bin Li
tags: [Coding, LeetCode, Easy, Bash]
image: 
comments: true
published: true
---

## Description

Given a text file `file.txt` that contains list of phone numbers (one per line), write a one liner bash script to print all valid phone numbers.

You may assume that a valid phone number must appear in one of the following two formats: (xxx) xxx-xxxx or xxx-xxx-xxxx. (x means a digit)

You may also assume each line in the text file must not contain leading or trailing white spaces.

**Example:**

Assume that `file.txt` has the following content:

```
987-123-4567
123 456 7890
(123) 456-7890
```

Your script should output the following valid phone numbers:

```
987-123-4567
(123) 456-7890
```


## Solutions
### 1. Grep

```bash
grep -P '^(\d{3}-|\(\d{3}\) )\d{3}-\d{4}$' file.txt
# no -P in MacOS
# 26/26 cases passed (4 ms)
# Your runtime beats 57.26 % of bash submissions
# Your memory usage beats 39.29 % of bash submissions (3.2 MB)
```

### 2. Sed

```bash
sed -n -r '/^([0-9]{3}-|\([0-9]{3}\) )[0-9]{3}-[0-9]{4}$/p' file.txt
# 26/26 cases passed (4 ms)
# Your runtime beats 57.26 % of bash submissions
# Your memory usage beats 96.43 % of bash submissions (3.1 MB)
```

### 3. Awk

```bash
awk '/^([0-9]{3}-|\([0-9]{3}\) )[0-9]{3}-[0-9]{4}$/' file.txt
# 26/26 cases passed (4 ms)
# Your runtime beats 57.26 % of bash submissions
# Your memory usage beats 14.29 % of bash submissions (3.3 MB)
```

## References
1. [193. Valid Phone Numbers](https://leetcode.com/problems/valid-phone-numbers/description/)
2. [正则表达式中限定符与定位符的灵活使用](https://leetcode-cn.com/problems/valid-phone-numbers/solution/zheng-ze-biao-da-shi-zhong-xian-ding-fu-yu-ding-we/)