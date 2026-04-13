---
layout: post
title: Gradient descent, linear regression, and guessing latency before it spikes
sub_title: Traffic forecasting with the normal equation and iterative optimisation on real microservice metrics.
read_time: 10
date: April 2026
featured_image:
image-theme: dark no-image-styling
---

A few weeks ago I published a video [^1] that walks through **gradient descent** in the context of something SREs actually care about: **whether we can forecast load and latency** well enough to act before customers feel pain. If you prefer video, the full walkthrough is here: [Gradient descent for traffic forecasting](https://www.youtube.com/watch?v=vNDvFW2pOxQ).

This post is the companion write-up. The important part is not the algebra on its own — it is what happens when you apply two standard optimisers (**closed-form linear regression** and **gradient descent**) to noisy service metrics, and how far you can trust a linear model when saturation hits.

All of the experiments live in a notebook in my [autoscaling-playground repo](https://github.com/OpeOnikute/autoscaling-playground/blob/main/notebooks/traffic_forecasting.ipynb) [^2].

## Can you predict latency from CPU+network traffic?

The notebook uses rows from a microservices bottleneck-detection style dataset. We get an aggregate of **CPU**, **network RX/TX**, and **latency**. The broad aim is capacity planning — if CPU and traffic are increasing on a smooth trend, can we translate that combination of load into an expected latency?

That idea only works if the relationship between load and latency stays **roughly linear**. In the exammples we picked (only those where CPU and network rise over time while latency stays low, then jumps when saturation shows up), the plots make the limitation obvious: **latency stops behaving linearly once the system saturates**.

## Combining two linear models for the prediction

In the notebook, we built **two linear models** and chained them.

| Model | Inputs | Target | Role |
| --- | --- | --- | --- |
| **Model 1** | time (plus intercept) | mean CPU per window | Fit the upward CPU trend, extrapolate forward |
| **Model 2** | CPU, net RX, net TX (plus intercept) | latency (ms) | Map forecasted load to an estimated latency |

The end-to-end idea was to use Model 1 to guess where CPU and network are heading, then feed those numbers into Model 2 to guess latency at that future point — close to how you might reason about an SLO if you trusted the trend.

## Considering Normal equation versus gradient descent

For linear regression, we minimise **mean squared error**, a concept that I introduced in the video. You can solve for the weights $\theta$ in one shot with the normal equation, or you can start from a guess and repeatedly nudge $\theta$ in the direction that reduces the error — gradient descent.

Comparing both:

- **Closed form**: can get expensive when feature matrices grow huge.
- **Gradient descent**: iterative and needs a sensible **learning rate**.

For Model 1, the notebook fits the same trend both ways. Gradient descent runs on standardised time and CPU so the optimiser is well-behaved, then predictions are mapped back to the original scale for comparison with the closed-form line.

There is also an interactive widget in the notebook to sweep learning rate and epoch count — useful if you want to see divergence, slow convergence, and “just right” behaviour on the same CPU-vs-time problem.

## Linear prediction only holds up before saturation

This brings us to the finding that matters for production intuition.

If you fit a single line to latency across the entire timeline, the saturated tail pulls the fit. You end up with a compromise that misrepresents both the healthy region and the failure region: the physics of the system changed, but the model has one slope.

So Model 2 is intentionally trained on baseline windows only — the period before saturation — where “latency as a function of CPU and network” is still approximately linear. You are not pretending saturation is linear; you are estimating latency conditional on staying inside the bounds you learned.

## What we've learned

1. **Gradient descent and the normal equation both work** for these small linear problems; GD needs scaling and hyperparameters, while the closed-form is immediate but not the tool you reach for when using a massive dataset.
2. **Latency forecasting with linear regression only makes sense in the pre-saturation band.** Once the system tips into non-linear latency, a line through CPU and network is wrong.
3. **Chaining a time-trend model for load with a load→latency model** is a readable way to think about “what if traffic keeps doing what it did for the last hour?” — but the answer is only trustworthy while the linear assumptions hold.

## What next?

The notebook closes with a caveat -- a forecast that assumes smooth trends can **over- or under-shoot** badly when saturation is driven by thresholds, contention, or external dependencies. A more durable operational approach might combine trend models with **change-point or anomaly-style** methods (including unsupervised cues) to detect when you have left the linear regime, instead of extending a line and hoping.

## Footnotes

[^1]: YT video is [Machine Learning for Monitoring | Predict Your System's Future with Gradient Descent](https://www.youtube.com/watch?v=vNDvFW2pOxQ).
[^2]: Notebook on [Github](https://github.com/OpeOnikute/autoscaling-playground/blob/main/notebooks/traffic_forecasting.ipynb).
