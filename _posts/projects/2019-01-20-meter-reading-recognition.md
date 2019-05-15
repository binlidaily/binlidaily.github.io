---
layout: post
title: Meter Reading Recognition
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

本文记录一下做仪表识别的一些尝试过程，刚开始用过最基础的识别指针和圆，但是效果不鲁棒，于是尝试使用目标检测的方法来做。

## 计算机几何学方式（检测线段和圆）
目前有现成的一些项目用来测试一下，比如 Intel 就提供了一个开源的给予 OpenCV 的[项目](https://github.com/intel-iot-devkit/python-cv-samples/tree/master/examples/analog-gauge-reader)，尝试之后发现用在当前的项目效果较差，因为二值化之后图片基本上看不见了，无法做下一步的识别线段和圆的操作。这里定位圆和圆心是为了自动读数，这样似乎没有太大必要。我们直接识别指针，然后通过识别到的指针两端点坐标能够计算出角度，通过角度就可以计算出读数。

```python
#直线检测
#使用霍夫直线变换做直线检测，前提条件：边缘检测已经完成
import cv2
import numpy as np
# %matplotlib inline
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
from math import atan, pi

#标准霍夫线变换
def line_detection(img, length=1000):
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    gray = cv2.GaussianBlur(gray,(3,3),0)
    edges = cv2.Canny(gray, 50, 150, apertureSize=3)  #apertureSize参数默认其实就是3
#     plt.imshow(edges)
#     plt.title('edges')
#     plt.show()
    lines = cv2.HoughLines(edges, 1, np.pi/180, 80)
    xstart, ystart, xend, yend = None, None, None, None
    if lines is None:
        print 'cannot detect any line'
        return xstart, ystart, xend, yend
    else:
        print 'line_detection', lines.shape[0]
    for line in lines:
        rho, theta = line[0]  #line[0]存储的是点到直线的极径和极角，其中极角是弧度表示的。
        a = np.cos(theta)   #theta是弧度
        b = np.sin(theta)
        x0 = a * rho    #代表x = r * cos（theta）
        y0 = b * rho    #代表y = r * sin（theta）
        x1 = int(x0 + length * (-b)) #计算直线起点横坐标
        y1 = int(y0 + length * a)    #计算起始起点纵坐标
        x2 = int(x0 - length * (-b)) #计算直线终点横坐标
        y2 = int(y0 - length * a)    #计算直线终点纵坐标    注：这里的数值1000给出了画出的线段长度范围大小，数值越小，画出的线段越短，数值越大，画出的线段越长
        cv2.line(img, (x1, y1), (x2, y2), (0, 0, 255), 2)    #点的坐标必须是元组，不能是列表。
        if not xstart:
            xstart, ystart, xend, yend = x1, y1, x2, y2
#         xstart, ystart, xend, yend = x1, y1, x2, y2
#     plt.imshow(img)
#     plt.title('img-lines')
#     plt.show()
    return xstart, ystart, xend, yend

#统计概率霍夫线变换
def line_detect_possible_demo(img):
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    ray = cv2.GaussianBlur(gray,(3,3),0)
    edges = cv2.Canny(gray, 50, 150, apertureSize=3)  # apertureSize参数默认其实就是3
    lines = cv2.HoughLinesP(edges, 1, np.pi / 180, 60, minLineLength=60, maxLineGap=5)
#     print 'line_detect_possible_demo', len(lines)
    xstart, ystart, xend, yend = None, None, None, None
    if lines is None:
        print 'cannot detect any line'
        return xstart, ystart, xend, yend
    else:
        print 'line_detection', lines.shape[0]
    for line in lines:
        x1, y1, x2, y2 = line[0]
        cv2.line(img, (x1, y1), (x2, y2), (0, 0, 255), 2)
        if not xstart:
            xstart, ystart, xend, yend = x1, y1, x2, y2
#         xstart, ystart, xend, yend = x1, y1, x2, y2
#     plt.imshow(img)
#     plt.title('line_detect_possible_demo')
#     plt.show()
#     print 'coordinate :', xstart, ystart, xend, yend
    return xstart, ystart, xend, yend

#计算角度
def calculate_reading(xstart, ystart, xend, yend, angle_min, angle_max, meas_range):
    # the coordinate of the two points in the line: xstart, ystart, xend, yend
    # angle_min: the start point value, 6点钟位置为零，从零出发，顺时针的相对角度
    # angle_max: the end point value, 6点钟位置为零，从零出发，逆时针的相对角度
    # meas_range: measure range
    if not xstart or not ystart or not xend or not yend:
        reading = None
        return reading

    whole_angle = 360 - (angle_min + angle_max)
#     print 'coordinate is: ', xstart, ystart, xend, yend
    if xstart == xend:
        valid_angle = 90 + (90 - angle_min)
    else:
        angle = atan(float(ystart - yend) / (xstart - xend)) * 180 / pi
#         print 'angle with horizontal line is: ', angle
        if angle < 0: 
            angle = 180 + angle
#         print 'after angle with horizontal line is: ', angle
        valid_angle = angle + (90 - angle_min)
#     print 'valid_angle / whole_angle * meas_range', valid_angle, whole_angle, meas_range
    reading = float(valid_angle) / whole_angle * meas_range
    return reading


def reading_predict(img_file, is_poss=False, length=1000, is_plot=False):
    if isinstance(img_file, str):
        img = mpimg.imread(img_file)
    else:
        img = img_file
    # print(img.shape)
    # plt.imshow(img)
    # plt.title('input_image')
    # plt.show()

    if is_poss:
        xstart, ystart, xend, yend = line_detect_possible_demo(img)
    else:
        xstart, ystart, xend, yend = line_detection(img)
    
    reading = calculate_reading(xstart, ystart, xend, yend, 90, 90, 120)

#     print 'the reading of the gauge is: ', reading

    if is_plot:
        plt.imshow(img)
        plt.title('last show')
        plt.show()
    return reading
```

当然如果直接从原图上识别的话效果不是很理想，于是我们就想到先识别表盘，将表盘抠出来，然后再训练一个识别指针的模型，然后将指针框出来，

## 计算机视觉-目标检测的方法
### SSD
TensorFlow 版本在 Github 上有[实现版本](https://github.com/balancap/SSD-Tensorflow)，具体的实践记录[在此](https://binlidaily.github.io/2018-09-29-single-shot-multibox-detector/)，理论学习记录。

### RCNN
因为 SSD 的效果不是很好，尝试使用一下 RCNN，github 上也有 TensorFlow [版本](https://github.com/endernewton/tf-faster-rcnn)。

## References
1. [Analog Gauge Reader - Intel](https://github.com/intel-iot-devkit/python-cv-samples/tree/master/examples/analog-gauge-reader)
2. [Deep Gauge](https://github.com/oci-labs/deep-gauge)
3. [SSD TensorFlow](https://binlidaily.github.io/2018-09-29-single-shot-multibox-detector/)
4. [A water meter reader](https://github.com/yamaton/water-meter-reading)
5. [Water meter reader - Convert analog dials into a digital value](https://github.com/zagor/watermeter)