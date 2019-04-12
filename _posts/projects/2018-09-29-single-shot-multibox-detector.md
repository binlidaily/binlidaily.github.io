---
layout: post
title: Single Shot MultiBox Detector
subtitle:
author: Bin Li
tags: [Computer Vision]
image: 
comments: true
published: true
typora-root-url: ../../../binlidaily.github.io
typora-copy-images-to: ../../img/media
---


## SSD Tensorflow Implementation
Github 上早已经开源了 [SSD TensorFlow](https://github.com/balancap/SSD-Tensorflow) 版，因为其上没有详细说明该如何训练自己的数据，于是熟悉之后在此做一些记录，方便后期查看。

将项目 clone 下来之后，首先可以跑一跑 demo，看下 SSD 检测的效果，解压已经训练好后保存下来的 SSD 模型的 checkpoint 文件（在 ./checkpoint 文件夹中）：

```shell
unzip ssd_300_vgg.ckpt.zip
```

接着就可以回到项目根目录运行 demo 的 jupyter 了：
```shell
jupyter notebook notebooks/ssd_notebook.ipynb
```

如果出现找不到 datasets 的报错，确保 datasets 文件夹下有 `__init__.py` 文件，并且在 jupyter 中加入了 `sys` 导入当前目录。

在 jupyter 中可以看到测试的效果，给一张照片能够较为准确地找到要检测的目标。当然，这只是测试，那么我们如何利用数据训练对应的模型呢？

### 数据处理
首先要去[官网](http://host.robots.ox.ac.uk/pascal/VOC/voc2007/)下载 Pascal VOC 2007 数据，然后将该数据转换成 TensorFlow 能够处理 TF-Records 格式，在项目根目录下创建 tfrecords 文件夹，然后对应到你存放下载好的 voc2007 数据集的地址：
```shell
DATASET_DIR=./VOC2007/
OUTPUT_DIR=./tfrecords
python tf_convert_data.py \
    --dataset_name=pascalvoc \
    --dataset_dir=${DATASET_DIR} \
    --output_name=voc_2007_train \
    --output_dir=${OUTPUT_DIR}
```

这里指的注意的是，我们要训练自己的数据集的话，首先也要将数据整理成 Pascal VOC 2007 的格式。

> * Annotations  
> * ImageSets  
> * JPEGImages  
> * SegmentationClass 
> * SegmentationObject

train 和 val 共5012 张图片，看了下其中的图片，发现大小是不一样的，而且是已经标注好的。可以看到通过转换，将所有 jpg 格式的图片都转换成 TensorFlow 中的 tf-records 类型的数据：

![-w603](/img/media/15451909983753.jpg)

想用一下命令来测试下 Pascal VOC 2007 的模型：
```shell
DATASET_DIR=./tfrecords
EVAL_DIR=./logs/
CHECKPOINT_PATH=./checkpoints/VGG_VOC0712_SSD_300x300_ft_iter_120000.ckpt
python eval_ssd_network.py \
    --eval_dir=${EVAL_DIR} \
    --dataset_dir=${DATASET_DIR} \
    --dataset_name=pascalvoc_2007 \
    --dataset_split_name=test \
    --model_name=ssd_300_vgg \
    --checkpoint_path=${CHECKPOINT_PATH} \
    --batch_size=1
```

报了一下错误：
```shell
ValueError: No data files found in ./tfrecords/voc_2007_test_*.tfrecord
```

得去 [Pascal VOC 官网](http://host.robots.ox.ac.uk/pascal/VOC/voc2007/)再下载测试的数据，按上述流程将测试数据也转换成 tf-records 格式：

```shell
DATASET_DIR=./VOC2007/test/
OUTPUT_DIR=./tfrecords
python tf_convert_data.py \
    --dataset_name=pascalvoc \
    --dataset_dir=${DATASET_DIR} \
    --output_name=voc_2007_test \
    --output_dir=${OUTPUT_DIR}
```

接着又报了一个错误：

```shell
Traceback (most recent call last):
  File "eval_ssd_network.py", line 346, in <module>
    tf.app.run()
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/platform/app.py", line 125, in run
    _sys.exit(main(argv))
  File "eval_ssd_network.py", line 240, in main
    tp_fp_metric = tfe.streaming_tp_fp_arrays(num_gbboxes, tp, fp, rscores)
  File "/home/binli/SSD-Tensorflow/tf_extended/metrics.py", line 151, in streaming_tp_fp_arrays
    name=scope)
  File "/home/binli/SSD-Tensorflow/tf_extended/metrics.py", line 178, in streaming_tp_fp_arrays
    v_nobjects = _create_local('v_num_gbboxes', shape=[], dtype=tf.int64)
  File "/home/binli/SSD-Tensorflow/tf_extended/metrics.py", line 56, in _create_local
    validate_shape=validate_shape)
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/ops/variables.py", line 185, in __call__
    return cls._variable_v2_call(*args, **kwargs)
TypeError: _variable_v2_call() got an unexpected keyword argument 'collections'
```
降级 conda 中的 TensorFlow 到1.6版本后：
```shell
conda install tensorflow-1.6.0-py27_0.tar.bz2
```
又冒出错误：
```shell
Traceback (most recent call last):
  File "eval_ssd_network.py", line 346, in <module>
    tf.app.run()
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/platform/app.py", line 126, in run
    _sys.exit(main(argv))
  File "eval_ssd_network.py", line 320, in main
    session_config=config)
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/contrib/slim/python/slim/evaluation.py", line 212, in evaluate_once
    config=session_config)
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/training/evaluation.py", line 188, in _evaluate_once
    eval_step_value = _get_latest_eval_step_value(eval_ops)
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/training/evaluation.py", line 76, in _get_latest_eval_step_value
    with ops.control_dependencies(update_ops):
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/framework/ops.py", line 4746, in control_dependencies
    return get_default_graph().control_dependencies(control_inputs)
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/framework/ops.py", line 4446, in control_dependencies
    c = self.as_graph_element(c)
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/framework/ops.py", line 3459, in as_graph_element
    return self._as_graph_element_locked(obj, allow_tensor, allow_operation)
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/framework/ops.py", line 3548, in _as_graph_element_locked
    types_str))
TypeError: Can not convert a tuple into a Tensor or Operation.
```

然后做一下如下操作：
```python
# import
from compiler.ast import flatten

# change two eval_op
eval_op=list(names_to_updates.values()),
eval_op=flatten(list(names_to_updates.values())),
```

然后又报错了……
```shell
NotFoundError (see above for traceback): Unsuccessful TensorSliceReader constructor: Failed to find any matching files for ./checkpoints/VGG_VOC0712_SSD_300x300_ft_iter_120000.ckpt
	 [[Node: save/RestoreV2 = RestoreV2[dtypes=[DT_INT64, DT_FLOAT, DT_FLOAT, DT_FLOAT, DT_FLOAT, ..., DT_FLOAT, DT_FLOAT, DT_FLOAT, DT_FLOAT, DT_FLOAT], _device="/job:localhost/replica:0/task:0/device:CPU:0"](_arg_save/Const_0_0, save/RestoreV2/tensor_names, save/RestoreV2/shape_and_slices)]]
```

这要就我们把 VGG_VOC0712_SSD_300x300_ft_iter_120000.ckpt.zip 解压出来的两个文件放到一个名叫 `VGG_VOC0712_SSD_300x300_ft_iter_120000.ckpt` 的文件夹里，并至于 checkpoints 文件夹下。
```shell
CHECKPOINT_PATH=./checkpoints/VGG_VOC0712_SSD_300x300_ft_iter_120000.ckpt
python eval_ssd_network.py \
    --eval_dir=${EVAL_DIR} \
    --dataset_dir=${DATASET_DIR} \
    --dataset_name=pascalvoc_2007 \
    --dataset_split_name=test \
    --model_name=ssd_300_vgg \
    --checkpoint_path=${CHECKPOINT_PATH} \
    --batch_size=1
```

然后终于可以测试了🤣。

蓝鹅，太天真了，跑出了 mAP 后果然又报错了：
```shell
Traceback (most recent call last):
  File "eval_ssd_network.py", line 346, in <module>
    tf.app.run()
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/platform/app.py", line 126, in run
    _sys.exit(main(argv))
  File "eval_ssd_network.py", line 320, in main
    session_config=config)
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/contrib/slim/python/slim/evaluation.py", line 212, in evaluate_once
    config=session_config)
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/training/evaluation.py", line 212, in _evaluate_once
    session.run(eval_ops, feed_dict)
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/training/monitored_session.py", line 658, in __exit__
    self._close_internal(exception_type)
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/training/monitored_session.py", line 690, in _close_internal
    h.end(self._coordinated_creator.tf_sess)
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/contrib/training/python/training/evaluation.py", line 311, in end
    summary_str = session.run(self._summary_op, self._feed_dict)
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/client/session.py", line 905, in run
    run_metadata_ptr)
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/client/session.py", line 1137, in _run
    feed_dict_tensor, options, run_metadata)
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/client/session.py", line 1355, in _do_run
    options, run_metadata)
  File "/home/binli/anaconda2/envs/py2/lib/python2.7/site-packages/tensorflow/python/client/session.py", line 1374, in _do_call
    raise type(e)(node_def, op, message)
tensorflow.python.framework.errors_impl.InvalidArgumentError: Duplicate tag ssd_losses/cross_entropy_pos/value_1 found in summary inputs
	 [[Node: Merge/MergeSummary = MergeSummary[N=93, _device="/job:localhost/replica:0/task:0/device:CPU:0"](pascalvoc_2007_data_provider/parallel_read/filenames/fraction_of_32_full, pascalvoc_2007_data_provider/parallel_read/fraction_of_2_full, batch/fraction_of_5_full, ssd_losses/cross_entropy_pos/value_1, ssd_losses/cross_entropy_pos/value_1, ssd_losses/localization/value_1, ssd_losses/localization/value_1, ssd_losses/cross_entropy_neg/value_1, ssd_losses/cross_entropy_neg/value_1, AP_VOC07/1, AP_VOC07/1, AP_VOC12/1, AP_VOC12/1, AP_VOC07/2, AP_VOC07/2, AP_VOC12/2, AP_VOC12/2, AP_VOC07/3, AP_VOC07/3, AP_VOC12/3, AP_VOC12/3, AP_VOC07/4, AP_VOC07/4, AP_VOC12/4, AP_VOC12/4, AP_VOC07/5, AP_VOC07/5, AP_VOC12/5, AP_VOC12/5, AP_VOC07/6, AP_VOC07/6, AP_VOC12/6, AP_VOC12/6, AP_VOC07/7, AP_VOC07/7, AP_VOC12/7, AP_VOC12/7, AP_VOC07/8, AP_VOC07/8, AP_VOC12/8, AP_VOC12/8, AP_VOC07/9, AP_VOC07/9, AP_VOC12/9, AP_VOC12/9, AP_VOC07/10, AP_VOC07/10, AP_VOC12/10, AP_VOC12/10, AP_VOC07/11, AP_VOC07/11, AP_VOC12/11, AP_VOC12/11, AP_VOC07/12, AP_VOC07/12, AP_VOC12/12, AP_VOC12/12, AP_VOC07/13, AP_VOC07/13, AP_VOC12/13, AP_VOC12/13, AP_VOC07/14, AP_VOC07/14, AP_VOC12/14, AP_VOC12/14, AP_VOC07/15, AP_VOC07/15, AP_VOC12/15, AP_VOC12/15, AP_VOC07/16, AP_VOC07/16, AP_VOC12/16, AP_VOC12/16, AP_VOC07/17, AP_VOC07/17, AP_VOC12/17, AP_VOC12/17, AP_VOC07/18, AP_VOC07/18, AP_VOC12/18, AP_VOC12/18, AP_VOC07/19, AP_VOC07/19, AP_VOC12/19, AP_VOC12/19, AP_VOC07/20, AP_VOC07/20, AP_VOC12/20, AP_VOC12/20, AP_VOC07/mAP, Print, AP_VOC12/mAP, Print_1)]]
```
暂且先不管了吧，用自己的数据出问题了再说……😓

### 模型训练
#### Fine-tuning existing SSD checkpoints
```shell
DATASET_DIR=./tfrecords
TRAIN_DIR=./logs/
CHECKPOINT_PATH=./checkpoints/ssd_300_vgg.ckpt
python train_ssd_network.py \
    --train_dir=${TRAIN_DIR} \
    --dataset_dir=${DATASET_DIR} \
    --dataset_name=pascalvoc_2012 \
    --dataset_split_name=train \
    --model_name=ssd_300_vgg \
    --checkpoint_path=${CHECKPOINT_PATH} \
    --save_summaries_secs=60 \
    --save_interval_secs=600 \
    --weight_decay=0.0005 \
    --optimizer=adam \
    --learning_rate=0.001 \
    --batch_size=32
```

如果想训练自己的模型，即从头开始训练的话，就取消 CHECKPOINT_PATH 的设置即可。

```python
DATASET_DIR=./tfrecords
TRAIN_DIR=./logs/
python train_ssd_network.py \
    --train_dir=${TRAIN_DIR} \
    --dataset_dir=${DATASET_DIR} \
    --dataset_name=pascalvoc_2007 \
    --dataset_split_name=train \
    --model_name=ssd_300_vgg \
    --save_summaries_secs=60 \
    --save_interval_secs=600 \
    --weight_decay=0.0005 \
    --optimizer=adam \
    --learning_rate=0.001 \
    --batch_size=32
```

nvcc 和 nvdia-smi 都搞定后，跑 train 的命令行，又出现了错误：
```shell
tensorflow.python.framework.errors_impl.InvalidArgumentError: Default MaxPoolingOp only supports NHWC on device type CPU
```

## 利用自己的数据进行训练
### 转化数据
数据放在了 DATASET数据放在了 DATASET_DIR=/mnt/archive/binli/oil_thermostat/ 中，首先将数据重命名，然后划分出训练集、验证集和测试集。



Mac 上如何关掉这个端口呢？
```shell
sudo lsof -nPi :yourPortNumber
# then
sudo kill -9 yourPIDnumber
```

`nvidia-smi` 是由 cuda 和驱动提供的，于是就要对应的找资源尝试安装 cuda_10.0.130_410.48_linux.run 和 NVIDIA-Linux-x86_64-410.78.run。

结果又报错了，提示没有装 gcc，于是下了 gcc-4.8.5-7.tar.bz2 用 conda 离线安装，报如下错误：

```shell
Can't install the gcc package unless your system has crtXXX.o.
```

因为服务器没联网总是用离线包装，老出问题，然后想办法连上了网，重装了系统的 gcc 就 OK 了。

然后开始装 cuda 的驱动，后一个其实可以不用装，头一个上已经囊括了。装好了要手动配置下路径：

```shell
export PATH=$PATH:/usr/local/cuda-10.0/bin
export CUDADIR=/usr/local/cuda-10.0
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/cuda-10.0/lib64
```

然后就可以用 `nvcc` 和 `nvdia-smi` 来测试下环境和驱动有没有装好。


### 基于自己的数据训练模型
#### 数据转化成 PasalVOC 数据格式
首先第一步是建立好文件夹：

> * Annotations  
> * ImageSets  
> * JPEGImages  
> * SegmentationClass 
> * SegmentationObject

**1、重命名**

然后要对文件名进行重命名，xml 和 jpg 文件名字要对应上，图省事就直接用了现成的代码：
```python
import os  
      
class BatchRename():  
      
        def __init__(self):  

            self.path = '../'  
            self.type = '.jpg'
      
        def rename(self):  
            filelist = os.listdir(self.path)  
            total_num = len(filelist)  
            i = 1  
            n = 6  
            for item in filelist:  
                if item.endswith(self.type):  
                    n = 6 - len(str(i))  
                    src = os.path.join(os.path.abspath(self.path), item)  
                    dst = os.path.join(os.path.abspath(self.path), str(0)*n + str(i) + self.type)  
                    try:  
                        os.rename(src, dst)  
                        print 'converting %s to %s ...' % (src, dst)  
                        i = i + 1  
                  
                    except:  
                        continue  
            print 'total %d to rename & converted %d jpgs' % (total_num, i)  
      
if __name__ == '__main__':  
        demo = BatchRename()  
        demo.rename()  
```

重命名需要注意的是，最好在所有的 xml 和 jpg 都在同 一个文件夹里的时候进行重命名操作。

**2、划分数据**

因为已经标记好了数据，接下来就是要生成对应的训练验证数据的文件，方便模型找到对应的文件：

```python
import os  
import random   
  
xmlfilepath=r'/Users/Bin/Downloads/oil/Annotations'  
ImageSetsPath=r"/Users/Bin/Downloads/oil/ImageSets/"  
  
trainval_percent=0.7 
train_percent=0.7  
total_xml = os.listdir(xmlfilepath)  
num=len(total_xml)    
list=range(num)    
tv=int(num*trainval_percent)    
tr=int(tv*train_percent)    
trainval= random.sample(list,tv)    
train=random.sample(trainval,tr)    
  
print("train and val size",tv)  
print("train size",tr)  
ftrainval = open(os.path.join(ImageSetsPath,'Main/trainval.txt'), 'w')    
ftest = open(os.path.join(ImageSetsPath,'Main/test.txt'), 'w')    
ftrain = open(os.path.join(ImageSetsPath,'Main/train.txt'), 'w')    
fval = open(os.path.join(ImageSetsPath,'Main/val.txt'), 'w')    
  
for i  in list:    
    name=total_xml[i][:-4]+'\n'    
    if i in trainval:    
        ftrainval.write(name)    
        if i in train:    
            ftrain.write(name)    
        else:    
            fval.write(name)    
    else:    
        ftest.write(name)    
    
ftrainval.close()    
ftrain.close()    
fval.close()    
ftest .close() 
```

3、修改文件

**修改 /datasets/pascalvoc_common.py 文件**

修改类别，改成自己数据的类别：

```python
# before
# VOC_LABELS = {
#     'none': (0, 'Background'),
#     'aeroplane': (1, 'Vehicle'),
#     'bicycle': (2, 'Vehicle'),
#     'bird': (3, 'Animal'),
#     'boat': (4, 'Vehicle'),
#     'bottle': (5, 'Indoor'),
#     'bus': (6, 'Vehicle'),
#     'car': (7, 'Vehicle'),
#     'cat': (8, 'Animal'),
#     'chair': (9, 'Indoor'),
#     'cow': (10, 'Animal'),
#     'diningtable': (11, 'Indoor'),
#     'dog': (12, 'Animal'),
#     'horse': (13, 'Animal'),
#     'motorbike': (14, 'Vehicle'),
#     'person': (15, 'Person'),
#     'pottedplant': (16, 'Indoor'),
#     'sheep': (17, 'Animal'),
#     'sofa': (18, 'Indoor'),
#     'train': (19, 'Vehicle'),
#     'tvmonitor': (20, 'Indoor'),
# }

# after changing
VOC_LABELS = {
    'none': (0, 'Background'),
    'oil_thermostat': (1, 'oil_thermostat'),
    'white_indicator': (2, 'indicator'),
    'red_indicator': (3, 'indicator')
}
```

**修改 datasets/pascalvoc_to_tfrecords.py 文件**

修改 83、84 行，图片类型以及文件格式。
```python
# Read the image file.
    filename = directory + DIRECTORY_IMAGES + name + '.jpg'
    image_data = tf.gfile.FastGFile(filename, 'rb').read()
```

然后在 67 行可以修改转换之后每一个 tfrecoard 文件对应多少张图片：
```python
# TFRecords convertion parameters.
RANDOM_SEED = 4242
SAMPLES_PER_FILES = 100
```

**修改 nets/ssd_vgg_300.py  文件**

95 和 96 行的类别个数按照自己数据的情况来做修改，大小为类别＋1：
```python
# before
# num_classes=21,
# no_annotation_label=21,
# change to 4
```

**修改 ./train_ssd_network.py 文件**

 对应地修改训练配置，包括迭代次数(154行)，batch 大小，GPU 用量等。

**修改 ./eval_ssd_network.py 类别个数**



**修改 datasets/pascalvoc_2007.py 配置**

```python
TRAIN_STATISTICS = {
'none': (0, 0),
'pantograph': (1000, 1000),
}
TEST_STATISTICS = {
'none': (0, 0),
'pantograph': (1000, 1000),
}
SPLITS_TO_SIZES = {
'train': 500,
'test': 500,
}
```

4、训练

不要用 checkpoint 就可以从头开始训练了。

```
DATASET_DIR=./tfrecords
TRAIN_DIR=./logs/
python train_ssd_network.py \
    --train_dir=${TRAIN_DIR} \
    --dataset_dir=${DATASET_DIR} \
    --dataset_name=pascalvoc_2007 \
    --dataset_split_name=train \
    --model_name=ssd_300_vgg \
    --save_summaries_secs=60 \
    --save_interval_secs=600 \
    --weight_decay=0.0005 \
    --optimizer=adam \
    --learning_rate=0.001 \
    --batch_size=32
```


5、测试
```shell
DataLossError: Unable to open table file ../checkpoints/model.ckpt-2938.ckpt: Failed precondition: ../checkpoints/model.ckpt-2938.ckpt: perhaps your file is in a different file format and you need to use a different restore operator?
```

这个问题的解决很傻……只要去掉文件夹结尾的`.ckpt`就可以了，不需要新建一个文件夹。

然而继续运行的时候又出现了一个问题：
```shell
Cannot feed value of shape (1080, 1920, 4) for Tensor u'Placeholder_5:0', which has shape '(?, ?, 3)'
```
发现原来是读 png 图片有四个通道，除了 RGB 还有一个 alpha 通道，在 jupyter 上做下面的修改：
```python
if len(img.shape) > 2 and img.shape[2] == 4:
    #convert the image from RGBA2RGB
    img = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)
```
此时虽然没有报错了，但是跑出来的结果是根本没有结果，丫根本没有检测🤷‍♀️！猜想可能是因为训练的程度不够，毕竟只用了5000轮迭代，于是想改成五万试一下，结果准备试的时候就报了 OOM 的错误，原来是因为开了一个 jupyter 测试训练好的模型就内存告急了，一张卡真是可怜，当然也可以减少一点 batch size 的量，耗时点。

一遍测试不到结果可以增加迭代次数同时降低 learning rate 试一下，昨晚试了下迭代次数调到五万，震荡得比较厉害，结果仍然检测不到，早上来又试了下降低 lr 试下，依然不行，后来终于找到问题之所在了……

```python
rclasses, rscores, rbboxes = process_image(img, select_threshold=0.2)
```

这里可以在 tensorboard 上查看 loss 的变化：
```python
tensorboard --logdir=./logs --port=9998
```

重新尝试训练表盘类的识别时，在测试训练好的模型时又有报错：

```python
InvalidArgumentError (see above for traceback): Assign requires shapes of both tensors to match. lhs shape= [8] rhs shape= [12]
```

这个解决办法居然是在训练模型时设定参数要加上 num_classes，怀疑是在某处修改时没有改全：

```python
python train_ssd_network.py \
--train_dir=./logs/ \
--dataset_dir=./tfrecords \
--dataset_name=pascalvoc_2007 \
--dataset_split_name=train \
--model_name=ssd_300_vgg \
--save_summaries_secs=60 \
--save_interval_secs=600 \
--weight_decay=0.0005 \
--optimizer=adam \
--learning_rate=0.001 \
--batch_size=32 \
--ignore_missing_vars=True \
--num_classes=2 \
--checkpoint_exclude_scopes=ssd_300_vgg/conv6,ssd_300_vgg/conv7,ssd_300_vgg/block8,ssd_300_vgg/block9,ssd_300_vgg/block10,ssd_300_vgg/block11,ssd_300_vgg/ block4_box,ssd_300_vgg/block7_box,ssd_300_vgg/block8_box,ssd_300_vgg/block9_box,ssd_300_vgg/block10_box,ssd_300_vgg/block11_box
```

使用 batch_size = 2，好像震荡很厉害？！但是结果却异常的好，震荡不震荡，还是要用 tensorboard 看。数据量比较小时还是要用比较小的 batch_size。


![image-20190315194152295](/img/media/image-20190315194152295.png)

## 优化
直接通过标注数据识别表盘和指针效果非常差，因为图片比较少，结果是画出的图置信度很小，而且框很小，处于乱框的状态。

于是重新训练模型，单独识别表盘，发现识别表盘的准确率极高，基本上接近于1。于是继续重新训练模型，单独识别指针，发现纯指针的识别率很低。那么我就想到通过在识别率接近 1 的表盘的基础上截下表盘局部的图来，在此基础上再来训练识别指针的结果，结果发现虽然置信度不是很高，但是基本上还是能框住指针的。

效果：绝对误差不超过正负4，误差均方根大概1.87。

### Recording
import matplotlib.image as mpimg
用 mpimg.imsave 比用 cv2.imwrite 存的图片效果好很多！。

## References

1. [Single Shot MultiBox Detector (SSD) and Implement It in Pytorch](https://medium.com/@smallfishbigsea/understand-ssd-and-implement-your-own-caa3232cd6ad)
2. [A guide to receptive field arithmetic for Convolutional Neural Networks](https://medium.com/mlreview/a-guide-to-receptive-field-arithmetic-for-convolutional-neural-networks-e0f514068807)
3. [Faster R-CNN Explained](https://medium.com/@smallfishbigsea/faster-r-cnn-explained-864d4fb7e3f8)
4. [Preparing Inputs](https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/using_your_own_dataset.md)
5. [Face Detection for CCTV surveillance](https://blog.usejournal.com/face-detection-for-cctv-surveillance-6b8851ca3751)
6. [Tensorflow-SSD测试及训练自己的数据集](https://blog.csdn.net/ei1990/article/details/75282855)
7. [SSD Tensorflow 训练测试自己的数据集 Jupiter notebook 显示训练结果](https://blog.csdn.net/Echo_Harrington/article/details/81131441)
