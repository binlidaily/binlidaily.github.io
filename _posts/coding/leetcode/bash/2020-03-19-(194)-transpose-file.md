---
layout: post
title: 194. Transpose File
subtitle: Medium
author: Bin Li
tags: [Coding, LeetCode, Medium, Bash]
image: 
comments: true
published: true
---

## Description

Given a text file `file.txt`, transpose its content.

You may assume that each row has the same number of columns and each field is separated by the `' '` character.

**Example:**

If `file.txt` has the following content:

```
name age
alice 21
ryan 30
```

Output the following:

```
name alice ryan
age 21 30
```


## Solutions
### 1. Awk

```bash
awk '{
    for (i=1;i<=NF;i++){
        if (NR==1){
            res[i]=$i
        }
        else{
            res[i]=res[i]" "$i
        }
    }
}
END{
    for(j=1;j<=NF;j++){
        print res[j]
    }
}
' file.txt

# 17/17 cases passed (8 ms)
# Your runtime beats 80.27 % of bash submissions
# Your memory usage beats 100 % of bash submissions (3.5 MB)
```
### 2. 什么东西？

```bash
columns=$(head -n 1 file.txt | wc -w)
for ((i=1;i<=$columns;i++)); do
  cut -d' ' -f $i file.txt | sed -z 's/\n/ /g;s/ $/\n/'
done
```

## References
1. [194. Transpose File](https://leetcode.com/problems/transpose-file/description/)
2. [Solution using AWK with explanations](https://leetcode.com/problems/transpose-file/discuss/111382/Solution-using-AWK-with-explanations)
3. [awk命令用数组储存带输出结果](https://leetcode-cn.com/problems/transpose-file/solution/awkming-ling-yong-shu-zu-chu-cun-dai-shu-chu-jie-g/)