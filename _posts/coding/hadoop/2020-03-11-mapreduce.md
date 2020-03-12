---
layout: post
title: Learn MapReduce From Scratch
subtitle:
author: Bin Li
tags: [Coding]
image: 
comments: true
published: true
---

MapReduce 程序 5 个阶段：
1. input
2. map
3. shuffle
4. reduce
5. output

shuffle 过程实现的功能：
1. 分区
    * 确定当前的 Key 交给哪个 reduce 进行处理
    * 相同的 key，必须由一个 reduce 进行处理
    * 默认情况：根据 key 的 hash 值，对 reduce 个数取余
2. 分组
    * 将相同 Key 的 value 进行合并
    * key 相等的话，将分到同一个组里
    * MapReduce 阶段，一行调用一次 map 方法，一中 key调用一次 reduce
3. 排序 
    * 按照 key 的字典顺序进行排序

详细的过程：
1. map 端的 shuffle
    1. spill：溢写
        1. 每一个 map 处理之后的结果进入环形缓冲区（内存区域，100M）
        2. 分区：对每一条 key 和 value 进行分区（打标签）
            * hadoop 1 reduce0
            * hive 1 reduce1
            * spark 1 reduce1
            * hbase 1 reduce1
            * hadoop 1 reduce0
        3. 排序：将相同分区的数据进行分区内排序
            * hadoop 1 reduce0
            * hadoop 1 reduce0
            * hbase 1 reduce1
            * hive 1 reduce1
            * spark 1 reduce1
        4. 当环形缓冲区达到阈值 80%，开始溢写
            1. 将分区排序后的数据溢写到磁盘变成文件 file1
            2. 最终会产生多个小文件
    2. merge：合并，将 spill 生成的小文件进行合并
    3. map task 结束，通知 appmaster，appmaster 来拉取数据
2. reduce端的 shuffle
    1. reduce 启动多个线程，通过网络到没台机器上拉取属于自己分区的数据
    2. merge 合并：将每个 maptask 的结果中属于自己分区的数据进行合并
        1. 排序：将自己分区进行排序
    3. 分组：对相同的 key 的 value 进行合并
3. Shuffle 的优化
    1. combiner
    2. compress


　　MapReduce 程序 5 个阶段：
1. Input：可以从 HDFS 从读取数据
2. Map：映射，负责数据的过滤和分法，将原始数据化为键值对
3. Shuffle：为了让 Reduce 可以并行处理 Map 的结果，需要对 Map 的输出进行一定的排序和分割，再交给对应的 Reduce，这个过程就是 shuffle
    1. Shuffle 过程包含在 Map 和 Reduce 两端，即 Map shuffle 和 Reduce shuffle
4. Reduce：合并，将具有相同 key 值的 value 进行处理后再输出新的键值对作为最终结果。
5. Output：可以存入 HDFS 系统

mapreduce中的combiner 和partition的区别
1. Combiner就是在map端先进行一次reduce操作，减少map端到reduce端的数据传输量，节省网络带宽，提高执行效率。
2. Partition就是将map输出按key分区，送到不同的reduce上去并行执行，提高效率。







![](/img/media/15839193978891.jpg)

## 1. Map 阶段
　　Map 阶段主要负责读入原始数据中的一部分，由多个 mapper 共同完成数据的读入和处理工作，将原始数据转换成键值对的形式；接着通过 Map Shuffle 阶段将 Map 阶段得到的键值对数据进行分区、排序、分割，然后将属于同一划分（分区）的输出合并到一起并写到磁盘或者内存中，最终得到一个分区有序的文件。

　　Map 函数一般需要我们自己定义，以完成我们需要的化简、合并操作。Map 函数开始生产输出时，并不是简单将其写到磁盘，会利用缓冲的方式写到内存并处于效率的考虑进行预排序。

　　每个 Map 任务都有一个环形内存缓冲区用于存储任务输出。

![](/img/media/15839871835965.jpg)

### 1.1 Map Shuffle
　　Map Shuffle 的过程如下：
1. Map 的键值对数据先存到环形缓冲区
2. 环形缓冲区容量达到阈值后开始溢写，进行分区、排序、写入磁盘成文件
3. 将 Map 端的文件进行融合

![](/img/media/15839942655617.jpg)


### .1 环形缓冲区
　　缓冲区的作用是批量收集 Map 的键值对结果，减少磁盘 IO 的影响，因为缓存区输入内存，速度较与磁盘通讯快。我们的key/value对以及Partition的结果都会被写入缓冲区。当然写入之前，key与value值都会被序列化成字节数组。 

　　这里需要注意一下是先进入环形缓冲区还是先分区？

　　分区（Partition）的操作，系统对于 Map 输出的每一个键值对，系统都会给定一个Partition，Partition 值默认是通过计算 key 的 hash 值后对 Reduce task 的数量取模获得。如果一个键值对的 partition 值为1，意味着这个键值对会交给第一个Reducer处理。

　　排序（Sort）先把 Kvbuffer 中的数据按照 partition 值和 key 两个关键字升序排序，移动的只是索引数据，排序结果是 Kvmeta 中数据按照 partition 为单位聚集在一起，同一 partition 内的按照 key 有序。

　　溢写（Spill）将数据按照分区写到对应的磁盘文件。

　　合并（Merge）过程将文件合并成一个文件，如下图所示。

![](/img/media/15839953507634.jpg)


## 2. Reduce 阶段
　　Reduce 阶段将从不同 Map 阶段的机器那里复制数据，然后进行数据的合并排序。

### Reduce Shuffle
　　Reduce Shuffle 过程就是复制和合并排序两个部分的展开。首先通过网络将数据从 Map 端复制到本地来。然后将复制过来说的数据放入到内存缓冲区中，如果内存缓冲区能放得下这次复制的数据就直接在内存中，即内存到内存 Merge。

　　Reduce要向每个Map去拖取数据，在内存中每个Map对应一块数据，当内存缓存区中存储的Map数据占用空间达到一定程度的时候，开始启动内存中merge，把内存中的数据merge输出到磁盘上一个文件中，即内存到磁盘merge。

　　当属于该reducer的map输出全部拷贝完成，则会在reducer上生成多个文件（如果拖取的所有map数据总量都没有内存缓冲区，则数据就只存在于内存中），这时开始执行合并操作，即磁盘到磁盘merge，Map的输出数据已经是有序的，Merge进行一次合并排序，所谓Reduce端的sort过程就是这个合并的过程。一般Reduce是一边copy一边sort，即copy和sort两个阶段是重叠而不是完全分开的。最终Reduce shuffle过程会输出一个整体有序的数据块。

## References
1. [MapReduce shuffle 过程详解](https://blog.csdn.net/u014374284/article/details/49205885)
2. [Shuffle工作机制](https://blog.csdn.net/rickiyeat/article/details/54015509)
3. [MapReduce之Shuffle过程详述](https://matt33.com/2016/03/02/hadoop-shuffle/)