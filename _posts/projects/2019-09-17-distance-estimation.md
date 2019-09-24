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

　　这个项目目的是用单目相机来做测距，从原理上讲，单目相机是没有办法进行测距的，因为构建的相机模型是一个射线方程，缺少自由度，没有办法唯一确定 $Z_c$ 的信息。

$$
Z_{c}\left[\begin{array}{c}{u} \\ {v} \\ {1}\end{array}\right]=\left[\begin{array}{ccc}{\frac{1}{d x}} & {0} & {u_{0}} \\ {0} & {\frac{1}{d y}} & {v_{0}} \\ {0} & {0} & {1}\end{array}\right]\left[\begin{array}{cccc}{f} & {0} & {0} & {0} \\ {0} & {f} & {0} & {0} \\ {0} & {0} & {1} & {0}\end{array}\right]\left[\begin{array}{cc}{R} & {T} \\ {\overrightarrow{0}} & {1}\end{array}\right]\left[\begin{array}{c}{X_{w}} \\ {Y_{w}} \\ {Z_{w}} \\ {1}\end{array}\right]=\left[\begin{array}{cccc}{f_{x}} & {0} & {u_{0}} & {0} \\ {0} & {f_{y}} & {v_{0}} & {0} \\ {0} & {0} & {1} & {0}\end{array}\right]\left[\begin{array}{cc}{R} & {T} \\ {\overrightarrow{0}} & {1}\end{array}\right]\left[\begin{array}{c}{X_{w}} \\ {Y_{w}} \\ {Z_{w}} \\ {1}\end{array}\right]
$$

　　于是，我们这里的做法是，通过目标检测算法框出被检测物体，然后找到检测框下边线段中点作为被检测物体在图像中地面上的点。然后通过公式变换，由像素坐标系到世界坐标系转换得到世界坐标系下在地面上的那个点的二维平面坐标（此时第三维 $z=0$），所以可以不用考虑。

　　也就是说，我们的核心是假设 $z=0$ 那么上面等式就可以变成：
$$
s\left[\begin{array}{c}{u} \\ {v} \\ {1}\end{array}\right]=A\left[\begin{array}{ccc}{r_1} & {r_2} & {r_3} & {t}\end{array}\right]\left[\begin{array}{c}{x} \\ {y} \\ {0} \\ {1}\end{array}\right]=A\left[\begin{array}{lll}{r_1} & {r_2} & {t}\end{array}\right]\left[\begin{array}{l}{x} \\ {y} \\ {1}\end{array}\right]
$$

　　其中 $s=\frac{1}{Z_c}$，$A=\left[\begin{array}{ccc}{f_{x}} & {0} & {u_{0}} \\ {0} & {f_{y}} & {v_{0}} \\ {0} & {0} & {1}\end{array}\right]$。于是，我们需要做的就是先标定好相机，得到相机内参 $A$，然后建立好世界坐标系（原点在相机投影在地面的位置），将上式计算出来的靶标坐标系结果转换到世界坐标系，得到 $(x_w, y_w)$，然后通过求三角形斜边长度可以计算出距离。

![Note 2019-09-24 001](/img/media/Note%202019-09-24%20001.jpeg){:.center-images}



## References
1. [OpenCV: How-to calculate distance between camera and object using image?](https://stackoverflow.com/questions/14038002/opencv-how-to-calculate-distance-between-camera-and-object-using-image)
2. [Camera Calibration](https://opencv-python-tutroals.readthedocs.io/en/latest/py_tutorials/py_calib3d/py_calibration/py_calibration.html)
3. [單目攝像機測距（python+opencv）](https://www.itread01.com/content/1546869267.html)
4. [Basic concepts of the homography explained with code](https://docs.opencv.org/master/d9/dab/tutorial_homography.html)
5. [棋盘靶标图片](/assets/靶标棋盘.png)