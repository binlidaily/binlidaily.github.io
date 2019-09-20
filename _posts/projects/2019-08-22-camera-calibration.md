---
layout: post
title: Camera Calibration And Distance Estimation
subtitle: 相机标定和距离评估
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
typora-root-url: ../../../binlidaily.github.io
typora-copy-images-to: ../../img/media
---

　　通过单目摄像头测距，我们先得从搞清楚相机标定。图像处理、立体视觉等等方向常常涉及四个坐标系：
* 世界坐标系（Word Coordinates）
    * 世界坐标系 (xw,yw,zw)，也称为测量坐标系，是一个三维直角坐标系，以其为基准可以描述相机和待测物体的空间位置。
    * 世界坐标系的位置可以根据实际情况自由确定。
* 相机坐标系（Camera Coordinates）
* 图像坐标系（Film Coordinates）
* 像素坐标系（Pixel Coordinates）

## 1. 映射关系

### 1.1 世界坐标系向相机坐标系转换
![-w890](/img/media/15686866020086.jpg)

　　世界坐标系和相机坐标系都是三维的，所以可以先通过平移变换让两个坐标系的原点重合，然后好做旋转变换。这里的 C 坐标表示的是相机坐标系原点在世界坐标系中的位置。其中的 $P_C$ 和 $P_W$ 是同一个点分别在相机坐标系和世界坐标系下的表示，我们希望找到这两者之间的等价关系，即完成转换。

![-w909](/img/media/15665299681341.jpg)

　　接下来看如何转换，如上图所示，我们先只看固定一个轴，另外两个轴旋转变换的关系。然后三个轴都变换后找到对应的变换矩阵连乘起来就得到了最终的旋转变换矩阵。

![-w679](/img/media/15665294472973.jpg)

* 为什么连乘就能得到最终的旋转变换？
* 到时候 $\theta$ 怎么保证三个轴一样？

$J(k_1, k_2, k_3, p_1, p_2)$

$$
\left(\begin{array}{c}{u_{c c d_{c r t}}} \\ {v_{c c d_{c r t}}}\end{array}\right)=J\left(k_{1}, k_{2}, k_{3}, p_{1}, p_{2}\right)\left(\begin{array}{ccc}{f_{x}} & {0} & {c_{x}} \\ {0} & {f_{y}} & {c_{y}} \\ {0} & {0} & {1}\end{array}\right)\left(\begin{array}{c}{R_{b 2 C}\left(\begin{array}{c}{X_{b}} \\ {Y_{b}} \\ {Z_{b}}\end{array}\right)+T_{b 2 C}}\end{array}\right)
$$
### 1.2 相机坐标系向图像坐标系的转换
　　图像坐标系是二维的，从相机坐标系到图像坐标系，属于透视投影关系，从 3D 到 2D。

![-w1265](/img/media/15686889424936.jpg)

　　这里可以看成是小孔成像原理的镜像位置到了 Image Point 上。

### 1.3 图像坐标系向像素坐标系转换
　　因为图像坐标系和像素坐标系都是二维的，只要对单位做一个变换就好。我们假设 $dx$ 和 $dy$ 分别表示每一个像素横向和纵向的长度(mm)，即

$$ 1~pixel~ 横向长度 = dx~mm$$

$$ 1~pixel~ 纵向长度 = dy~mm$$

　　这样就可以计算变换公式了：

![](/img/media/15664774286068.jpg)



## 2. 相机标定
* 内外参数都可以通过 OpenCV 计算得到？
* 那需要测量靶标到相机的意义在哪里？

### 2.1 先不考虑畸变
![](/img/media/15664561156731.jpg)

　　针孔相机的参数是一个 $4\times3$ 的矩阵，被称为 camera matrix，这个矩阵将三维世界场景映射到图片的平面。标定算法那使用 extrinsic and intrinsic parameters 来计算 camera matrix。extrinsic parameters 表示三维世界中相机的位置，intrinsic parameters 表示光学中心（optical center ）和焦距（focal length）。

