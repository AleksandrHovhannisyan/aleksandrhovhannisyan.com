---
title: "Least Squares Fitting: How to Fit a Curve to Data"
description: "Having mastered the method of least squares, we're now ready to learn how to solve least squares fitting problems, both by hand and with Python."
keywords: [least squares fitting, least squares method]
tags: [computer-science, math]
needsLatex: true
comments_id: 39
---

With an understanding of [the method of least squares](/blog/computer-science/the-method-of-least-squares) and QR decomposition, we're now ready to look at one of its most practical applications: least squares fitting. In this tutorial, we'll explore straight-line fitting and polynomial least squares fitting, both by hand and with Python. But before we get to the problems, we need a little background and some more theory.

{% include linkedHeading.html heading="What Is Least Squares Fitting?" level=2 %}

In **least squares fitting**, we have some function $$f$$ that takes $$n$$-vectors as its inputs and maps them to real numbers. We don't really know anything about the function itself and what it does under the hood. It's your classic black box: You feed some vector $$x$$ to the function, and it spits out a $$y$$ in response:

{% include picture.html img="black-box" ext="JPG" alt="The black-box model of a function." shadow=false %}

Our goal in least squares fitting is to try to model $$f$$ as closely as possible, based on the input-output data pairs that we're given. Typically, we use the following notation for our data, with $$(x^{(i)}, y^{(i)})$$ denoting the $$i$$-th data pair:

$$x^{(1)}, x^{(2)}, ..., x^{(N)}$$

$$y^{(1)}, y^{(2)}, ..., y^{(N)}$$

Here, $$N$$ is the number of data points (i.e., the size of our data set), while $$n$$ is the size of each input vector, $$x^{(i)}$$. Keep that in mind because these two are not necessarily the same.

> **Note**: We use superscripts in parentheses to denote data pairs. Note that subscripts are usually reserved for the elements of a vector. So in this case, the first element of the second input vector would be represented as $$x^{(2)}_1$$.

The typical example used in an introductory machine learning class is the house price index data set. You have $$N$$ data pairs of the form $$(x^{(i)}, y^{(i)})$$. You feed your feature vector $$x^{(i)}$$ to your function, and it produces some corresponding scalar value, $$y^{(i)}$$, in response. In this case, $$x^{(i)}$$ may be a set of measurements for the home: the number of bedrooms, the number of bathrooms, its age, and so on. The corresponding output is $$y^{(i)}$$, which denotes the price of the home—the *real* price, not a prediction.

$$y = f(x)$$

Now, as I mentioned earlier, we rarely ever know what $$f$$ is. So what we'll do is model the relationship between each $$x^{(i)}$$ and $$y^{(i)}$$ as closely as we can. We approximate their relationship with a **model function** that we call $$\hat{f}$$:

$$y \approx \hat{f}(x)$$

Note that $$y$$ and $$x$$ are simply placeholders. Since we're really given $$N$$ data points—$$x^{(i)}$$  and $$y^{(i)}$$—we should write out the expanded form of the above by plugging in each data pair. That'll give us a clearer picture of what's going on:

$$y^{(1)} \approx \hat{f}(x^{(1)})$$

$$y^{(2)} \approx \hat{f}(x^{(2)})$$

$$\ldots$$

$$y^{(N)} \approx \hat{f}(x^{(N)})$$

This is starting to look more like a system of equations. But we're not quite there yet. How exactly do we pick $$\hat{f}$$?

> **Summary**: Our goal in data fitting is to model the relationship between the inputs, $$x^{(i)}$$, and the outputs, $$y^{(i)}$$, as closely as possible using a model function, $$\hat{f}$$. Because remember, we don't know the *true* relationship, $$f$$.

{% include linkedHeading.html heading="Picking a Model Function for Data Fitting" level=2 %}

Below is the general form of the model function $$\hat{f}$$ used in least squares fitting:

$$\hat{f}(x) = \theta_1 f_1(x) + \theta_2 f_2(x) + \ldots + \theta_p f_p(x)$$

If this looks confusing, don't worry—it's actually very simple.

First, notice that the model is a function like any other. In this case, though, it's composed of $$p$$ parameters, $$\theta_1, \ldots, \theta_p$$, as well as $$p$$ functions, $$f_1(x), \ldots, f_p(x)$$. In data fitting, these functions are called **basis functions**.

