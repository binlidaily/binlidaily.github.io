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

　　较为简单的递归方法如下：
```python
# Python function to print permutations of a given list 
def permutation(lst): 
  
    # If lst is empty then there are no permutations 
    if len(lst) == 0: 
        return [] 
  
    # If there is only one element in lst then, only 
    # one permuatation is possible 
    if len(lst) == 1: 
        return [lst] 
  
    # Find the permutations for lst if there are 
    # more than 1 characters 
  
    l = [] # empty list that will store current permutation 
  
    # Iterate the input(lst) and calculate the permutation 
    for i in range(len(lst)): 
       m = lst[i] 
  
       # Extract lst[i] or m from the list.  remLst is 
       # remaining list 
       remLst = lst[:i] + lst[i+1:] 
  
       # Generating all permutations where m is first 
       # element 
       for p in permutation(remLst): 
           l.append([m] + p) 
    return l 
  
  
# Driver program to test above function 
data = list('123') 
for p in permutation(data): 
    print p 
```


　　当然在实践中可以直接使用现成的包：
```python
from itertools import permutations 
l = list(permutations(range(1, 4))) 
print l 
```

## References
1. [How to generate all permutations of a list in Python](https://stackoverflow.com/questions/104420/how-to-generate-all-permutations-of-a-list-in-python)