![](/img/media/15664564919102.jpg)

　　世界坐标点可以通过 extrinsic parameters 转变到相机坐标系中；相机坐标系可以用 intrinsic parameters 映射到图片平面。

![](/img/media/15664572245712.jpg)

　　接下来就计算相机标定参数，相机标定算法能够使用 extrinsic and intrinsic parameters 计算 camera matrix，extrinsic parameters 代表从三维的世界坐标系到三维的相机坐标系的刚体转变（a rigid transformation），即物体不会发生形变。

![](/img/media/15664576837810.jpg)

　　Extrinsic Parameters 由旋转（Rotation, R）和变换（Translation, t）组成，相机坐标系的原点在其光学中心，其 x 轴和 y 轴确定了图片平面。其用来描述相机相对于一个固定场景的运动，或者相反，物体围绕相机的的刚性运动。

![](/img/media/15664581181472.jpg)

　　Intrinsic Parameters 包括焦距（focal length）和光学中心（optical center, or principal point）和偏斜系数（skew coefficient）。相机的 intrinsic matrix 定义为：

K = ![-w72](/img/media/15664587238468.jpg)

　　其中有：
* $[c_x, c_y]$ 是以像素为单位的光学中心，通常是图片的中心
* $(f_x, f_y)$ 是以像素为单位的焦距
* $f_x = \frac{F}{p_x}$
* $f_y = \frac{F}{p_y}$
* $F$ 是世界单位下的焦距，一般是用毫米表示
* $(p_x, p_y)$ 是世界单位下的像素大小
* $s=f_x\tan \alpha$ 是偏斜系数，如果图片的坐标轴不相互垂直，那么偏斜系数大小就不为零

　　像素的偏斜被定义为：

![](/img/media/15664587669834.jpg)

　　Intrinsic Parameters 不依赖场景的视图，只要焦距固定，**一旦计算出可以重复利用**。


### 2.1 相机标定里的畸变（Distortion）
　　上面提到的 camera matrix 是没有算上透镜畸变（lens distortion），因为理想的真空相机不含有镜头。为了更加准确的表示真实的相机，相机模型还需要加入径向和切向透镜畸变（radial and tangential lens distortion）。

　　Radial Distortion 指的是光线在投过透镜边缘发生的弯曲比在光学中心发生的弯曲程度大的现象，透镜越小，发生的径向畸变越大。

![](/img/media/15664620867990.jpg)

　　径向畸变系数能够表示这种畸变的模式，畸变点表示为 $(x_\text{distorted}, y_\text{distorted})$：

$$
x_\text{distorted} = x(1 + k_1*r^2+k_2*r^4+k_3*r^6) \\
y_\text{distorted} = y(1 + k_1*r^2+k_2*r^4+k_3*r^6)
$$

　　其中：
* $(x, y)$ 是无畸变的像素坐标。
    * Normalized image coordinates are calculated from pixel coordinates by translating to the optical center and dividing by the focal length in pixels. Thus, x and y are dimensionless.
    * $x$ 和 $y$ 是在归一化后的图片坐标系中。
* $k_1$，$k_2$ 和 $k_3$ 是透镜径向畸变的系数
* $r^2=x^2+y^2$

　　一般来说两个系数就能够用于标定任务了，但是对于比较严重的畸变，比如在广角镜头（wide-angle lenses）中，就需要选择３个系数（包含 $k_3$）。

　　Tangential Distortion 指的是当透镜和图片平面不平行时出现的畸变。
![](/img/media/15664628502662.jpg)

　　此时的畸变点可以表示为 $(x_\text{distorted}, y_\text{distorted})$:

$$
x_\text{distorted} = x + [ 2 * p_1 * x * y + p_2*(r^2 + 2*x^2)]\\
y_\text{distorted} = y + [ p_1*(r^2 + 2*y^2) + 2* p_2 * x * y ]
$$

