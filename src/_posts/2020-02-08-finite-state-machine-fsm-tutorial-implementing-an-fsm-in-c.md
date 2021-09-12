---
title: "Finite State Machine (FSM) Tutorial: Implementing an FSM in C++"
description: "Finite state machines (FSMs) are used in lots of different situations to model complex entity state. In this finite state machine tutorial, I'll help you understand the FSM design pattern by building one from the ground up for a simple use case."
keywords: ["finite state machine tutorial", "implement a finite state machine"]
categories: [design-patterns, cpp]
commentsId: 33
isPopular: true
---

Finite state machines (FSMs) are used in lots of different situations to model complex entity state. They're especially relevant in game dev for modeling dynamic AI behavior and decision-making. Here's a very rough sketch of what a finite state machine might look like:

{% include img.html src: "fsm.jpg", alt: "A finite state machine representation." %}

An entity may transition from one state to another, or it may remain in its current state. The arrows denote transitions. The conditions under which a transition should take place will need to be coded into the FSM itself.

In this finite state machine tutorial, I'll help you understand the state design pattern by building an FSM with C++ for a simple problem. Note that you could just as well use a different programming language if you wanted to. Let's get started!

## Finite State Machine Use Case: Modeling a Lightbulb

Suppose we have a lightbulb that can have the following states:

- Off
- Low
- Medium
- High

We can model this using an enum:

{% include codeHeader.html file: "LightState.h" %}
```cpp
#pragma once

enum class LightState {
	Off,
	Low,
	Medium,
	High
};
```

Every light is initially off. Calling a light's `toggle` method should advance it to the next state. A light that is off goes to low when toggled. A light that is low goes to medium. And so on. When we toggle a light that is high, it cycles back to off. How would you implement this?

This is actually a question I once encountered during an interview. It's a really great problem because there isn't just a single solution—you can do this in many creative ways. The most basic solution uses the modulo operator and cycles through an array of states, using an index to keep track of the current state.

However, I'd like to use this problem to introduce something called the **finite state design pattern**. It's not *needed* to solve this particular problem, but it's definitely useful. And it's also a good way to understand how finite state machines work. In practice, they are used to model more complex situations than just a lightbulb.

We'll look at two approaches to this problem. Let's get to it!

## Approach #1: Using a State Transition Table (Map)

Usually, whenever you can model a scenario with finite state machines, you can also model it with a simple **state transition table** that literally just maps the current state to the next state.

So, we'll model our light's state transitions with an actual map data structure, where the key is the current state and the value is the next state:

{% include codeHeader.html file: "LightState.h" %}
```cpp
#pragma once
#include <map>

enum class LightState {
	Off,
	Low,
	Medium,
	High
};

std::map<LightState, LightState> lightTransitions = {
	{LightState::Off, LightState::Low},
	{LightState::Low, LightState::Medium},
	{LightState::Medium, LightState::High},
	{LightState::High, LightState::Off}
};
```

Let's also create our simple `Light` class:

{% include codeHeader.html file: "Light.h" %}
```cpp
#pragma once
#include "LightState.h"

class Light
{
public:
	Light();
	void toggle();
	inline LightState getCurrentState() const { return currentState; }

private:
	LightState currentState;
};
```

{% include codeHeader.html file: "Light.cpp" %}
```cpp
#include "Light.h"

Light::Light()
{
	currentState = LightState::Off;
}

void Light::toggle()
{
	currentState = lightTransitions[currentState];
}
```

As I mentioned earlier, a Light starts in the off state. Calling the `toggle` method advances the light to its next state, using the `lightTransitions` transition table.

Easy enough, right?

### State Transition Table Drawbacks

Now, we arrive at one of the limitations of a state transition table: What if we want to perform a certain action when we arrive at the next state, or before we leave the current state?

For example, maybe we want to toggle the intensity of the lightbulb with each state transition, play a sound, or use some other effects unique to a state.

We could certainly do this—just add some code before and after the line where we're changing the state:

{% include codeHeader.html file: "Light.cpp" %}
```cpp
void Light::toggle()
{
	// ... do something here before the transition
	currentState = lightTransitions[currentState];
	// ... do something here after the transition
}
```

But usually, the actions that we want to take before and after a state transition are *state dependent*. This means that we'll need to use a `switch` statement, or a bunch of conditionals, to check what state we're currently in so we can act accordingly. That will become very difficult to maintain if the number of states increases!

Hmm... There's got to be a better way. (If there weren't, I wouldn't be writing this post!)

## Approach #2: Implementing a Finite State Machine

Now that we've looked at how to create a state transition table, we can implement a finite state machine. But before we get to the implementation details, let's consider the following thought exercise:

Instead of using a state transition table and a `LightState` *enum*, what if we make each concrete light state its own *class*? That way, we can delegate the task of determining the next state to the *current state* that a light is in. In other words, I'm proposing that we do something like this, where invoking a light's `toggle` method in turn invokes the current state's `toggle` method (because remember—we're now going to use classes instead of enums for the states):

