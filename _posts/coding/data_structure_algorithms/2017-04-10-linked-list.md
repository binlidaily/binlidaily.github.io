---
layout: post
title: Linked List
subtitle: 链表
author: Bin Li
tags: [Machine Learning]
comments: true
published: true
---


链表作为算法中非常重要的数据结构，在面试中也是非常常用的。



## 链表相关面试题

### 如何判断一个链表中存在环？同时如何判断环的入口处？

```c++
//
// Created by Bin on 3/28/2017.
//

#include <iostream>
using namespace std;

struct Node{
    int data;
    Node* next;
};

class LinkedList{
//    // Struct inside the class LinkedList
//    // This is one node which is not needed by the caller. It is just
//    // for internal work.
//    struct Node {
//        int data;
//        Node *next;
//    };

    // public member
public:
    //constructor
    LinkedList(){
        head = NULL; // set head to NULL
    }

    // This prepends a new value at the beginning of the list
    void addValue(int val){
        Node* n = new Node();   // create new Node
        n->data = val;    // set value
        n->next = head;     // make the node point to the next node.
                            // if the list is empty, this is NULL, so the end of the list-->OK
                            // last but not least, make the head point at the new node.
        head = n;
    }

    // returns the first elements in the list and deletes the Node
    // caution, no error-checking here!
    // the node in Class doesn't be deleted to free memory?
    int popValue(){
        Node* n = head;
        int ret = n->data;

        head = head->next;
        delete n;
        return ret;
    }

    // testing
    Node* getNode(){
        return head;
    }

private:
    Node* head; // this is the private member variable. It is just a pointer to the first Node
};


// reverse of linked list
Node* reverseByLoop(Node* head){
    if(head == NULL || head->next == NULL){
        return head;
    }
    // temporary variances
    Node * pre = NULL;
    Node * next = NULL;

    while(head != NULL){
        next = head->next;

        head->next = pre;
        pre = head;
        head = next;
    }
    return pre;
}
// 第一个条件是判断异常，第二个条件是结束判断
    // error detection for the first condition, end decision for the second condition

Node* reverseByRecursion(Node* head){
    
    if(head == NULL || head->next == NULL){
        return head;
    }

    Node* newHead = reverseByRecursion(head->next);

    head->next->next = head;
    head->next = NULL;

    return newHead;
}

void output(Node* head){
    if(head == NULL){
        cout << "Node is empty!" << endl;
    }
    Node* next = head;
    do{
        cout << next->data << endl;
        next = next->next;
    }
    while(next != NULL);
}


int main(){
    LinkedList list;

    list.addValue(5);
    list.addValue(10);
    list.addValue(20);

//    output(list.getNode());
//    cout << "After reversing!" << endl;
//    output(reverseByLoop(list.getNode()));
//    output(reverseByRecursion(list.getNode()));


//    cout << list.popValue() << endl;
//    cout << list.popValue() << endl;
//    cout << list.popValue() << endl;


    return 0;
}
```

