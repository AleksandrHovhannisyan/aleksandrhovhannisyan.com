---
title: "Finite State Machine (FSM) Tutorial: Implementing an FSM in C++"
description: "Finite state machines (FSMs) are used in lots of different situations to model complex entity state. In this finite state machine tutorial, I'll help you understand the FSM design pattern by building one from the ground up for a simple use case."
keywords: ["finite state machine tutorial", "implement a finite state machine"]
tags: [dev, design-patterns, c++]
---

Finite state machines (FSMs) are used in lots of different situations to model complex entity state. They're especially relevant in game dev for modeling dynamic AI behavior and decision-making. Here's a very rough sketch of what a finite state machine might look like:

{% include picture.html img="fsm" ext="JPG" alt="A finite state machine representation." shadow=false %}

An entity may transition from one state to another, or it may remain in its current state. The arrows denote transitions. The conditions under which a transition should take place will need to be coded into the FSM itself.

In this finite state machine tutorial, I'll help you understand the state design pattern by building an FSM from the ground up for a simple problem, using C++ as the primary development language. However, note that you could just as well use a different object-oriented language, like Java or Python. Let's get started!

{% include linkedHeading.html heading="Finite State Machine Use Case: Modeling a Lightbulb" level=2 %}

Suppose we have a lightbulb that can have the following states:

- Off
- Low
- Medium
- High

We can model this using an enum:

{% capture code %}#pragma once

enum class LightState {
	Off,
	Low,
	Medium,
	High
};{% endcapture %}
{% include code.html file="LightState.h" code=code lang="cpp" %}

Every light is initially off. Calling a light's `toggle` method should advance it to the next state. A light that is off goes to low when toggled. A light that is low goes to medium. And so on. When we toggle a light that is high, it cycles back to off. How would you implement this?

This is actually a question I once encountered during an interview. It's a really great problem because there isn't just a single solution—you can do this in many creative ways. The most basic solution uses the modulo operator and cycles through an array of states, using an index to keep track of the current state.

However, I'd like to use this problem to introduce something called the **finite state design pattern**. It's not *needed* to solve this particular problem, but it's definitely useful. And it's also a good way to understand how finite state machines work. In practice, they are used to model more complex situations than just a lightbulb.

We'll look at two approaches to this problem. Let's get to it!

{% include linkedHeading.html heading="Approach #1: Using a State Transition Table (Map)" level=2 %}

Usually, whenever you can model a scenario with finite state machines, you can also model it with a simple **state transition table** that literally just maps the current state to the next state.

So, we'll model our light's state transitions with an actual map data structure, where the key is the current state and the value is the next state:

{% capture code %}#pragma once
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
};{% endcapture %}
{% include code.html file="LightState.h" code=code lang="cpp" %}

Let's also create our simple `Light` class:

{% capture code %}#pragma once
#include "LightState.h"

class Light
{
public:
	Light();
	void toggle();
	inline LightState getCurrentState() const { return currentState; }
	
private:
	LightState currentState;
};{% endcapture %}
{% include code.html file="Light.h" code=code lang="cpp" %}

{% capture code %}#include "Light.h"

Light::Light()
{
	currentState = LightState::Off;
}

void Light::toggle()
{
	currentState = lightTransitions[currentState];
}{% endcapture %}
{% include code.html file="Light.cpp" code=code lang="cpp" %}

As I mentioned earlier, a Light starts in the off state. Calling the `toggle` method advances the light to its next state, using the `lightTransitions` transition table.

Easy enough, right?

{% include linkedHeading.html heading="State Transition Table Drawbacks" level=3 %}

Now, we arrive at one of the limitations of a state transition table: What if we want to perform a certain action when we arrive at the next state, or before we leave the current state?

For example, maybe we want to toggle the intensity of the lightbulb with each state transition, play a sound, or use some other effects unique to a state.

We could certainly do this—just add some code before and after the line where we're changing the state:

{% capture code %}void Light::toggle()
{
	// ... do something here before the transition
	currentState = lightTransitions[currentState];
	// ... do something here after the transition
}{% endcapture %}
{% include code.html file="Light.cpp" code=code lang="cpp" %}

But usually, the actions that we want to take before and after a state transition are *state dependent*. This means that we'll need to use a `switch` statement, or a bunch of conditionals, to check what state we're currently in so we can act accordingly. That will become very difficult to maintain if the number of states increases!

Hmm... There's got to be a better way. (If there weren't, I wouldn't be writing this post!)

{% include linkedHeading.html heading="Approach #2: Implementing a Finite State Machine" level=2 %}

Now that we've looked at how to create a state transition table, we can implement a finite state machine.

Here's a bit of a thought exercise before we get to the actual implementation details:

Instead of using a state transition table, what if we could delegate the task of determining the next state to the *current state* that our light is in? In other words, I'm proposing that we do something like this, where invoking a light's `toggle` method in turn invokes the current state's `toggle` method:

{% capture code %}#pragma once
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
};{% endcapture %}
{% include code.html file="Light.h" code=code lang="cpp" copyable=false %}

{% capture code %}#include "Light.h"

