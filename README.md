DemoJS
======

My entries for the DemoJS demoparty.


Online
======

- 2011 entry version v1: http://www.gamesfrommars.fr/demojs
- 2011 entry version v2: http://www.gamesfrommars.fr/demojsv2
- 2012 entry: http://www.gamesfrommars.fr/demo2012


2011 entry v2: How does it work?
================================

The screen is splitted in a grid of squares, and spheres are bucketed in this grid. 

A number of optimizations occur:

- To render a square, the background is redrawn, then spheres in this square are redrawn back-to-front after z-sort (aka painter algorithm).
- Because shadowBlur is slow, the shadow is done using gradients.
- Gradient for all radiuses are precomputed before-hand.
- Occluded spheres do not get drawn.
- To save the cost of drawing very small spheres, we draw a small rect instead.
- Also some of the spheres are precomputed bitmaps because it's faster (but then, no gradients).
- Squares when nothing happened are left untouched.
