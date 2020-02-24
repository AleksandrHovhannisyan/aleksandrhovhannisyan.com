---
title: "Invincibility Frames in Unity: How to Make a Player Flash When Taking Damage"
description: "Learn how you can make a player flash when they take damage. This is the notion of invincibility frames, also known as i-frames. You can observe this in many old/retro games, as well as in games like The Binding of Isaac."
tags: [dev, game-dev, csharp]
isCanonical: true
---

In this post, we'll look at how you can make a player flash when they take damage. This is the notion of **invincibility frames**, also known as i-frames. You'll find this in many retro games like The Legend of Zelda, Super Mario, The Binding of Isaac, and others.

<figure>
    {% include posts/picture.html img="isaac" ext="GIF" alt="Invincibility frames in the Binding of Isaac" shadow=false %}
    <figcaption><a href="https://braintrash83.tumblr.com/post/93502135046">GIF source</a></figcaption>
</figure>

To keep this tutorial simple, I'll assume that you already have:

1. A way to detect collisions between projectiles/mobs and the player.
2. A way to hurt the player. Let's call this method `LoseHealth(int amount)`.

If you want to see this demo in action, check out [Embody](https://github.com/cap4053-cheeky-pixels/EmbodyGame), a game I developed with some classmates for the Artificial Intelligence for Games class at the University of Florida.

{% include linkedHeading.html heading="How to Make a Player Flash When Taking Damage (with Coroutines!)" level=2 %}

The naive approach is to run a `for` loop, with an intentional delay between each iteration using deltatime, in your main `Update` loop, and to try to make the player flash in each iteration. But if you do this, you won't actually observe any flashing. Why is that?

In game development, you have to keep in mind that everything happens within a **frame update**. What this means is that most game engines have an `Update` method that runs the entire game's logic in "ticks." So, if you have a `for` loop inside the update loop, it'll complete all of its iterations in a single frame. Thus, any oascillating UI changes that were intended to be gradual—like the player model flashing—will be (almost) immediate, and therefore imperceptible.

Instead, we want to use [coroutines](https://docs.unity3d.com/Manual/Coroutines.html) to implement invincibility frames in Unity. A coroutine is simply a method that will run in parallel to the main update loop and resume where it left off in the next update.

{% include linkedHeading.html heading="Invincibility Frames in Unity" level=3 %}

We'll start by adding this method somewhere in our Player script:

```csharp
private IEnumerator BecomeTemporarilyInvincible()
{
    // logic goes here
}
```

Notice that this method returns an `IEnumerator`; all coroutines in Unity do that.

We'll use a flag to keep track of whether the player is invincible. Add this member variable to your script:

```csharp
private bool isInvincible = false;
```

Next, when the player becomes invincible, we flip this flag to true:

```csharp
private IEnumerator BecomeTemporarilyInvincible()
{
    Debug.Log("Player turned invincible!");
    isInvincible = true;
}
```

Of course, this doesn't do anything (yet!). You're probably wondering:

1. How do we start the coroutine in the first place?
2. How do we keep the coroutine running for a set amount of time?
2. How do we make the player flash while they're invulnerable to damage?

All great questions! We'll address each one in turn.

{% include linkedHeading.html heading="1. Losing Health and Becoming Invincible (Starting the Coroutine)" level=2 %}

Ready for this? It's actually stupidly simple.

Again, I'll assume that you're using something like `LoseHealth(int amount)`:

```csharp
public void LoseHealth(int amount)
{
    if (isInvincible) return;

    Health -= amount;
    
    // The player died
    if (Health <= 0)
    {
        Health = 0;
        // Broadcast some sort of death event here before returning
        return;
    }

    StartCoroutine(BecomeTemporarilyInvincible());
}
```

First, we [fail-fast](https://softwareengineering.stackexchange.com/a/230460/333842) if the player is already invincible. If they're not invincible, the player loses health. If the player died as a result of losing health, we set their health to zero, potentially fire off a death event, and return. Finally, if the player took damage but is still alive, we use `StartCoroutine` to initiate the coroutine that grants the player temporary invincibility.

> **Tip**: Is your Player script checking for collisions with hostile entities in the world and self-inflicting damage? If so, rethink your approach. Instead, try having your damage sources check for collision with a designated "enemy" layer. This makes your logic much easier to follow.

{% include linkedHeading.html heading="2. Keep the Coroutine Running for a Set Amount of Time" level=2 %}

Here's what we want:

1. Invincibility should only last for a set period of time.
2. There should be a fixed delay after each invincibility frame.

Add these two private members at the top of your script:

```csharp
[SerializeField]
private float invincibilityDurationSeconds;
[SerializeField]
private float delayBetweenInvincibilityFlashes;
```

> `SerializeField` lets you edit private members through the Unity inspector without having to make them public.

You'll need to initialize these two members via the Inspector pane:

{% include posts/picture.html img="inspector" ext="JPG" alt="Initializing serialized fields via the inspector pane in Unity." shadow=false %}

Once you've done that, use them in the coroutine to run a simple loop:

```csharp
private IEnumerator BecomeTemporarilyInvincible()
{
    Debug.Log("Player turned invincible!");
    isInvincible = true;

    // Flash on and off for roughly invincibilityDurationSeconds seconds
    for (float i = 0; i < invincibilityDurationSeconds; i += delayBetweenInvincibilityFlashes)
    {
        // TODO: add flashing logic here
        yield return new WaitForSeconds(delayBetweenInvincibilityFlashes);
    }

    Debug.Log("Player is no longer invincible!");
    isInvincible = false;
}
```

The key part here is the loop, especially the following line:

```csharp
yield return new WaitForSeconds(delayBetweenInvincibilityFlashes);
```

We pause coroutines in Unity using `WaitForSeconds` and pass in the number of seconds to wait. In this case, that's the delay beween each flash, which you've hopefully set in your inspector by now.

I find that a duration of `1.5 s` works best, with the delay set to `0.15 s`. This means the loop will run `1.5 / 0.15 = 10` times. Since the player model transitions between two states (visible/invisible) across 10 iterations, you'll observe that there are `10 / 2 = 5` flashes in total:

{% include posts/picture.html img="flashes" ext="JPG" alt="The number of flashes that occur with those settings." %}

{% include linkedHeading.html heading="3. Make the Player Flash While Invincible" level=2 %}

The easiest way to simulate flashing is to repeatedly scale the player's model (or sprite, for 2D) between `0` and `1` during each iteration of the loop. So first, we need to actually get ahold of the player model. We'll add a member for it:

```csharp
[SerializeField]
private GameObject model;
```

**Note**: For this tutorial to work, the Player should consist of a root object (e.g., `MainPlayer`) that has a collision box and the Player script attached to it. Nested under that object should be the player's model (e.g., `Model`) as a separate object:

{% include posts/picture.html img="model" ext="JPG" alt="The object hierarchy of the player." shadow=false %}

**This is important**! You should not use the root player object as the model. If you do, this could lead to some very game-breaking bugs, as scaling the root object would also scale the player's collider.

In your editor, go ahead and drag the model object into the appropriate slot in the Player script, like so:

{% include posts/picture.html img="add-model" ext="GIF" alt="Adding the model object to the player script." shadow=false %}

Next, we'll add a method that lets us easily scale this model:

```csharp
private void ScaleModelTo(Vector3 scale)
{
    model.transform.localScale = scale;
}
```

And finally, we'll actually do the scaling in our coroutine:

```csharp
private IEnumerator BecomeTemporarilyInvincible()
{
    Debug.Log("Player turned invincible!");
    isInvincible = true;

    // Flash on and off for roughly invincibilityDurationSeconds seconds
    for (float i = 0; i < invincibilityDurationSeconds; i += delayBetweenInvincibilityFlashes)
    {
        // Alternate between 0 and 1 scale to simulate flashing
        if (model.transform.localScale == Vector3.one)
        {
            ScaleModelTo(Vector3.zero);
        }
        else
        {
            ScaleModelTo(Vector3.one);
        }
        yield return new WaitForSeconds(delayBetweenInvincibilityFlashes);
    }

    Debug.Log("Player is no longer invincible!");
    ScaleModelTo(Vector3.one);
    isInvincible = false;
}
```

Depending on the numbers you select for `invincibilityDurationSeconds` and `delayBetweenInvincibilityFlashes`, you could end up in a situation where the player's invincibility runs out on the loop iteration where we set its scale to zero. Thus, we forcibly scale the model to one at the very end for safe measure.

And that's it—you're all set to use invincibility frames in your game!

{% include linkedHeading.html heading="Can I Use This Approach in Other Game Engines?" level=2 %}

Yes and no.

In game engines like Unreal, there is unfortunately no support for coroutines. As an alternative to this approach, you can keep track of the time that has elapsed since invulnerability was initiated, across multiple `Update` frames, using simple deltatime calculations. (This approach differs from the naive one mentioned in the intro.)

Godot, on the other hand, [does have them](https://docs.godotengine.org/en/3.1/getting_started/scripting/gdscript/gdscript_basics.html#coroutines-with-yield).

I hope you found this tutorial helpful!