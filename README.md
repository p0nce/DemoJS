DemoJS
======

These are my entries for the DemoJS demoparty.
http://demojs.org/


See the demos online
====================

- Irrelevant (2011 entry v1): http://www.gamesfrommars.fr/demojs/
- Irrelevant (2011 entry v2): http://www.gamesfrommars.fr/demojsv2/
- Burnt (2012 entry): http://www.gamesfrommars.fr/demojs2012


2011 entry v2: How does it work?
================================

The screen is splitted in a grid of squares, and spheres are bucketed in this grid. 

Optimizations:

- To render a square, the background is redrawn, then spheres in this square are redrawn back-to-front after z-sort (aka painter algorithm).
- Because shadowBlur is slow, the shadow is done using gradients.
- Gradient for all radiuses are precomputed before-hand.
- Occluded spheres do not get drawn.
- To save the cost of drawing very small spheres, we draw a small rect instead.
- Also some of the spheres are precomputed bitmaps because it's faster (but then, no gradients).
- Squares when nothing happened are left untouched.


2012 entry: How to make a blur in Canvas?
=========================================

Repeateadly downsize a back-buffer canvas by 2, then blend some of these downsized buffer on the original.
The blur here is stateful: I would recommend against it for framerate issues will come up.