Okay, so how can we make this least squares model function more concrete?

Well, the good news is that we get to pick the basis functions $$f_i$$ based on how we think the real function, $$f(x)$$, behaves. As we'll see shortly, if $$f$$ appears to be linear in behavior, then we may decide to pick our basis functions such that $$\hat{f}$$ ends up resembling a straight line. On the other hand, if $$f$$ appears to be quadratic, then we may pick our basis functions such that $$\hat{f}$$ ends up being some sort of a polynomial.

> **Takeaway**: We pick the basis functions based on how we think $$f(x)$$ behaves. This is a key step in engineering a model function. In picking the basis functions, we also decide how many of them we'll need. This is $$p$$.

*We* pick the basis functions. The $$\theta$$ values—the **model parameters**—are what we need to solve for.

{% include linkedHeading.html heading="Data Fitting: The System of Equations" level=3 %}

Let's plug this general form of $$\hat{f}$$ into the earlier set of equations that we saw:

$$y^{(1)} \approx \hat{f}(x^{(1)}) = \theta_1 f_1(x^{(1)}) + \theta_2 f_2(x^{(1)}) + \ldots + \theta_p f_p(x^{(1)})$$

$$y^{(2)} \approx \hat{f}(x^{(2)}) = \theta_1 f_1(x^{(2)}) + \theta_2 f_2(x^{(2)}) + \ldots + \theta_p f_p(x^{(2)})$$

$$\ldots$$

$$y^{(N)} \approx \hat{f}(x^{(N)}) = \theta_1 f_1(x^{(N)}) + \theta_2 f_2(x^{(N)}) + \ldots + \theta_p f_p(x^{(N)})$$

Now that's more like it—this is a linear system of equations! Let's represent it in matrix form:

$$

\begin{bmatrix}
y^{(1)} \\
y^{(2)} \\
\vdots \\
y^{(N)}
\end{bmatrix}

\approx

\begin{bmatrix}
f_1(x^{(1)}) & f_2(x^{(1)}) & \ldots & f_p(x^{(1)}) \\
f_1(x^{(2)}) & f_2(x^{(2)}) & \ldots & f_p(x^{(2)}) \\
\vdots & \ldots & \ddots & \vdots \\
f_1(x^{(N)}) & f_2(x^{(N)}) & \ldots & f_p(x^{(N)}) \\
\end{bmatrix}

\begin{bmatrix}
\theta_1 \\
\theta_2 \\
\vdots \\
\theta_p
\end{bmatrix}

$$

Notice that our matrix has dimensions $$N \times p$$. In practice, $$N$$ is often much, much larger than $$p$$. Sound familiar? All this really means is that we have an overdetermined system—there's no exact solution $$\theta$$ to $$A\theta = y$$. This means that **many data fitting problems are actually least squares problems**—we need to find the $$\hat{\theta}$$ that gets us as close as possible to $$y$$.

**To summarize**:

- There exists some unknown relationship, $$f$$, between $$x^{(i)}$$ and $$y^{(i)}$$, such that $$f(x^{(i)}) = y^{(i)}$$.
- We approximate $$f$$ using $$\hat{f}(x) = \theta_1 f_1(x) + \theta_2 f_2(x) + \ldots + \theta_p f_p(x)$$.
- We pick the basis functions $$f_1, \ldots, f_p$$ based on how we think the real function $$f$$ behaves.
- We solve for the parameters of our model—$$\theta_1, \ldots, \theta_p$$—using the least squares method.

{% include linkedHeading.html heading="General Strategy for Solving Least Squares Problems" level=2 %}

Here's a simple five-step strategy you can use to solve least squares problems:

1. Visualize the problem. For example, you may be given a set of data points that you can plot.
2. Pick an appropriate model. Based on what we learned, this involves choosing the basis functions and $$p$$.
3. Identify the equations involved. Write them out explicitly based on your input and output pairs.
4. Solve the overdetermined system using the least squares method.
5. (Optional) Visualize the solution. This is a useful way to sanity check your answer, though it's not fool-proof.

> **Note**: For all the examples that follow, we'll let $$n = 1$$. That is, our input $$x^{(i)}$$s will just be scalar values. In reality, this changes nothing about the least squares method.

{% include linkedHeading.html heading="Example 1: Least Squares Straight-Line Fit" level=2 %}

