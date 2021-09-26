---
title: Hashes, maps, and lists
date: "2020-02-01T12:00:00.000Z"
description: |
    Notes on applications of linked lists, hash tables, and other graph structures.
    Provides some canonical references from the literature.
tags: ["algorithms", "data structures", "hash", "graph"]
citations:

  - authors: [van Emde Boas P]
    year: 1977
    title: |
      Preserving order in a forest in less than logarithmic time and linear space
    journal: Information Processing Letters
    volume: "6"
    pageRange: [80, 82]

  - authors: [Dietzfelbinger M, Karlin A, Mehlhorn K, Meyer auf der Heide F, Rohnert H, Tarjan RE]
    year: 1994
    title: |
      Dynamic perfect hashing: upper and lower bounds
    journal: SIAM Journal on Computing
    volume: "23"
    pageRange: [738, 761]

  - authors: [Fox EA, Heath LS, Chen QF, Daoud AM]
    year: 1992
    title: |
      Practical minimal perfect hash functions for large databases
    journal: CACM
    volume: "35(1)"
    pageRange: [105, 121]
---


## Linked lists

Linked lists have directed graph structures consisting of nodes containing a value and a reference to the next node. The final node has a `null` reference that signals the end of the structure. Implementation requires a `head` method or value that points to the start of the linked list, and a `tail` that points to the last member. If the list is empty, these are null. 

Linked lists can extend without resizing. Large and constantly changing data will make better use of linked lists compared to arrays, which fill or require costly extensions. Inserting and removing nodes does not require shifting or leaving empty spaces. Links may be stored separately from data, if they are kept the same size and order, and indices are used to point into the data. Indexing is O(n), insertion/deletion at an end is O(1) if the element is known, insertion/deletion in the middle is search + O(1), and wasted space is O(n). 

Linked lists are used to implement stacks and queues, and as entries in hash tables to store multiple values for each key.  For large number and polynomial arithmetic, the list stores tuples of coefficients and exponents that break the values up in memory. They can represent sparse matrices so that zero-value data are not stored. Values are referenced in two linked lists, for the rows and the column, and each node points to the next value in both i and j directions. 

The trade-offs are sequential access, and greater memory use than contiguous arrays. Variants try to overcome these limitations, or improve the strengths further.

Linked lists are often used invisibly under the hood. We kind of use them for analytics pipelines. 

### Variants

* Doubly-linked: implements bi-directional traversal, so each node usually references two neighbors. XOR-linking can reduce this to a single reference. Some operating systems use double linking to track running processes/threads. Malware like rootkits may hide by operating outside these housekeeping structures. They are also good for previous/next features in software products like image viewers, web browsers, and music apps. 

* Multiply-linked: like doubly-linked, these organize data in a different way, such as sorting by properties. 

* Circular: tail connects to head. They may have just a tail, from which the head is inferred. These are good for cycling through processes in a computer, or implementing a Fibonacci Heap. 

* Unrolled: store multiple elements per node to improve caching, and reduce wasted space from pointers. These are similar to B-trees. 

* Self-organizing: frequently accessed nodes moved closer to the head for faster access. Compilers and LFU caches use this optimization. Nodes are promoted by swapping accessed nodes with a neighbor. Nodes may move-to-front (MTF) on every access, or track access, and are re-ordered when a condition is met. 


## Hash table

Hash tables (often called hash maps, or dictionaries) use hashing functions to map an index value to a bucket of values. On average these are faster than trees, which is why this is a common data structure in language standard libraries. If all values are known in advance, you can optimize hashing function.

As long as the hash function generates a uniform distribution search, insert, and delete operations are O(1), with O(n) worst case. The space complexity is O(n).

A linked list is often used as the entry, and may have the head stored in the bucket to reduce pointer follows. Above load factor (keys/slots) 10 use balanced search trees for accessing data.

We use hash tables extensively in attaching data to a mesh and grid structures. In these cases the index is a tuple of indices, and these access information about neighbor relations and memoized intermediate calculations.


### Variants

* Separate chaining: keys point to a list of values, usually with 0-1 entries. This works best when the bucket array can be pre-allocated to prevent resizing operations. 

* Cuckoo hashing: constant worst case lookup time

* Self-balancing search tree: reduce worst case to O(logn), used by Java8 HashMap


## Other stuff

There are so, so many other options and combinations. Useful types for distributed data systems include: [distributed hash tables](https://blog.keep.network/distributed-hash-tables-49721094403d), prefix hash trees, [minimum perfect hash functions](http://iswsa.acm.org/mphf/index.html), and LRU caches. 