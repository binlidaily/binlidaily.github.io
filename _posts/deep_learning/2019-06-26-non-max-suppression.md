---
layout: post
title: Non-Max Suppression
subtitle:
author: Bin Li
tags: [Deep Learning]
image: 
comments: true
published: true
---


　　当做目标检测的任务时，可能能够预测得到很多个候选框及其对应的置信度，非极大值抑制 (Non-Max Suppression, NMS) 就是来过滤掉多余的候选框只留下一个最合适的。

流程：
1. 将所有候选框按照得分排序，选中得分最高的及其对应的框；
2. 遍历其余的框，如果和当前最高分矿的 IoU 大于一定的阈值，就将框删除；
3. 从未处理的框中选继续选择一个得分最高的，重复上述过程。

```python
# --------------------------------------------------------
# Fast R-CNN
# Copyright (c) 2015 Microsoft
# Licensed under The MIT License [see LICENSE for details]
# Written by Ross Girshick
# --------------------------------------------------------

import numpy as np

def nms(dets, thresh):
    x1 = dets[:, 0]
    y1 = dets[:, 1]
    x2 = dets[:, 2]
    y2 = dets[:, 3]
    scores = dets[:, 4]

    areas = (x2 - x1 + 1) * (y2 - y1 + 1)
    order = scores.argsort()[::-1]

    keep = []
    while order.size > 0:
        i = order[0]
        keep.append(i)
        xx1 = np.maximum(x1[i], x1[order[1:]])
        yy1 = np.maximum(y1[i], y1[order[1:]])
        xx2 = np.minimum(x2[i], x2[order[1:]])
        yy2 = np.minimum(y2[i], y2[order[1:]])

        w = np.maximum(0.0, xx2 - xx1 + 1)
        h = np.maximum(0.0, yy2 - yy1 + 1)
        inter = w * h
        ovr = inter / (areas[i] + areas[order[1:]] - inter)

        inds = np.where(ovr <= thresh)[0]
        order = order[inds + 1]

    return keep
```

## References
1. [fast-rcnn](https://github.com/rbgirshick/fast-rcnn/blob/master/lib/utils/nms.py)
