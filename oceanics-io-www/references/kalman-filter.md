---
title: Kalman filter
date: "2019-12-01T12:00:00.000Z"
description: |
    Kalman filtering is a common approach when integrating multiple time series
    data streams. This is a quick note about the math behind it, and the OG reference,
    "A new approach to linear filtering and prediction problems" 
tags: ["algorithms", "signal processing", "sensor fusion", "filter", "WIP"]
citations:

  - authors: [Kalman RE]
    year: 1960
    title: |
         A new approach to linear filtering and prediction problems
    journal: Journal of Basic Engineering
    volume: "82(1)"
    pageRange: [35]
---

The Kalman filter method is used to combine multiple data streams, and to drive control systems. The algorithm was described in:

The estimate of the value is the sum 

$ \hat{X}=K_k \cdot Z_k + (1-K_k) \cdot \hat{X}_{k-1} $

$k$ is states, like discrete time intervals
$X$ is estimate
$z$, value

The gain ($K$) is unknown, and the filter process finds the best averaging factor to minimize error. Fixing this at 0.5 results in simple averaging. 


$ x_k = Ax_{k-1} + Bu_k + w_{k-1} $

$x$ is linear combination of the previous value, control signal ($ u_k $=0), and process noise (as independent Gaussian functions).

$ z_k = Hx_k + v_k $

any measured value is a linear combination of signal and measurement noise. 

noise terms are independent Gaussian functions

A,B,H are matrices, but may reduce to single values, and may be constants, maybe 1


The prediction step updates values:
$ \hat{x}_k^-=A \hat{x}_{k-1}+Bu_k $
$ P_k^-=AP_{k-1}A^T + Q $

The correction step accounts for error:
$ K_k=P_k^- H^T(HP_k^- H^T + R)^{-1} $
$ \hat{x}_k = \hat{x}_k^- + K_k(z_k-H \hat{k}_k^-) $
$ P_k=(I-K_kH)P_k^- $

determine R and Q