---
layout: post
title: 84. Largest Rectangle in Histogram
subtitle:
author: Bin Li
tags: [Coding, LeetCode]
image: 
comments: true
published: true
---

Given n non-negative integers representing the histogram's bar height where the width of each bar is 1, find the area of largest rectangle in the histogram.
![](/img/media/15546279438256.jpg)

 


Above is a histogram where width of each bar is 1, given height = [2,1,5,6,2,3].


 ![](/img/media/15546279488319.jpg)


The largest rectangle is shown in the shaded area, which has area = 10 unit.

Example:
```
Input: [2,1,5,6,2,3]
Output: 10
```

## Solutions
　　分析起来这个问题似乎还是很复杂的，主要是没有分析清楚规律，所以就不好往已知的解决思路上靠。这里需要引入的方法叫做单调栈 (Monotone Stack)，我们维持一个单调递增的栈，栈中保存的是当前条形图的坐标（从0开始），每遍历到一个 bar 后就比较一下当前 bar 的值与栈顶坐标对应的 bar 取值大小，如果当前 bar 大，则压入栈中，否则就一直循环 pop 栈顶元素，直到当前 bar 大为止。每 pop 一个元素，我们就计算以 pop 出来的 bar 为宽，以 $(i-stack.top-1)$ 为长计算面积，因为 i 在遍历时会超前走一步，所以会多出 1.

具体循环进行下面的步骤：
1. Create an empty stack.
2. Start from first bar, and do following for every bar ‘hist[i]’ where ‘i’ varies from 0 to n-1.
    * a. If stack is empty or hist[i] is higher than the bar at top of stack, then push ‘i’ to stack.
    * b. If this bar is smaller than the top of stack, then keep removing the top of stack while top of the stack is greater. Let the removed bar be hist[tp]. Calculate area of rectangle with hist[tp] as smallest bar. For hist[tp], the ‘left index’ is previous (previous to tp) item in stack and ‘right index’ is ‘i’ (current index).
3. If the stack is not empty, then one by one remove all bars from stack and do step 2.b for every removed bar.

```python
class Solution(object):
    def largestRectangleArea(self, heights):
        """
        :type heights: List[int]
        :rtype: int
        """
        # This function calulates maximum  
        # rectangular area under given  
        # heights with n bars 

        # Create an empty stack. The stack  
        # holds indexes of heights[] list.  
        # The bars stored in the stack are 
        # always in increasing order of  
        # their heights. 
        stack = list() 

        max_area = 0 # Initalize max area 

        # Run through all bars of 
        # given heights 
        index = 0
        while index < len(heights): 
              
            # If this bar is higher  
            # than the bar on top 
            # stack, push it to stack 

            if (not stack) or (heights[stack[-1]] <= heights[index]): 
                stack.append(index) 
                index += 1

            # If this bar is lower than top of stack, 
            # then calculate area of rectangle with  
            # stack top as the smallest (or minimum 
            # height) bar.'i' is 'right index' for  
            # the top and element before top in stack 
            # is 'left index' 
            else: 
                # pop the top 
                top_of_stack = stack.pop() 

                # Calculate the area with  
                # heights[top_of_stack] stack 
                # as smallest bar 
                area = (heights[top_of_stack] * 
                       ((index - stack[-1] - 1)  
                       if stack else index)) 

                # update max area, if needed 
                max_area = max(max_area, area) 

        # Now pop the remaining bars from  
        # stack and calculate area with  
        # every popped bar as the smallest bar 
        while stack: 
              
            # pop the top 
            top_of_stack = stack.pop() 

            # Calculate the area with  
            # heights[top_of_stack]  
            # stack as smallest bar 
            area = (heights[top_of_stack] * 
                  ((index - stack[-1] - 1)  
                    if stack else index)) 

            # update max area, if needed 
            max_area = max(max_area, area) 

        # Return maximum area under  
        # the given heights 
        return max_area 
```

## References
1. [84. Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/)
2. [Largest Rectangular Area in a Histogram | Set 2](https://www.geeksforgeeks.org/largest-rectangle-under-histogram/)