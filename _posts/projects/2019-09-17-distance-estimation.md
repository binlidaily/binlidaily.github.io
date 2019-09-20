---
layout: post
title: Distance Estimation
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

## 1. 相机标定
　　这里使用 OpenCV 来做标定，首先准备[棋盘靶标](/assets/靶标棋盘.png)

$Z=0$ 的时候有下面的等式：
$$
\left.s\left[\begin{array}{c}{u} \\ {v} \\ {1}\end{array}\right]=\begin{array}{ccc}{n} & {n} & {r} & {t}\end{array}\right]\left[\begin{array}{c}{x} \\ {y} \\ {0} \\ {1}\end{array}\right]=A\left[\begin{array}{lll}{n} & {n} & {t}\end{array}\right]\left[\begin{array}{l}{x} \\ {y} \\ {1}\end{array}\right]
$$

## References
1. [OpenCV: How-to calculate distance between camera and object using image?](https://stackoverflow.com/questions/14038002/opencv-how-to-calculate-distance-between-camera-and-object-using-image)
2. [Camera Calibration](https://opencv-python-tutroals.readthedocs.io/en/latest/py_tutorials/py_calib3d/py_calibration/py_calibration.html)
3. [單目攝像機測距（python+opencv）](https://www.itread01.com/content/1546869267.html)
4. [Basic concepts of the homography explained with code](https://docs.opencv.org/master/d9/dab/tutorial_homography.html)