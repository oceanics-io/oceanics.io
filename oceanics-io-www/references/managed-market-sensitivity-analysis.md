---
title: Managed market sensitivity analysis
date: "2021-04-03T13:36:00.000Z"
description: |
    A toy model for the XaaS folks in the room. Work in progress.
tags: ["SaaS", "business", "marketing", "model", "cybernetics", "wip"]
---

I was very pleased to find that when getting into the business world, that numerical methods for financial data and venture profitability are the same as those for simulating flows of material through the ocean environment and living or mechanical things.

It should be no surprise that tools the early cyberneticists developed for neurological and physiological research made its way into the nebulous Operations Research.

The SaaS business model makes a lot of sense to me, because it's about efficiency and focus. Ultimately, it's about optimizing unit economics over time, which is why VC loves SaaS.

One type of SaaS is the managed market, where the service provider acts as intermediary between buyer and seller, taking a profit from either or both sides. The middle person, the vectorial class.

You might offer one or more services, but each line of business should be profitable, eventually. The higher the quality of service and the more risk assumed by the vector, the greater the share of the transaction. Sometimes 40%. The risk is greatest when the products are luxury/niche, or expire. 

Whole "solutions" are compelling, but consider that these bundle your strengths with your weaknesses, and ask a higher price for the mixed basket. There ought to be no such thing as a cost center.

I needed recently to understand the managed market model, and do sensitivity analysis on the profitability of specific lines of business. Interesting enough to make a toy model out of. 

The ontology is pretty simple. The topology is a little more complex. 

You have a `consumer` and `producer` group. The business dedicates some `funnel` to onboard members. Then a `vector` matches supply and demand between groups. 

You can substitute names appropriate to your vertical. 

Whatever you're selling flows from `producer` to `consumer`, and through `vector`. Some amount may become `waste` on the `consumer` side or when returned to `producer`. 

Money flows from the `consumer` to the `producer` and `vector`. The `funnel` feeds the `vector`, so `vector` pays `funnel` for `growth`. That might mean a very low maintenance `funnel`, or a monster deal flow. 

In other words, `vector` growth should be monotonic, while `funnel` might scale to zero. That's why sales work on commission, I think? Network effects become dominant.

These agents can be fully simulated with a few variables:
* `flux`, the amount and direction of product moved
* `capacity`, the amount that can be held at one time
* `growth`, organic account growth
* `cost`, one time of acquiring new account
* `life`, span of account, used to calculate churn, et cetera
* `fees`, flat cost to customer, preferably zero
  
Time-sensitive products and services are defined with:
* `price`, unit price
* `life`, how long product retains value
* `take`, share of transaction that goes to service provider

The resulting transactions are the record of flows between agents. 

(Work in progress...)