Suppose we're given these data points for a least squares line fitting problem:

$$ (1, 1), (2, 3), (3, 3) = (x^{(1)}, y^{(1)}), (x^{(2)}, y^{(2)}), (x^{(3)}, y^{(3)}) $$

We're asked to model the relationship between $$x$$ and $$y$$. Let's take it step by step.

{% include linkedHeading.html heading="Step 1: Visualize the Problem" level=3 %}

First, we'll plot the points:

{% include picture.html img="data" ext="JPG" alt="Plotting the three data points we were given." shadow=false %}

We note that the points, while scattered, appear to have a linear pattern. Clearly, it's not possible to fit an actual straight line to the points, so we'll do our best to get as close as possible—using least squares, of course.

{% include linkedHeading.html heading="Step 2: Pick an Appropriate Model" level=3 %}

We know $$f$$ appears linear, like a $$y = mx + b$$ equation. We want our model function to look something like this:

$$\hat{f}(x) = \theta_1 + \theta_2x$$

> **Note**: Alternatively, you could just as well pick $$\hat{f}(x) = \theta_1 x + \theta_2$$. It won't change the solution.

So, we revisit our general model:

$$\hat{f}(x) = \theta_1 f_1(x) + \theta_2 f_2(x) + \ldots + \theta_p f_p(x)$$

And we pick our basis functions, as promised, to give $$\hat{f}$$ a linear shape. We pick $$p$$ to be $$2$$, such that we have:

$$\hat{f}(x) = \theta_1 f_1(x) + \theta_2 f_2(x)$$

Next, we define our basis functions:

$$f_1(x) = 1$$

$$f_2(x) = x$$

What does this do for us? Let's plug them into the general formula:

$$\hat{f}(x) = \theta_1 + \theta_2 x$$

That gives us precisely the function we wanted.

> **Note**: You don't have to be this explicit about how you select your basis functions. However, I recommend doing so because it allows you to verify that your reasoning is sound.

{% include linkedHeading.html heading="Step 3: Identify the Equations Involved" level=3 %}

Here are all three equations for our problem:

$$ y^{(1)} = \theta_1 + \theta_2 x^{(1)} $$

$$ y^{(2)} = \theta_1 + \theta_2 x^{(2)} $$

$$ y^{(3)} = \theta_1 + \theta_2 x^{(3)} $$

Let's plug in our points:

$$ 1 = \theta_1 + \theta_2 (1) $$

$$ 3 = \theta_1 + \theta_2 (2) $$

$$ 3 = \theta_1 + \theta_2 (3) $$

And, in matrix form, this looks like the following:

$$

\begin{bmatrix}
1 \\
3 \\
3
\end{bmatrix}

=

\begin{bmatrix}
1 & 1 \\
1 & 2 \\
1 & 3
\end{bmatrix}

\begin{bmatrix}
\theta_1 \\
\theta_2
\end{bmatrix}

$$

{% include linkedHeading.html heading="Step 4: Solve the Overdetermined System Using Least Squares" level=3 %}

Three equations and two unknowns—this is an overdetermined system. How do we solve this system? Well, as we know, there's no exact solution. But we can get the least squares solution by solving for $$\theta$$ in this equation:

$$ (A^TA)\theta = A^Ty $$

Of course, we shouldn't solve this directly without first using QR decomposition. If you perform the necessary steps for QR decomposition, you'll get that:

$$A = QR = 

\begin{bmatrix} 
\frac{1}{\sqrt{3}} & -\frac{1}{\sqrt{2}} \\
\frac{1}{\sqrt{3}} & 0 \\
\frac{1}{\sqrt{3}} & \frac{1}{\sqrt{2}}
\end{bmatrix}

\begin{bmatrix}
\sqrt{3} & \frac{6}{\sqrt{3}} \\
0 & \sqrt{2}
\end{bmatrix}

$$

You can verify this by performing matrix multiplication to see that you do in fact get $$A$$ back. It looks pretty nasty with all those square root terms, but they actually cancel out quite nicely as we'll see here in a second.

Let's plug $$A = QR$$ into the least squares equation. Doing so yields the following simplified form:

$$R\theta = Q^Ty$$

Let's plug in the actual matrices:

$$

\begin{bmatrix}
\sqrt{3} & \frac{6}{\sqrt{3}} \\
0 & \sqrt{2}
\end{bmatrix}

