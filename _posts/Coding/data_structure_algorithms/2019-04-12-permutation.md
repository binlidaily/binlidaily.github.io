---
layout: post
title: Permutation
subtitle: 全排列
author: Bin Li
tags: [Coding]
image: 
comments: true
published: true
---

之前其实在看[字符串排列](https://binlidaily.github.io/2019-04-02-(028)-%E5%AD%97%E7%AC%A6%E4%B8%B2%E7%9A%84%E6%8E%92%E5%88%97/)时有接触到一点全排列，这里做一个整理。

这里也用 DFS 方法列举出一种解法：
```python
def permutations(iterable, r=None):
    # permutations('ABCD', 2) --> AB AC AD BA BC BD CA CB CD DA DB DC
    # permutations(range(3)) --> 012 021 102 120 201 210
    pool = tuple(iterable)
    n = len(pool)
    r = n if r is None else r
    if r > n:
        return
    indices = range(n)
    cycles = range(n, n-r, -1)
    yield tuple(pool[i] for i in indices[:r])
    while n:
        for i in reversed(range(r)):
            cycles[i] -= 1
            if cycles[i] == 0:
                indices[i:] = indices[i+1:] + indices[i:i+1]
                cycles[i] = n - i
            else:
                j = cycles[i]
                indices[i], indices[-j] = indices[-j], indices[i]
                yield tuple(pool[i] for i in indices[:r])
                break
        else:
            return
```

## References
1. [How to generate all permutations of a list in Python](https://stackoverflow.com/questions/104420/how-to-generate-all-permutations-of-a-list-in-python)