{% include codeHeader.html file: "Light.h", copyable: false %}
```cpp
#pragma once
#include "LightState.h"

class Light
{
public:
	Light();
	// Same as before
	inline LightState* getCurrentState() const { return currentState; }
	// In here, we'll delegate the state transition to the currentState
	void toggle();
	// This will get called by the current state
	void setState(LightState& newState);

private:
	// LightState here is now a class, not the enum that we saw earlier
	LightState* currentState;
};
```

{% include codeHeader.html file: "Light.cpp", copyable: false %}
```cpp
#include "Light.h"

// TODO: set the initial state here
Light::Light()
{
}

void Light::setState(LightState& newState)
{
	currentState->exit(this);  // do stuff before we change state
	currentState = &newState;  // change state
	currentState->enter(this); // do stuff after we change state
}

void Light::toggle()
{
	// Delegate the task of determining the next state to the current state!
	currentState->toggle(this);
}
```

Then, somewhere inside the current state's `toggle` method, we call the light's `setState` method and pass in the new state that we want to go to:

```cpp
void SomeLightState::toggle(Light* light)
{
	light->setState(SomeOtherLightState::getInstance());
}
```

Confused? Don't worry—I'm about to break it all down step by step.

This is known as the **finite state design pattern**. In this pattern, each state is modeled as a concrete class. So we'll need need the following four states for our lightbulb:

- `LightOff`
- `LowIntensity`
- `MediumIntensity`
- `HighIntensity`

Let's model this finite state machine with a simple diagram:

{% include img.html src: "light-fsm.jpg", alt: "Modeling our lightbulb's FSM." %}

Each class implements a common `LightState` interface (or, in C++ terms, an *abstract class*) that exposes the following three methods:

- `enter(Light*)`: What should happen as we enter this state?
- `toggle(Light*)`: What should happen when we're in this state?
- `exit(Light*)`: What should happen as we're exiting this state?

All three methods accept a pointer to the `Light` object with which the state is associated. How do they gain access to this pointer? Well, recall that we invoked `toggle` in our `Light` class like so:

```cpp
void Light::toggle()
{
	currentState->toggle(this);
}
```

Basically, a `Light` passes in a pointer to itself (`this`). While doing so may seem pointless, it becomes more important in game development because it allows the state to ask the entity certain questions, like how much health it currently has and so on. The state can then use that information to decide what state the entity should transition to. Health is too low? Transition to a more defensive/fleeing state. Health is high? Be more aggressive. Clearly, in the case of a lightbulb, there isn't really any information that we need to poll the `Light` instance that gets passed in.

