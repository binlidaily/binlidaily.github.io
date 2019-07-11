---
layout: post
title: Outline of Algorithms
subtitle:
author: Bin Li
bigimg: /img/media/algoritms.png
tags: [Outline]
comments: true
published: true
---

In order to facilitate the search, I wrote this blog. I've collected all algorithms that I learned or want to learn in `Machine Learning`, `Deep Learning`, `Mathematics` and `Data Structure and Algorithms`. I hope I can improve my skills and knowledge in these area with writing the interpretation about these algorithms. 

{% include toc.html %}

## 1. Theoretical Machine Learning
### 1.1 Supervised Learning
* [Linear Regression](https://binlidaily.github.io/2018-06-03-linear-regression/)
    * [Locally Weighted Linear Regression](https://binlidaily.github.io/2019-01-16-lwlr-locally-weighted-linear-regression/)
    * [Bayesian Linear Regression](https://binlidaily.github.io/2019-05-29-bayesian-linear-regression/)
    * [Polynomial Regression](https://binlidaily.github.io/2019-01-16-polynomial-regression/)
    * [Ridge and Lasso Regression](https://binlidaily.github.io/2019-01-16-ridge-lasso/)
    * ElasticNet

* [Logistic Regression](https://binlidaily.github.io/2017-10-03-logistics-regression/)
* [Decision Tree](https://binlidaily.github.io/2018-09-11-decision-tree/)
    - [Decision Stump](https://binlidaily.github.io/2019-06-04-decision-stump/)
    - [Iterative Dichotomiser 3 (ID3)](https://binlidaily.github.io/2019-06-04-id3-iterative-dichotomiser-3/)
    - [C4.5 and C5.0](https://binlidaily.github.io/2019-06-04-C45/)
    * [Classification and Regression Tree (CART)](https://binlidaily.github.io/2019-06-04-cart-classification-and-regression-tree/)
    * [Random Forest = Bagging + Decision Tree](https://binlidaily.github.io/2018-12-11-random-forest/)
    * [Adaboost](https://binlidaily.github.io/2018-10-29-adaboost/)
    * [Boosting Tree](https://binlidaily.github.io/2019-06-10-boosting-tree)
    * [Gradient Boosting Machine (GBM)](https://binlidaily.github.io/2018-12-05-gbm-gradient-boosting-machine/)
    * [Gradient Boosting Decision Tree (GBDT) = Gradient Boosting + Decision Tree](https://binlidaily.github.io/2019-06-11-gbdt-gradient-boosting-decision-tree)
    * [XGBoost](https://binlidaily.github.io/2018-10-29-xgboost/)
    * [LightGBM](https://binlidaily.github.io/2019-07-05-lightgbm/)
    - Chi-squared Automatic Interaction Detection (CHAID)
    - M5
    - Conditional Decision Trees

* Perceptron
* [Neural Network](https://binlidaily.github.io/2018-10-29-neural-network/)
* Instance Based
    - K-Nearest Neighbor (KNN)
    - Learning Vector Quantization (LVQ)
    - Self-Organizing Map (SOM)
    - Locally Weighted Learning (LWL)

* Probabilistic Graphical Models
    * Bayesian Network (BN)
        * [Naive Bayes](https://binlidaily.github.io/2019-05-09-naive-bayes/)
        - Gaussian Naive Bayes
        - Multinomial Naive Bayes
        - Bayesian Belief Network (BBN)
        - [Expectation Maximization (EM)](https://binlidaily.github.io/2019-06-23-expectation-maximization)
    - Markov Network
        - Averaged One-Dependence Estimators (AODE)
        - Hidden Markov Models
        - Conditional Random Fields (CRFs)
* [Support Vector Machines](https://binlidaily.github.io/2019-01-10-support-vector-machines/)
* [Field-aware Factorization Machines (FFM)](https://binlidaily.github.io/2018-10-29-ffm-field-aware-factorization-machines/)

### 1.2 Unsupervised Learning
### 1.2.1 Clustering
* Prototype-based Clustering
    * [K-Means](https://binlidaily.github.io/2019-05-29-kmeans/)
    * Learning Vector Quantization (LVQ)
    * [Gaussian Mixed Model (GMM)](https://binlidaily.github.io/2019-06-23-gmm-gaussian-mixed-model)
* Density-based Clustering
    * DBSCAN
* Hierachical Clustering
    * AGNES
        * Single-linkage Clustering
        * Complete-linkage Clustering
        * Average-linkage Clustering
* [Expectation Maximization (EM)](https://binlidaily.github.io/2019-06-23-expectation-maximization)
* [Self-Organizing Map (SOM)](2019-06-23-som-self-organizing-map)
* K-Medians
* Latent Dirichlet Allocation (LDA)
* Fuzzy Clustering
* OPTICS algorithm
* Non-Negative Matrix Factorization
* Hierarchical Agglomerative Clustering (HAC)

### 1.2.2 Dimension Reduction / Distributed Representation
* Feature Selection
* [Principal Component Analysis (PCA)](https://binlidaily.github.io/2019-04-01-pca-principal-components-analysis)
* [Linear Discriminant Analysis (LDA)](https://binlidaily.github.io/2018-08-30-lda-linear-discriminant-analysis/)
* Independent Component Analysis (ICA)
* Manifold Learning
    * Isometric Mapping (Isomap)
    * Locally Linear Embedding (LLE)
* Locality Preserving Projection (LPP)
* Laplacian Eigenmaps

### 1.2.3 Generation


### 1.3 Ensemble Learning
- [Ensemble Learning](https://binlidaily.github.io/2019-02-08-ensembling-learning)
- [Logit Boost (Boosting)](https://binlidaily.github.io/2019-02-08-ensembling-learning)
- [Bootstrapped Aggregation (Bagging)](https://binlidaily.github.io/2019-02-08-ensembling-learning)
- [AdaBoost](https://binlidaily.github.io/2018-10-29-adaboost/)
- Stacked Generalization (blending)
- [Gradient Boosting Machines (GBM)](https://binlidaily.github.io/2018-12-05-gradient-boosting/)
- Gradient Boosted Regression Trees (GBRT)
- [Random Forest](https://binlidaily.github.io/2018-12-11-random-forest/)


### 1.4 Models
*  Model Evaluation
    * [Bias and Variance](https://binlidaily.github.io/2019-01-16-bias-variance/)
    * [Loss Functions & Metrics](https://binlidaily.github.io/2018-12-07-loss-functions/)
    * [Overfitting and Underfitting](https://binlidaily.github.io/2019-05-31-overfitting-underfitting/)

* Model Selection
    * Model Selection


## 2. Applied Machine Learning
* [Workflow of Machine Learning](https://binlidaily.github.io/2019-02-25-workflow-of-applying-ml-algorithms-offline-to-online/) 
* [Feature Engineering](https://binlidaily.github.io/2018-06-03-feature-engineering/)
    * [Feature Extraction](https://binlidaily.github.io/2019-06-13-feature-extraction)
        * [Data Preprocessing](https://binlidaily.github.io/2018-11-13-data-preprocessing/)
        * [Exploratory Data Analysis (EDA)](https://binlidaily.github.io/2019-01-10-exploratory-data-analysis/)

    * Feature Selection
        * [Feature Selection Methods](https://binlidaily.github.io/2018-06-03-feature-engineering/)
* Model Ensemble
    * [Model Ensemble Methods](https://binlidaily.github.io/2019-02-08-ensembling/)
* Model Optimization
    * [Model Optimization Methods](https://binlidaily.github.io/2019-02-25-model-optimization/)
    * [Result Analysis](https://binlidaily.github.io/2019-02-11-explain-the-result-of-models/)
    * [Bad Case Analysis](https://binlidaily.github.io/2019-03-11-bad-case-analysis/)
* Applied Models
    * [Click Models](https://binlidaily.github.io/2019-02-25-click-models/)
    * [Ranking Algorithms](https://binlidaily.github.io/2019-01-23-ranking-algorithms/)
* Coding
    * [Exploratory Data Analysis (EDA)](https://binlidaily.github.io/2019-06-24-eda-exploratory-data-analysis)
    * [Feature Engineering](https://binlidaily.github.io/2019-03-15-feature-engineering)
    * [Feature Selection](https://binlidaily.github.io/2019-03-16-feature-selection)
    * [Model Training](https://binlidaily.github.io/2019-03-15-model-training)

## 3. Deep Learning
* Computer Vision
    * Image Classification
        * [Convolutional Neural Networks (CNN)](https://binlidaily.github.io/2018-08-27-vgg-very-deep-convolutional-networks/)
        * [Very Deep Convolutional Networks (VGG)](https://binlidaily.github.io/2019-04-08-cnn-convolutional-neural-network/)

    * Object Location
        * [Non-Max Suppression](https://binlidaily.github.io/2019-06-26-non-max-suppression)

    * Object Detection
        * [Bounding Box Regression](https://binlidaily.github.io/2019-03-17-bounding-box-regression)
        * [Single Shot MultiBox Detector (SSD)](https://binlidaily.github.io/2019-01-19-ssd-single-shot-multibox-detector/)
    
    * Sequential Model
        * [Recurrent Neural Networks（RNN）](https://binlidaily.github.io/2019-04-12-rnn-recurrent-neural-network/)
        * [Long Short Term Memory networks（LSTM）](https://binlidaily.github.io/2019-04-12-lstm-long-short-term-memory-networks/)

* Speech Recognition
* 	Natural Language Processing


## 4. Mathematics
* Information Theory
    * [Entropy](https://binlidaily.github.io/2018-10-23-information-theory/)

* Optimization
    * [Gradient Descent](https://binlidaily.github.io/2018-04-24-gradient-descent/)
    * [Monte Carlo Method](https://binlidaily.github.io/2019-01-23-Monte-Carlo-method/)
    * [Singular Value Decomposition](https://binlidaily.github.io/2019-01-10-singular-value-decomposition/)
    * [Matrix Factorization](https://binlidaily.github.io/2019-01-10-matrix-factorization/)
    * [Newton Method](https://binlidaily.github.io/2018-12-27-newton-method/)

* Statistics
* [Normal Distribution](https://binlidaily.github.io/2019-01-23-normal-distribution/)


## References
1. [Sklearn User Guide](https://scikit-learn.org/stable/user_guide.html)