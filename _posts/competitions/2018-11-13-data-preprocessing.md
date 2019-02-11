---
layout: post
title: Data Preprocessing
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: true
---

Data Preprocessing
Data preprocessing refers to the transformations applied to our data before feeding it to the algorithm.

Data Preprocessing is a technique that is used to convert the raw data into a clean data set. In other words, whenever the data is gathered from different sources it is collected in raw format which is not feasible for the analysis. there are plenty of steps for data preprocessing and we just listed some of them :

1. removing Target column (id)
2. Sampling (without replacement)
3. Dealing with Imbalanced Data
4. Introducing missing values and treating them (replacing by average values)
5. Noise filtering
6. Data discretization
7. Normalization and standardization
8. PCA analysis
9. Feature selection (filter, embedded, wrapper)
 
## Meet and Greet Data
### Take a look
We can use take a look at first 10 lines of data, or sample 10 lines of data randomly.

```python
# fixed output
data_df.head(10)
data_df.tail(10)

# random output
data_df.sample(10)
```

## Data Standardization

## Data Normalization
z-score

### Clean up rare values in a feature column
```python
stat_min = 10 #while small is arbitrary, we'll use the common minimum in statistics: http://nicholasjjackson.com/2012/03/08/sample-size-is-10-a-magic-number/
title_names = (data1['Title'].value_counts() < stat_min) #this will create a true false series with title name as index

#apply and lambda functions are quick and dirty code to find and replace with fewer lines of code: https://community.modeanalytics.com/python/tutorial/pandas-groupby-and-python-lambda-functions/
data1['Title'] = data1['Title'].apply(lambda x: 'Misc' if title_names.loc[x] == True else x)
```