\begin{bmatrix}
\theta_1 \\
\theta_2
\end{bmatrix}

=

\begin{bmatrix} 
\frac{1}{\sqrt{3}} & \frac{1}{\sqrt{3}} & \frac{1}{\sqrt{3}} \\
-\frac{1}{\sqrt{2}} & 0 & \frac{1}{\sqrt{2}}
\end{bmatrix}

\begin{bmatrix}
1 \\
3 \\
3
\end{bmatrix}

$$

And let's simplify the right-hand side of the equation:

$$

\begin{bmatrix}
\sqrt{3} & \frac{6}{\sqrt{3}} \\
0 & \sqrt{2}
\end{bmatrix}

\begin{bmatrix}
\theta_1 \\
\theta_2
\end{bmatrix}

=

\begin{bmatrix}
\frac{7}{\sqrt{3}} \\
\frac{2}{\sqrt{2}}
\end{bmatrix}

$$

This is a square system! Even better, it's an upper-triangular system—this means we can solve for $$\theta_2$$ really easily and then plug it back into the first equation to solve for $$\theta_1$$ (recall that this strategy is known as **back-substitution**). First, let's explicitly write out the two equations:

$$ \sqrt{3}\theta_1 + \frac{6}{\sqrt{3}}\theta_2 = \frac{7}{\sqrt{3}} $$

$$ 0\theta_1 + \sqrt{2}\theta_2 = \frac{2}{\sqrt{2}} $$

Solving the second equation, we get that $$\theta_2 = 1$$.

Plug that into the first equation:

$$ \sqrt{3}\theta_1 + \frac{6}{\sqrt{3}}\theta_2 = \sqrt{3}\theta_1 + \frac{6}{\sqrt{3}} = \frac{7}{\sqrt{3}} $$

Solving yields $$\theta_1 = \frac{1}{3}$$. Excellent!

{% include linkedHeading.html heading="Step 5: Visualize the Solution" level=3 %}

We have the following solution:

$$ \theta = \begin{bmatrix} \theta_1 \\ \theta_2 \end{bmatrix} = \begin{bmatrix} \frac{1}{3} \\ 1 \end{bmatrix} $$

Remember our model?

$$ \hat{f}(x) = \theta_1 + \theta_2 x $$

Plugging those in yields the following straight-line equation:

$$ \hat{f}(x) = \frac{1}{3} + x $$

Let's plot the best-fit line along with the points:

{% include picture.html img="best-fit" ext="JPG" alt="The best-fit line to the data we were given." shadow=false %}

Awesome! This is the best-line fit for the data points we were given.

As you add more points, data fitting (particularly the QR factorization portion) becomes more difficult to do by hand. Fortunately, you can use languages like MATLAB or Python to solve these problems. But now, when you do rely on computers, you'll at least know what they're doing behind the scenes.

{% include linkedHeading.html heading="Example 2: Least Squares Polynomial Fitting (with Python!)" level=2 %}

Let's not stop there! Suppose instead that we are given these five data points:

$$(-4, 5), (0, 1), (1, 3), (2, 9), (-6, 10) = (x^{(1)}, y^{(1)}), (x^{(2)}, y^{(2)}), (x^{(3)}, y^{(3)}), (x^{(4)}, y^{(4)}), (x^{(5)}, y^{(5)})$$

Let's repeat the process.

{% include linkedHeading.html heading="Step 1: Visualize the Problem" level=3 %}

Here's a graph of our points:

{% include picture.html img="data2" ext="JPG" alt="Plotting the four data points we were given." shadow=false %}

To me, these points seems to take on the shape of a parabola. Based on that observation, I'm going to perform a least squares polynomial fit using a polynomial of degree two (a quadratic, basically).

{% include linkedHeading.html heading="Step 2: Pick an Appropriate Model" level=3 %}

Since we're modeling a quadratic equation (degree-two polynomial), this is the general form of the model function we'll aim for:

$$\hat{f}(x) = \theta_1 + \theta_2 x + \theta_3 x^2$$

To get that, we'll start with the original form again:

$$\hat{f}(x) = \theta_1 f_1(x) + \theta_2 f_2(x) + \ldots + \theta_p f_p(x)$$

And we'll pick $$p=3$$ with:

$$f_1(x) = 1$$

$$f_2(x) = x$$

$$f_3(x) = x^2$$

