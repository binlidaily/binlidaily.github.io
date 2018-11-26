---
layout: post
title: Data Preprocessing
subtitle:
author: Bin Li
tags: [Machine Learning]
image: 
comments: true
published: false
---

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