// TODO: set the initial state here
Light::Light()
{
}

void Light::setState(LightState& newState)
{
	currentState->exit(this);  // do stuff before we change state
	currentState = &newState;
	currentState->enter(this); // do stuff after we change state
}

void Light::toggle()
{
	// Delegate the task of determining the next state to the current state
	currentState->toggle(this);
}{% endcapture %}
{% include code.html file="Light.cpp" code=code lang="cpp" copyable=false %}

Then, somewhere inside the current state's `toggle` method, we call the light's `setState` method and pass in the new state that we want to go to:

```cpp
void SomeLightState::toggle(Light* light)
{
	light->setState(SomeOtherLightState::getInstance());
}
```

If none of that code makes sense right now, don't worry—I'm about to break it all down step by step.

This is known as the **finite state design pattern**. Per this pattern, each state is modeled as a concrete class. So we'll need need the following four states for our lightbulb:

- `LightOff`
- `LowIntensity`
- `MediumIntensity`
- `HighIntensity`

Let's model this finite state machine with a simple diagram:

{% include picture.html img="light-fsm" ext="JPG" alt="Modeling our lightbulb's FSM." shadow=false %}

Each class implements a common `LightState` interface that provides the following three methods:

- `enter(Light*)`: What should happen as we enter this state?
- `toggle(Light*)`: What should happen when we're in this state?
- `exit(Light*)`: What should happen as we're exiting this state?

All three methods accept a pointer to the `Light` object with which the state is associated.

How do they gain access to this pointer? Well, recall that we invoked `toggle` in our `Light` class like so:

```cpp
void Light::toggle() 
{
	currentState->toggle(this);
}
```

Basically, we pass in a pointer to ourselves (`this`). While doing so may seem pointless, it becomes more important in game development because it allows the state to ask the entity certain questions, like how much health it currently has and so on. The state can then use that information to decide what state the entity should transition to. Clearly, in the case of a lightbulb, there isn't really any information to poll.

One final note: Each state class typically follows the [singleton design pattern](https://refactoring.guru/design-patterns/singleton) to avoid unnecessary memory allocations and deallocations as we transition from one state to another, and then potentially back to a state that we were already in at one point. With our lights, if we didn't use singletons, we'd have to recreate our states every time we made a transition, and that would be wasteful.

To understand how this all works in practice, we'll implement everything from scratch.

{% include linkedHeading.html heading="1. The <code>LightState</code> Interface" level=3 %}

Let's first define the abstract `LightState` class. You'll notice some forward declarations that are necessary to resolve circular includes that would otherwise throw off the C++ linker.

{% capture code %}#pragma once
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
};{% endcapture %}
{% include code.html file="LightState.h" code=code lang="cpp" %}

Since this is a **pure abstract class**, we cannot create an instance of it. The `LightState` interface allows us to take advantage of polymorphism so we can refer to a generic "state" without having to specify the true type of state that we're working with.

> **Note**: In practice, you would often take this a step further and create an abstract `Entity` class. You'd also create an abstract `EntityState` class that accepts this generic entity in its method signatures. So, instead of having `Light*` like we do above, we would have `Entity*`, and `Light` would simply extend `Entity`.

{% include linkedHeading.html heading="2. Concrete State Classes" level=3 %}

Next, we'll declare all of our concrete state classes. We'll force each one to be a singleton by doing the following:

1. Defining a static `getInstance` method that returns a pointer to the singleton.
2. Declaring all constructors, copy constructors, and assignment operators as private.

{% capture code %}#pragma once
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
};{% endcapture %}
{% include code.html file="ConcreteLightStates.h" code=code lang="cpp" %}

I created inlined, empty definitions for the `enter` and `exit` methods, as these are not essential for our purposes. They are merely there as placeholders, to show that you could fill those in if you wanted to. For example, you could fill these with print statements, or you could invoke some method on the light object that got passed in, such as `light->increaseGlow()`.

Let's also create definitions for all of the `toggle` and `getInstance` methods, to make things clearer:

{% capture code %}#include "ConcreteLightStates.h"

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
}{% endcapture %}
{% include code.html file="ConcreteLightStates.cpp" code=code lang="cpp" %}

I'm taking advantage of static variables to create my singletons in a legible manner. Moreover, note that I'm returning references, and not pointers, [to avoid leaking memory](https://gamedev.stackexchange.com/questions/141884/can-this-singleton-class-cause-a-memory-leak).

Notice how each `toggle` method initiates the appropriate state transition by invoking `light->setState(...)` and passing in a singleton, via a call to the next state's `getInstance` method.

{% include linkedHeading.html heading="3. The <code>Light</code> Class" level=3 %}

The final piece of the puzzle is the `Light` class, particularly the `setState` method:

{% capture code %}#pragma once
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
};{% endcapture %}
{% include code.html file="Light.h" code=code lang="cpp" %}

{% capture code %}#include "Light.h"
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
}{% endcapture %}
{% include code.html file="Light.cpp" code=code lang="cpp" %}

This is where the `enter` and `exit` methods come into play. Before we change states, we call the exit method on the previous state. Then, we set the current state to the new state and invoke the enter method. But again, since we haven't defined the behavior for these two methods, they won't really do anything; they're just here to show you that you *could* do those things if you wanted to.

