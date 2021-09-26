---
title: Neural networks
date: "2020-02-27T00:47:00.000Z"
description: |
    A quick note about implementing neural networks with back- and counter-progation,
    and what they can be used for.
tags: ["machine learning", "algorithms", "shade", "propagation"]
citations:

  - authors: [Blum A]
    year: 1992
    title: |
        Neural networks in C++

  - authors: [Hebb DO]
    year: 1949
    title: |
        The organization of behavior; a neuropsychological theory

  - authors: [Hecht-Nielsen R]
    year: 1987
    title: |
        Counterpropagation networks
    journal: Applied Optics
    volume: "26"
    pageRange: [4979, 4984]

  - authors: [Kosko B]
    year: 1988
    title: |
        Bidirectional associative memories. 
    journal: IEEE Transactions on Systems, Man, and Cybernetics
    volume: 18(1)
    pageRange: [49, 60]

  - authors: [Rumelhart D, Hinton G, Williams R]
    year: 1986
    title: Learning representations by back-propagating errors
    journal: Nature
    volume: "323"
    pageRange: [533, 536] 
    doi: 10.1038/323533a0

  - authors: [Salakhutdinov R, Hinton G]
    year: 2009
    title: Deep Boltzmann Machines. 
    journal: Aistats
    volume: 1(3)
    pageRange: [448, 455]
    doi: 10.1109/CVPRW.2009.5206577
---


## Objectives

The following introduces some fundamentals of neural networks, stuff that has been around forever and has nothing to do with TensorFlow. 

This is also not specifically about “deep learning” style inference. That is the world of regularized multi-layer perceptrons called convolutional neural networks, with each neuron connecting to all of those in the following layer.  Useful for image classification, but suffer from over-fitting. 

Rather, the desired functions are:


1. Correct user input and documents so that names and terminology are consistent, and provide learning loop to reinforce positive behaviors 
2. Infer whether objects in an abstract graph are related, and if so build relations between them and propagate changes up to aggregates
3. Make recommendations on data sources for specific uses, and identify opportunities to improve synthetic data sets
4. Predict time evolution of systems, and fill time and space gaps in sparse data
5. Parse natural language into structured queries

