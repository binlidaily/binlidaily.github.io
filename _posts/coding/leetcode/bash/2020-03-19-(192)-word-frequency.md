---
layout: post
title: 192. Word Frequency
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Bash]
image: 
comments: true
published: true
---

## Description

Write a bash script to calculate the frequency of each word in a text file `words.txt`.

For simplicity sake, you may assume:

- `words.txt` contains only lowercase characters and space `' '` characters.
- Each word must consist of lowercase characters only.
- Words are separated by one or more whitespace characters.

**Example:**

Assume that `words.txt` has the following content:

```
the day is sunny the the
the sunny is is
```

Your script should output the following, sorted by descending frequency:

```
the 4
is 3
sunny 2
day 1
```

**Note:**

- Don't worry about handling ties, it is guaranteed that each word's frequency count is unique.
- Could you write it in one-line using [Unix pipes](http://tldp.org/HOWTO/Bash-Prog-Intro-HOWTO-4.html)?


## Solutions
### 1. Awk+Sort+Uniq

```bash
awk '{for(w=1;w<=NF;w++) print$w}' ./words.txt | sort | uniq -c | sort -nr | awk '{print $2,$1}'
# 14/14 cases passed (4 ms)
# Your runtime beats 59.89 % of bash submissions
# Your memory usage beats 34.48 % of bash submissions (3.3 MB)

awk '{
    for (i = 1; i <= NF; ++i) ++s[$i];
} END {
    for (i in s) print i, s[i];
}' words.txt | sort -nr -k 2
```

### 2. Cat+Tr+Sort+uniq

```bash
cat words.txt | tr -s ' ' '\n' | sort | uniq -c | sort -r | awk '{print $2, $1}'
# 14/14 cases passed (0 ms)
# Your runtime beats 100 % of bash submissions
# Your memory usage beats 93.1 % of bash submissions (3.2 MB)

tr -s ' ' '\n' < words.txt | sort | uniq -c | sort -nr | awk '{print $2" "$1}'

```

### 3. Grep

```bash
grep -oE '[a-z]+' words.txt | sort | uniq -c | sort -nr | awk '{print $2" "$1}'
```

### 4. Bash Script

```bash
#!/bin/bash

declare -A wordcounts

while IFS= read line
do
        for word in $line
        do
                if [ ! ${wordcounts[$word]} ]
                then wordcounts[$word]=1
                else wordcounts[$word]="$((wordcounts[$word]+1))"
                fi
        done
done < words.txt

for KEY in "${!wordcounts[@]}"
do
        printf "$KEY ${wordcounts[$KEY]}\n"
done |
sort -rn -k2
```

## References
1. [192. Word Frequency](https://leetcode.com/problems/word-frequency/description/)