One final note: Each state class typically follows the [singleton design pattern](https://refactoring.guru/design-patterns/singleton) to avoid unnecessary memory allocations and deallocations as we transition from one state to another, and then potentially back to a state that we were already in at one point. With our lights, if we didn't use singletons, we'd have to recreate our states every time we made a transition, and that would be wasteful. Plus, this design pattern is more efficient if we have multiple lights since the states are not tied to any particular instance—remember, they accept a pointer to an instance whenever any of their methods are called!

To understand how this all works in practice, we'll implement everything from scratch.

### 1. The <code>LightState</code> Interface

Let's first define the abstract `LightState` class. You'll notice some forward declarations that are necessary to resolve circular includes that would otherwise throw off the C++ linker.

{% include codeHeader.html file: "LightState.h" %}
```cpp
#pragma once
#include "Light.h"

// Forward declaration to resolve circular dependency/include
class Light;

class LightState
{
public:
	virtual void enter(Light* light) = 0;
	virtual void toggle(Light* light) = 0;
	virtual void exit(Light* light) = 0;
	virtual ~LightState() {}
};
```

Since this is a **pure abstract class**, we cannot create an instance of it. The `LightState` interface allows us to take advantage of polymorphism so we can refer to a generic state without having to specify the true type of state that a `Light` is currently in.

{% aside %}
  **Note**: In practice, you would often take this a step further and create an abstract `EntityState` class that accepts a pointer to some generic `Entity` instance. `LightState` would extend `EntityState`, and `Light` would extend `Entity`.
{% endaside %}

### 2. Concrete State Classes

Next, we'll declare all of our concrete state classes. We'll force each one to be a singleton by:

1. Defining a static `getInstance` method that returns a pointer to the singleton.
2. Declaring all constructors, copy constructors, and assignment operators as private.

{% include codeHeader.html file: "ConcreteLightStates.h" %}
```cpp
#pragma once
#include "LightState.h"
#include "Light.h"

class LightOff : public LightState
{
public:
	void enter(Light* light) {}
	void toggle(Light* light);
	void exit(Light* light) {}
	static LightState& getInstance();

private:
	LightOff() {}
	LightOff(const LightOff& other);
	LightOff& operator=(const LightOff& other);
};

class LowIntensity : public LightState
{
public:
	void enter(Light* light) {}
	void toggle(Light* light);
	void exit(Light* light) {}
	static LightState& getInstance();

private:
	LowIntensity() {}
	LowIntensity(const LowIntensity& other);
	LowIntensity& operator=(const LowIntensity& other);
};

class MediumIntensity : public LightState
{
public:
	void enter(Light* light) {}
	void toggle(Light* light);
	void exit(Light* light) {}
	static LightState& getInstance();

private:
	MediumIntensity() {}
	MediumIntensity(const MediumIntensity& other);
	MediumIntensity& operator=(const MediumIntensity& other);
};

class HighIntensity : public LightState
{
public:
	void enter(Light* light) {}
	void toggle(Light* light);
	void exit(Light* light) {}
	static LightState& getInstance();

private:
	HighIntensity() {}
	HighIntensity(const HighIntensity& other);
	HighIntensity& operator=(const HighIntensity& other);
};
```

I created inlined, empty definitions for the `enter` and `exit` methods, as these are not essential for our purposes. They are merely there as placeholders, to show that you could fill those in if you wanted to. For example, you could fill these with print statements, or you could invoke some method on the light object that got passed in, such as `light->increaseGlow()`.

Let's also create definitions for all of the `toggle` and `getInstance` methods, to make things clearer:

{% include codeHeader.html file: "ConcreteLightStates.cpp" %}
```cpp
#include "ConcreteLightStates.h"

void LightOff::toggle(Light* light)
{
	// Off -> Low
	light->setState(LowIntensity::getInstance());
}

LightState& LightOff::getInstance()
{
	static LightOff singleton;
	return singleton;
}

void LowIntensity::toggle(Light* light)
{
	// Low -> Medium
	light->setState(MediumIntensity::getInstance());
}

LightState& LowIntensity::getInstance()
{
	static LowIntensity singleton;
	return singleton;
}

void MediumIntensity::toggle(Light* light)
{
	// Medium -> High
	light->setState(HighIntensity::getInstance());
}

LightState& MediumIntensity::getInstance()
{
	static MediumIntensity singleton;
	return singleton;
}

void HighIntensity::toggle(Light* light)
{
	// High -> Low
	light->setState(LightOff::getInstance());
}

LightState& HighIntensity::getInstance()
{
	static HighIntensity singleton;
	return singleton;
}
```

I'm taking advantage of static variables to create my singletons in a legible manner. Moreover, note that I'm returning references, and not pointers, [to avoid leaking memory](https://stackoverflow.com/questions/13047526/difference-between-singleton-implemention-using-pointer-and-using-static-object).

Notice how each `toggle` method initiates the appropriate state transition by invoking `light->setState(...)` and passing in a singleton, via a call to the next state's `getInstance` method.

### 3. The <code>Light</code> Class

The final piece of the puzzle is the `Light` class, particularly the `setState` method:

{% include codeHeader.html file: "Light.h" %}
```cpp
#pragma once
#include "LightState.h"

// Forward declaration to resolve circular dependency/include
class LightState;

class Light
{
public:
	Light();
	inline LightState* getCurrentState() const { return currentState; }
	void toggle();
	// This is where the magic happens
	void setState(LightState& newState);

private:
	LightState* currentState;
};
```

{% include codeHeader.html file: "Light.cpp" %}
```cpp
#include "Light.h"
#include "ConcreteLightStates.h"

Light::Light()
{
	// All lights are initially turned off
	currentState = &LightOff::getInstance();
}

void Light::setState(LightState& newState)
{
	currentState->exit(this);  // do stuff before we change state
	currentState = &newState;  // actually change states now
	currentState->enter(this); // do stuff after we change state
}

void Light::toggle()
{
	// Delegate the task of determining the next state to the current state
	currentState->toggle(this);
}
```

This is where the `enter` and `exit` methods come into play. Before we change states, we call the exit method on the previous state. Then, we set the current state to the new state and invoke the enter method. But again, since we haven't defined the behavior for these two methods, they won't really do anything; they're just here to show you that you *could* do those things if you wanted to.

And we're done! This is a pretty standard finite state machine implementation, and you can easily extend this to any other language you want.

## More Finite State Machine Examples

As I mentioned earlier, this was a pretty trivial use case for finite state machines. In fact, you don't really need the finite state design pattern to solve this particular problem. However, because the problem itself is so simple—a lightbulb that simply changes from one state to another—I felt it was a perfect way to introduce FSMs without overcomplicating things. That said, I'd like to briefly mention two situations where you may want to use a finite state machine:

[Modeling a vending machine](https://stackoverflow.com/questions/14676709/c-code-for-state-machine). This StackOverflow thread offers a pretty good discussion of some design approaches to a real-world interview problem. The accepted answer suggests using the finite state design pattern because of how extensible it is. Interestingly, the second highest rated answer suggests using a state transition table as an alternative.

[Modeling AI in a game](https://gameprogrammingpatterns.com/state.html). This post goes into great detail in the context of game dev and even touches on one advantage of finite state machines that I mentioned earlier in this post: the ability to query or "poll" the entity to determine what state transition should take place.

## Further Reading

To gain a better understanding of finite state machines, I encourage you to reference the book titled *Programming Game AI by Example*, by Mat Buckland. Chapter 2 covers the state-driven agent design pattern, which is essentially just another name for the FSM design pattern. You can [download the companion code](https://github.com/wangchen/Programming-Game-AI-by-Example-src) and run it yourself as you work through the chapter explanations. This is how I initially learned about finite state machines.

I hope you found this tutorial helpful!