　　其中：
* $(x, y)$ 是无畸变的像素坐标。
    * Normalized image coordinates are calculated from pixel coordinates by translating to the optical center and dividing by the focal length in pixels. Thus, x and y are dimensionless.
* $p_1$ 和 $p_2$ 是透镜切向畸变系数
* $r^2=x^2+y^2$

## 测距
![](/img/media/15665270936081.jpg)

![-w818](/img/media/15665279327674.jpg)


![](/img/media/15664657888542.jpg)

![](/img/media/15664773843028.jpg)


$$
Z_{c}\left[\begin{array}{c}{u} \\ {v} \\ {1}\end{array}\right]=\left[\begin{array}{ccc}{\frac{1}{d x}} & {0} & {u_{0}} \\ {0} & {\frac{1}{d y}} & {v_{0}} \\ {0} & {0} & {1}\end{array}\right]\left[\begin{array}{cccc}{f} & {0} & {0} & {0} \\ {0} & {f} & {0} & {0} \\ {0} & {0} & {1} & {0}\end{array}\right]\left[\begin{array}{cc}{X} & {T} \\ {0} & {1}\end{array}\right]\left[\begin{array}{c}{X_{w}} \\ {Y_{w}} \\ {Z_{w}} \\ {1}\end{array}\right]=\left[\begin{array}{cccc}{f_{x}} & {0} & {u_{0}} & {0} \\ {0} & {f_{y}} & {v_{0}} & {0} \\ {0} & {0} & {1} & {0}\end{array}\right]\left[\begin{array}{cc}{X_{w}} \\ {Y_{w}} \\ {Z_{w}} \\ {1}\end{array}\right]
$$

　　引入齐次的目的是把所有的变换（缩放、旋转、平移）统一起来，因为分开的话，平移是矩阵加法，旋转是矩阵乘法，引入齐次之后就变成乘法了。


## References
1. [What Is Camera Calibration?](https://ww2.mathworks.cn/help/vision/ug/camera-calibration.html)
2. [OpenCV相机标定及距离估计（单目）](https://blog.csdn.net/ywcpig/article/details/80760757)
3. [Camera Calibration and 3D Reconstruction](https://docs.opencv.org/2.4/modules/calib3d/doc/camera_calibration_and_3d_reconstruction.html?highlight=findhomography)
4. [单目相机测距方法研究](https://www.machunjie.com/deeplearning/visual/10.html)
5. [Measuring Planar Objects with a Calibrated Camera](https://de.mathworks.com/help/vision/examples/measuring-planar-objects-with-a-calibrated-camera.html)
6. [最详细、最完整的相机标定讲解](https://blog.csdn.net/lxy_2011/article/details/80675803)
7. [世界坐标系和相机坐标系,图像坐标系的关系](https://blog.csdn.net/waeceo/article/details/50580607)
8. [图像二维坐标转世界三维坐标](https://zhuanlan.zhihu.com/p/32030223)
9. [计算机视觉：相机成像原理：世界坐标系、相机坐标系、图像坐标系、像素坐标系之间的转换](https://blog.csdn.net/chentravelling/article/details/53558096)
10. [**为什么要引入齐次坐标**](https://blog.csdn.net/saltriver/article/details/79680364)
11. [CS4495-07-Calibration.pdf](/assets/CS4495-07-Calibration.pdf)
12. [**lecture12.pdf**](/assets/lecture12.pdf)
13. [相机标定究竟在标定什么？](https://zhuanlan.zhihu.com/p/30813733)
14. [基于目标检测的实时单目测距](https://zhuanlan.zhihu.com/p/42085600)
15. [Image Alignment (Feature Based) using OpenCV (C++/Python)](https://www.learnopencv.com/image-alignment-feature-based-using-opencv-c-python/)
16. [HomographyEstimation](https://github.com/hughesj919/HomographyEstimation/blob/master/Homography.py)