There we go! It's that simple.

> **Note**: Again, you could reverse the order of the polynomial to be $$\hat{f}(x) = \theta_1x^2 + \theta_2 x + \theta_3$$. This would change nothing except the order of the elements in your resulting matrix. 

{% include linkedHeading.html heading="Step 3: Identify the Equations Involved" level=3 %}

Here are all five equations for our polynomial fitting problem:

$$ y^{(1)} = \theta_1 + \theta_2 x^{(1)} + \theta_3 (x^{(1)})^2 $$

$$ y^{(2)} = \theta_1 + \theta_2 x^{(2)} + \theta_3 (x^{(2)})^2 $$

$$ y^{(3)} = \theta_1 + \theta_2 x^{(3)} + \theta_3 (x^{(3)})^2 $$

$$ y^{(4)} = \theta_1 + \theta_2 x^{(4)} + \theta_3 (x^{(4)})^2 $$

$$ y^{(5)} = \theta_1 + \theta_2 x^{(5)} + \theta_3 (x^{(5)})^2 $$

Let's plug in the data we were given:

$$ 5 = \theta_1 + \theta_2 (-4) + \theta_3 (-4)^2 $$

$$ 1 = \theta_1 + \theta_2 (0) + \theta_3 (0)^2 $$

$$ 3 = \theta_1 + \theta_2 (1) + \theta_3 (1)^2 $$

$$ 9 = \theta_1 + \theta_2 (2) + \theta_3 (2)^2 $$

$$ 10 = \theta_1 + \theta_2 (-6) + \theta_3 (-6)^2 $$

I'll simplify things a bit and represent this as a matrix equation:

$$

\begin{bmatrix}
5 \\
1 \\
3 \\
9 \\
10
\end{bmatrix}

=

\begin{bmatrix}
1 & -4 & 16 \\
1 & 0 & 0 \\
1 & 1 & 1 \\
1 & 2 & 4 \\
1 & -6 & 36
\end{bmatrix}

\begin{bmatrix}
\theta_1 \\
\theta_2 \\
\theta_3
\end{bmatrix}

$$

{% include linkedHeading.html heading="Step 4: Solve the Overdetermined System Using Least Squares" level=3 %}

Straight-line fitting is pretty simple by hand, but polynomial least squares fitting is where it gets kind of difficult. So I'm going to "cheat" and use Python! You can use MATLAB instead if you'd prefer; the language doesn't really matter once you know the theory.

Here's a script that uses QR factorization explicitly:

{% capture code %}import numpy as np
from numpy import linalg as LA

# Our data
A = np.array([[1, -4, 16], [1, 0, 0], [1, 1, 1], [1, 2, 4], [1, -6, 36]])

y = np.array([[5], [1], [3], [9], [10]])

# QR factorize A
Q, R = LA.qr(A)

# R (theta) = Q^T (y)
QT = np.transpose(Q)

theta = LA.solve(R, QT.dot(y))

print(theta){% endcapture %}
{% include code.html file="lsq.py" code=code lang="python" %}

However, this is really equivalent to the following code, which simply uses the `LA.lstsq` function:

{% capture code %}import numpy as np
from numpy import linalg as LA

# Our data
A = np.array([[1, -4, 16], [1, 0, 0], [1, 1, 1], [1, 2, 4], [1, -6, 36]])

y = np.array([[5], [1], [3], [9], [10]])

theta = LA.lstsq(A, y)

print(theta){% endcapture %}
{% include code.html file="lsq.py" code=code lang="python" %}

Regardless of which version we run, we'll get the same answer for the $$\theta$$ vector:

$$
\theta 

=

\begin{bmatrix}
1.86105904 \\
1.80904405 \\
0.55014058
\end{bmatrix}

$$

Plugging this into our model, we arrive at the following polynomial function:

$$\hat{f}(x) =1.86105904+1.80904405x+0.55014058x^{2}$$

{% include linkedHeading.html heading="Step 5: Visualize the Solution" level=3 %}

And here's the resulting graph with our polynomial fit to the data:

{% include picture.html img="best-fit2" ext="JPG" alt="The best-fit parabola to the data we were given." shadow=false %}

Looks like a pretty good fit to me!

{% include linkedHeading.html heading="Conclusion" level=2 %}

That about does it for this series on the least squares method! I hope you found this helpful.