And we're done! This is a pretty standard finite state machine implementation, and you can easily extend this to any other object-oriented language, or even to JavaScript.

{% include linkedHeading.html heading="Testing Our Code" level=2 %}

I use Visual Studio whenever I work with C++, so naturally, I'm also going to use the [Microsoft Unit Testing Framework for C++](https://docs.microsoft.com/en-us/visualstudio/test/how-to-use-microsoft-test-framework-for-cpp?view=vs-2019) to verify that my finite state machine works as intended. This framework is built into Visual Studio 2017 and 2019. If you're not using Visual Studio, feel free to use a different IDE and whatever framework is available to you; the logic should be similar.

Below is my test file. Note that you may need to change some of your includes if you named your primary project differently:

{% capture code %}#include "stdafx.h"
#include "CppUnitTest.h"
#include "../LightbulbFSM/Light.h"
#include "../LightbulbFSM/Light.cpp"
#include "../LightbulbFSM/ConcreteLightStates.h"
#include "../LightbulbFSM/ConcreteLightStates.cpp"

class LightState;

namespace Microsoft
{
	namespace VisualStudio
	{
		namespace CppUnitTestFramework
		{
			template<> static std::wstring ToString<LightState>(LightState* state)
			{
				if (state == &LightOff::getInstance())
				{
					return L"Off";
				}
				else if (state == &LowIntensity::getInstance())
				{
					return L"Low";
				}
				else if (state == &MediumIntensity::getInstance())
				{
					return L"Medium";
				}
				else if (state == &HighIntensity::getInstance())
				{
					return L"High";
				}

				return L"nullptr";
			}

			namespace TestLightbulbFSM
			{
				TEST_CLASS(TestLightbulbFSM)
				{
				public:
					TEST_METHOD_INITIALIZE(Initialize)
					{
						light = new Light();
					}

					TEST_METHOD_CLEANUP(Cleanup)
					{
						delete light;
					}

					TEST_METHOD(InitialStateIsOff)
					{
						Assert::AreEqual(&LightOff::getInstance(), light->getCurrentState());
					}

					TEST_METHOD(OffGoesToLow)
					{
						light->toggle();
						Assert::AreEqual(&LowIntensity::getInstance(), light->getCurrentState());
					}

					TEST_METHOD(LowGoesToMedium)
					{
						light->toggle();
						light->toggle();
						Assert::AreEqual(&MediumIntensity::getInstance(), light->getCurrentState());
					}

					TEST_METHOD(MediumGoesToHigh)
					{
						light->toggle();
						light->toggle();
						light->toggle();
						Assert::AreEqual(&HighIntensity::getInstance(), light->getCurrentState());
					}

					TEST_METHOD(HighGoesToOff)
					{
						light->toggle();
						light->toggle();
						light->toggle();
						light->toggle();
						Assert::AreEqual(&LightOff::getInstance(), light->getCurrentState());
					}

				private:
					Light* light;
				};
			}
		}
	}
}{% endcapture %}
{% include code.html code=code lang="cpp" %}

Notice how I defined a test method for each state transition:

- Initially Off
- Off to Low
- Low to Medium
- Medium to High
- High back to Off

> **Note**: The `ToString` method at the top is needed to resolve a pretty common error that you'll run into with this unit testing framework.

If we run our test suite, we can verify that all of the tests passed:

{% include picture.html img="tests" ext="JPG" alt="All tests passed successfully in Visual Studio." %}

Awesome!

{% include linkedHeading.html heading="More Finite State Machine Examples" level=2 %}

As I mentioned earlier, this was a pretty trivial use case for finite state machines. In fact, you don't really need the finite state design pattern to solve this particular problem. However, because the problem itself is so simple—a lightbulb that simply changes from one state to another—I felt it was a perfect way to introduce FSMs without overcomplicating things.

That said, I'd like to briefly mention some other situations where you may wany to use a finite state machine:

- [Modeling a vending machine](https://stackoverflow.com/questions/14676709/c-code-for-state-machine). This StackOverflow thread offers a pretty good discussion of some design approaches to a real-world interview problem. The accepted answer suggests using the finite state design pattern because of how extensible it is. Interestingly, the second highest rated answer suggests using a state transition table as an alternative.
- [Modeling AI in a game](https://gameprogrammingpatterns.com/state.html). This post goes into great detail in the context of game dev. In particular, it highlights one advantage of finite state machines in game dev that I mentioned earlier in this post: The ability to query or "poll" the entity from the state in order to determine what state transition should take place.

{% include linkedHeading.html heading="Further Reading" level=2 %}

To gain a better understanding of finite state machines, I encourage you to reference the book titled *Programming Game AI by Example*, by Mat Buckland. Chapter 2 covers the state-driven agent design pattern, which is essentially just another name for the FSM design pattern. You can [download the companion code](https://github.com/wangchen/Programming-Game-AI-by-Example-src) and run it yourself as you work through the chapter explanations. This is how I initially learned about finite state machines.

I hope you found this tutorial helpful!