Most machine learning activity in marine science that I know of focuses on prediction (#4), or some type of image classification, which is not a focus here. Relationship inference and recommendations (#2 and #3) are birds of a feather, and are not uncommon applications. Natural language stuff (#5) is of course very popular. User feedback learning (#1) is extremely powerful, if you give it enough control over the presentation and operation of the application.


## Data structure

A neural network is made up of layers of neurons and synapses. People use “layers” to mean both neurons and synapses layers, which is wicked confusing. Neuron layers are floating point or integer vectors, and the synapses are 2D arrays with indices that map neighboring neurons to each other. Let’s call them neuronal `layers` and synaptic `matrices`.

Layers are instantiated with a default value of zero. The data structure used must support basic array arithmetic, as well as common functions like `max_index()`, `distance()`, and `normalize()`. Matrices must also support matrix arithmetic, instantiation from tensor operation ($M=AB^T$), and the ability to slice and insert vectors. 

The high-level interface is the network structure itself, which handles training neurons, and ushers new inputs through the system. Networks infer relationships between vectors, and may use a vector-pair abstraction in `encode` and `recall` transfer functions. Assignment and equivalence operators are required for this. Networks are defined by the size of input and output patterns, which are arguments to `encode`/`recall`, and have properties of learning rate, signal decay, and error tolerance. 

The required methods for a basic implementation are:

1. `train()` — run vector-pairs until tolerance is reached
2. `cycle()` — pass vector-pairs and invoke `encode()`
3. `test()` — testing is good
4. `run()` — run the model
5. `dump()`/`load()` — cache the synapse weights
6. `encode()` — store a vector pair in the network
7. `recall()` — complete the vector-pair input


## Learning

### Activation
Neuron internal mechanisms include an adder function which combines the weighted strength of the signals, and threshold function that then computes the activation state. Neurons emit a signal related to the activation state, which may connect to any number of other neurons. 

Activation functions are nonlinear. Using a linear function in multi-layer (deep) networks would have no advantage over a single-layer one. The most common are basic step functions and sigmoid squashing functions:


> $x=\sum_{i=0}^{n} {A_i w_i}$
> $f(x)={{1}\over{1+e^{-x}}}$
> $f(x)=tanh(x)$

### Weights
Synapses store information as weights, trained by presenting patterns in sequence. The learning law updates the weights based on the learning rate, $\alpha$. Some simple forms include Hebbian correlation learning (Hebb 1949), with the weight updated by connected activation values, or their sigmoid transform:


> $\Delta w_{ij} = \alpha a_i a_j$
> $\Delta w_{ij} = -w_{ij} + f(a_i)f(a_j)$


The learning rate is “cooled” when it is initialized as a high value, and decreases to zero over successive cycles. This is not used often in practice.

### Supervision

When there is no feedback regarding the quality of the prediction, the process is considered unsupervised, and therefore self-organizing. Modes of unsupervised learning include additive matrix learning (e.g. bidirectional associative memory) and learning vector quantizer (counter-propagation)

Supervised learning is more common. Weights are adjusted based on the error between truth and predicted values follow an error correction law such as $\Delta w_{ij} = \alpha a_i [c_j-b_j]$, where $c$ is the desired activation. 

Reinforcement learning is a form of supervision. Each output neuron gets an error value$\Delta w_{ij} = \alpha(\nu - \Theta_j)e_{ij}$. Here $\nu$ means total error and $\Theta$ means threshold. The error is disbursed back to neurons, which have eligibility function, $e_{ij}={{d ln g_i} \over {dw_{ij}}}$, where $g$ means probability of correctness. This adjustment is based on activation state, and does not depend on changes during previous step.

Additional hidden layers makes patterns of higher dimensions separable in parameter space. Training is more complicated, and involves back-propagation of error through hidden layers, a is the weighted sum of errors in the output layers times the activation of the hidden neuron.




## Back-propagation

Back-propagation (Rumehart and Hinton 1986) is the predominant method of supervised learning. It requires a lot of training data, and domain knowledge of the ideal number of layers and terminal neurons. 

The size of hidden layers should be between the number of input  and output layers. 
The model tends to group features from the domain, such as pixels forming line features in optical character recognition. Inputs must be normalized and clamped to (0, 1), and the weights can be adjust either incrementally or once per epoch. 

### Encoding

Weights of synapses and neuron thresholds are randomly initialized in (-1, 1). Encoding vector-pairs is accomplished in two stages. The forward pass computes the hidden layer activation, $h=f(iW_1)$, and then the output activation, $o=f(hW_2)$. $W$ means synaptic matrix. The backward pass computes the output error $d=o(1-o)(o-t)$ from a known target $t$. This is used to update $W_2$: 


> $W_2 = W_2 + \Delta W_2$
> $\Delta W_{2,t} = \alpha h d + \Theta \Delta W_{2,t-1}$

Then the hidden layer error, $e=h(1-h)W_2d$, updates $W_1$:


> $W_1 = W_1 + W_{1,t}$
> $\Delta W_{1,t} = \alpha ie + \Theta \Delta W_{1,t-1}$

Cycle until $d$ is within tolerance.

### Recall
The network recalls by computing hidden ($h$) and output ($o$) activation as before. Thresholds may be used to bias activation,

> $h=F(iW1 + thresh1)$
> $o=F(W2h + thresh2)$
> $thresh1 = thresh1 + \alpha d$



## Counter-propagation

Counter-propagation networks (CPN) train faster than back-prop, and are better generalizers of new data which may lie outside distributions previous encountered (Hecht-Nielson 1987). The method combines a linear vector quantizer (LVQ, a form of self-organizing map) and a minimal outstar encoder.  These can function as lookup tables. These are generally unsupervised, but may be amended with feedback.

There are three layers, and the hidden layer usually only has a single neuron activate at time (some cases there may be more). This is chosen by similarity to encountered patterns, and is a categorization process. There must be a neuron in the hidden layer for each output neuron (category), which is referred to as a capacity problem.

### Encoding
The initial weights are random. Inputs are chosen from the sum of squared differences. Weights of connecting synapses are updated from the difference between input and current state. The outgoing synapses are then updated from the single activated neuron.

### Recall
New queries activate a single hidden neuron, which produces an output pattern indicating the category.


## Bidirectional associative memory systems

The capacity problem of CPN is solved with bidirectional associative memory systems (BAMS). The original formulation (Kosko 1988) was improved upon by Patrick Simpson (1989), by adding new matrices of synaptic weights when the current ones saturate. 

This model is based on two-layer feedback nets used for memory addressing, and has useful properties of being stable (training will always converge) and having instant recall. The problem is that the memory usage increases O(n2) with pattern length.

BAMS are useful when mapping between features:

- optical character recognition: pixel pattern —> character
- voice: signal —> word
- spell check: words —> phonemestring
- radar: signal —> object


### Encoding
The matrix is the sum of correlation matrices of pattern pairs,


> $M= \sum_{i=1}^{m} A_i^T B_i$

New pattern pairs are added to the current encoding by computing incremental additions. Pairs can be removed by performing the inverse operation. The matrix is tested to see that each pair can be recalled. If not, the last entry is removed and stored in a new matrix.

### Recall

When one part of a pair is presented, the network will recall the complement, or a close match.
Patterns are passed back and forth through the matrix and transpose until it converges on a solution, which is guaranteed to exist according to Lyapunov energy function,


> $E(A,B)=-AQB^T$

Don’t know the location of the information, since it is spread around, so the program queries each matrix for pairs with the same energy as desired. This is more computationally expensive than checking a single source. 

By modifying the M encoding methods, can favor convergence or accuracy. Options include the Hebb’s signal function from before, competitive encoding, or differential Hebb’s. 


## Hopfield Nets

Single layer auto associative pattern storage (Hopfield 1985) useful for applications like the traveling salesman problem. 

Encoding 
For discrete cases, add product of activation to weight, 


> $W=\sum A_k^T A_k$

Continuous nets are more flexible, act like circuit, with neuron conductance,


>  $w_{ij} = f(a_j)/R_{ij}$

The function is arbitrary.