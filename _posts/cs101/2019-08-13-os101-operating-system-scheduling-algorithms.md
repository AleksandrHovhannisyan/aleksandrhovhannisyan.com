---
title: "OS101: Operating System Scheduling Algorithms"
description: Sharing is caring. Let's take a look at how operating systems schedule processes to run on the CPU.
keywords: [operating system scheduling algorithms, non-preemptive scheduling algorithms, preemptive scheduling algorithms]
---

If you're studying operating systems and looking for an in-depth explanation of the most common scheduling algorithms, you've come to the right place. In this post, we'll take a look at a number of specific scheduling algorithms. I'll provide plenty of accompanying visuals to help you understand them better. Let's get started!

{% include linkedHeading.html heading="Prerequisite Terminology" level=2 %}

Before proceeding, make sure you understand the following terms:

- **Scheduler**: A special system program that manages the allocation of resources to processes. Those resources are usually a computer's CPU and main memory.
- **Suspension**: A computer has a limited amount of main memory. Thus, schedulers may decide to swap out idle processes from memory onto the disk to temporarily free up space for other processes. This is known as suspending the process.
- **Ready queue**: A queue of all processes that are waiting to be scheduled to run on the CPU. Processes line up in the ready queue as they arrive. If a process still has work remaining when it is taken off the CPU by the scheduler, it may be put back on the ready queue for re-scheduling at a later time; alternatively, it may be suspended.
- **Blocking**: A process that is blocked is waiting on the completion of a certain event. Usually, that event is some input/output (I/O) operation. Since I/O operations are privileged and require switching to kernel mode, the process must wait for the CPU to attend to those tasks before it can resume execution. Blocked processes are unblocked by the scheduler and either placed back on the ready queue or swapped out of main memory (suspended). By definition, a blocked process is not currently running on the CPU.
- **Starvation**: We say that a process that needs to use a computing resource (e.g., the CPU) but has been unable to do so for a considerable amount of time (relative to other processes) is being *starved*. One of the primary goals of a scheduler is to circumvent starvation.
- **Context switch**: The collective state of memory and the CPU registers associated with a running process is known as that process's execution *context*. A context *switch* occurs when the CPU goes from executing one process to executing another. To make this possible, the scheduler stores a snapshot of the current process's state somewhere on disk or memory so we can restore it at a later time and resume execution where the process last left off.

{% include linkedHeading.html heading="Overview: Preemptive and Nonpreemptive Scheduling Algorithms" level=2 %}

When studying scheduling algorithms, we have two high-level classifications: preemptive and nonpreemptive algorithms. Let's look at each one in turn.

### 1. Non-preemptive Scheduling Algorithms (NP)

In non-preemptive scheduling, a process runs to completion or until it blocks. While that process is running, its CPU time cannot be revoked by the scheduler (unless the OS forcibly kills the process for some other reason). Other processes in the ready queue must patiently wait their turn.

<table class="pro-con-table">
    <tr>
        <th>Benefits of non-preemptive scheduling</th>
        <th>Drawbacks of non-preemptive scheduling</th>
    </tr>
    <tr>
        <td>CPU doesn't have to frequently perform context switches</td>
        <td>Greater potential for process starvation if current process takes a long time to finish.</td>
    </tr>
</table>

These are the examples of non-preemptive scheduling algorithms that we'll look at:

- First come first serve
- Shortest job first (aka shortest job next)
- Priority scheduling

> **Analogy**: Let's use the classic family TV as an analogy for a CPU. Everyone wants to use it for something (usually streaming movies and shows or playing video games). With non-preemptive scheduling, each family member will use the TV for a set period of time and only give someone else a turn when they're finished. For example, if you plan to binge three 40-minute episodes of your favorite show on Netflix, then you'll watch all of them in succession, without giving anyone else a turn, until you're done.

### 2. Preemptive Scheduling Algorithms (P)

On the other hand, with preemptive scheduling, a process executes for set increments of time that are allocated by the scheduler. Once the time is up, if the process still has work remaining, it will be temporarily taken off the CPU to allow other processes to run. This results in a context switch.

With preemptive algorithms, we follow these steps:

1. The scheduler sets a timer for the process's current "increment" of work.
2. The scheduler sets the [program counter](https://en.wikipedia.org/wiki/Program_counter) (PC) register to point to the process's address.
3. The CPU executes the process's instructions.
4. At some point, the timer goes off and issues an interrupt.
5. Control of the CPU is yielded to the OS.
6. The OS invokes the scheduler, and the scheduler may then preempt the process.

Those steps are then repeated for as many processes as needed.

<table class="pro-con-table">
    <tr>
        <th>Benefits of preemptive scheduling</th>
        <th>Drawbacks of preemptive scheduling</th>
    </tr>
    <tr>
        <td>Gives users the impression that processes are not being starved.</td>
        <td>Involves more context switches, which can decrease CPU utilization.</td>
    </tr>
    <tr>
        <td>Good for responsiveness or whenever user input is important.</td>
    </tr>
</table>

These are the examples of preemptive scheduling algorithms that we'll look at:

- Round robin scheduling
- Shortest remaining time first
- Preemptive priority scheduling
- Proportionate scheduling

> **Analogy**: Now, let's say we're dealing with siblings and a single gaming console. To encourage fairness, their parents have one simple rule: Each kid can only play for 20 minutes at a time. Once that period of time is up, it's someone else's turn to play, even if the previous sibling was already in the middle of a match. They continue taking turns like this until everyone's finished playing. This is analogous to round-robin scheduling.

When we actually look at the individual scheduling algorithms in this post, I'll classify them as either (P) for preemptive or (NP) for non-preemptive.

{% include linkedHeading.html heading="Scheduling Algorithm Metrics" level=2 %}

We use four simple metrics when studying scheduling algorithms:

- **Throughput**: in the context of scheduling, this refers to the number of jobs completed per unit of time. More generally, throughput is just a measure of how much "work" we're getting done per unit of time. For example, if we completed `5` jobs in a total period of `60s`, then our scheduler's throughput can be expressed as `5/60 = 0.08 jobs/s`.
- **Turnaround time**: the difference between the time at which a process finishes all of its work and the time at which the process arrived in the ready queue. The wording here is very important: It is not the difference between the time when the process finishes all of its work and the time at which the process *began* its work; a process may arrive and then immediately have to wait its turn. Thus, turnaround time is *not* a measure of how much *CPU time* a process uses; it includes periods of inactivity when a process is waiting its turn. For example, if process C arrives at time `t = 5s` and finishes all of its work at time `t = 60s`, then its turnaround time, regardless of how much of it was spent active or idle, is `60 - 5 = 55s`.
- **Mean turnaround time (MTT)**: the average turnaround time for all processes. For example, suppose we have processes A, B, and C with turnaround times of `10s`, `5s`, and `12s`, respectively. Our mean turnaround time is then `(10 + 5 + 12) / 3 = 9s`.
- **CPU utilization**: the fraction of time during which the CPU is actively executing process instructions as opposed to servicing I/O operations. Suppose we have `n` independent processes. If the probability of any process requesting I/O operations is `p`, then by independence, the total probability of I/O operations occurring is `p^n`. Therefore, our CPU utilization is the total percentage of work minus the percentage of work "wasted" on I/O. Mathematically, this can be expressed as `1 - p^n` (assuming that context switches are negligible, which isn't always the case).

{% include linkedHeading.html heading="Categories of Scheduling Algorithm Systems" level=2 %}

So far, we've looked at the terms preemptive and non-preemptive scheduling. But there are actually three overarching categories that we'll group our scheduling algorithms into (and then classify them as either preemptive or non-preemptive). These are based on the types of systems we're working with:

1. **🔨 Batch systems**: run several jobs in batches. Think of them as workhorses. Goals:

    - Maximize throughput (get more work done).
    - Minimize mean turnaround time (MTT).
    - Maximize CPU utilization (waste less time being idle).

2. **🖥️ Interactive systems**: involve lots of user input or interaction (e.g., ordinary PCs). Goals:
    - Responsiveness: decrease response time to user requests (little if any input "lag").
    - Meet user expectations about how long certain operations should take (e.g., for opening a file).

3. **🕓 Real-time systems**: must meet sensitive deadlines. Accurate timing is crucial. Goals:

    - Meet deadlines to avoid losing data or other valuable resources.
    - Predictability: behave as expected and not erratically.

{% include linkedHeading.html heading="1. Batch Scheduling Algorithms" level=2 %}

Reminder: Batch systems have to keep up with a large number of processes. Thus, their primary goal is to increase throughput and complete as many of those jobs as possible while maximizing CPU utilization.

### First Come First Serve (NP)

First come first serve is a fair and simple non-preemptive algorithm that runs jobs in the order in which they arrived. However, because this algorithm is so naive, it doesn't always guarantee the best results.

{% include posts/picture.html img="first-come" ext="JPG" alt="First come first serve scheduling algorithm." %}

Notice that while B arrives at `t = 2s`, it does not get to run until A finishes its work at `t = 8s` because this is a non-preemptive algorithm. Here are the calculations for each process:

- A's turnaround time = `8s - 0s = 8s`
- B's turnaround time = `12s - 2s = 10s`
- C's turnaround time = `14s - 5s = 9s`
- Mean turnaround time = `(8s + 10s + 9s) / 3 = 9s`

> **Note**: When we look at specific examples of scheduling algorithms, as we did here, you'll see a precise number listed under "CPU time" in the accompanying table. In practice, the best we can do is to predict how much time a process is going to use; we can't know a process's expected CPU time for certain.

### Shortest Job First (NP), aka Shortest Job Next

In this algorithm, when deciding which process to run next, we pick the one whose estimated total duration is the lowest among all processes currently in the queue; we then allow that process to run to completion without any preemption.

If all jobs arrive at the same time, then this algorithm is always optimal in terms of mean turnaround time. This is because we're able to minimize the amount of idle CPU time across the board by picking an *optimal sequence of execution* for processes.

{% include posts/picture.html img="shortest-job" ext="JPG" alt="Shortest job first scheduling algorithm." %}

- A's turnaround time = `8s - 0s = 8s`
- B's turnaround time = `14s - 2s = 12s`
- C's turnaround time = `10s - 5s = 5s`
- Mean turnaround time = `(8s + 12s + 5s) / 3 = 8.3s`

At `t = 0s`, A was the only "shortest" process we knew of, so we allowed it to execute for its full duration. But by the time we arrived at `t = 8s`, we already had B and C lined up in the ready queue, so we then picked the shorter of the two (C) to run next.

<blockquote>
    <p>
        <strong>Exercise</strong>: What would the mean turnaround time have been if A had instead arrived at <code>t = 5s</code> and C had arrived at <code>t = 0s</code>? Answer: <span class="spoiler">C's turnaround = <code>2s</code>, B's turnaround = <code>4s</code>, and A's turnaround = <code>9s</code>, for a mean turnaround time of <code>5s</code>.</span>
    </p>
</blockquote>

### Shortest Remaining Time First (P)

This algorithm is the shortest job first algorithm above but with preemption. Whenever a new process arrives in the queue, we check all processes to see which one has the least amount of estimated time remaining until 100% completion. That's the process we'll run next.

If the process that's currently running is tied with another during this selection process, we'll obviously always prefer to continue running the current process so we don't waste time on performing a context switch.

{% include posts/picture.html img="shortest-remaining" ext="JPG" alt="Shortest remaining time first scheduling algorithm." %}

For example, we swap A out for B at `t = 2s` because B has the least amount of time remaining among all processes that have arrived so far (only `4s` as opposed to A's remaining `6s`).

- A's turnaround time = `14s - 0s = 14s`
- B's turnaround time = `6s - 2s = 4s`
- C's turnaround time = `8s - 5s = 3s`
- Mean turnaround time = `(14s + 4s + 3s) / 3 = 7s`

With this algorithm, some processes may end up being starved if a bunch of shorter processes continue to arrive. That's the case here with A—it arrived at `t = 0s` but didn't get to finish its work until the very end, at `t = 14s`.

<blockquote>
    <p>
        <strong>Question</strong>: Why didn't we swap out B for C when C arrived at <code>t = 5s</code>? Answer: <span class="spoiler">Because at <code>t = 5s</code>, B had a remaining time of <code>1s</code>, whereas C, which just arrived, has a remaining time of <code>2s</code>. We continue executing B because it has the shorter remaining time.</span>
    </p>
</blockquote>

{% include linkedHeading.html heading="2. Interactive Scheduling Algorithms" level=2 %}

Reminder: Interactive systems involve a lot of user input and must therefore be responsive.

### Round Robin Scheduling (P)

This is a classic and straightforward scheduling algorithm. Here's how it works:

1. Processes line up in a queue as they arrive.
2. The process at the front of the queue gets to run for a certain pre-defined block of time known as a *quantum* (e.g., 2 seconds).
3. Once the process finishes its quantum, if it still has work remaining, it's taken off the CPU and put at the back of the queue so it can run again later.
4. The next process at the front of the queue is then selected for scheduling.

Steps 1-4 repeat until no more processes remain.

{% include posts/picture.html img="round-robin" ext="JPG" alt="Round robin scheduling algorithm." %}

I used dashed vertical lines here to denote the times at which each process arrived in the queue, just to make things easier to understand. Notice that even though C arrives at time `t = 5s`, it does not begin working until after B gets to run again. Why? Because of step 3: When B finishes its work at time `t = 4s`, it is put back on the queue (because it is not yet finished with all of its work). Thus, B precedes C on the queue.

> **Note 1**: If the amount of time remaining for a process is less than its quantum (e.g., only `1s` of work remaining but with an allocated quantum of `2s`), then we won't "waste" the remainder of the quantum just waiting around—the scheduler will simply treat that as a completed quantum and will proceed as normal to schedule the next process.

> **Note 2**: It's important to select a good quantum. If we select one that's too short, then we'll be frequently performing context switches, which can become expensive (decreasing CPU utilization). On the other hand, if the quantum we select is too large, then the system will be unresponsive to user input until the current process finishes executing for its quantum of time.

### Preemptive Priority (P)

The preemptive priority scheduling algorithm is a variation of Round Robin scheduling. Whereas the traditional Round Robin algorithm puts all processes in the same queue, this algorithm uses multiple priority queues *separately*.

Each queue represents a priority level. Each process is assigned a numerical priority based on how important it is deemed to be; these range from high (e.g., `1` for most important) to low (e.g., `4` for, say, least important). Note that lower numbers are being used to designate a higher priority or "importance" in this case. When a process arrives, it is placed at the back of whatever queue matches its priority level. For example, if process X has a priority level of `2`, then it's grouped with all the other `2`-priority processes in the corresponding queue.

The scheduler runs the Round Robin algorithm on processes within the same queue, preferring queues with higher priorities to ones with lower priorities. Only once the current queue has been emptied will the scheduler proceed to the next immediate priority queue.

> **Note**: If at any point a process arrives in a queue with a higher priority than whatever queue we are currently working on, then the scheduler will give preference to that higher priority process upon the next quantum "tick."

{% include posts/picture.html img="preemptive-priority" ext="JPG" alt="Preemptive priority scheduling algorithm." %}

In this example, A and B take turns alternating on the CPU in classic Round Robin fashion because both have a higher priority than any other process (C has a lower priority of `2`). Once they're both fully exhausted, the CPU sees that the only queue left is the one with C. So C gets scheduled and runs to completion.

- A's turnaround time = `12s - 0s = 12s`
- B's turnaround time = `8s - 2s = 6s`
- C's turnaround time = `14s - 5s = 9s`
- Mean turnaround time = `(12s + 6s + 9s) / 3 = 9s`

<blockquote>
    <p>
        <strong>Question</strong>: What would happen at <code>t = 2s</code> if A instead had a priority level of <code>2</code>? Answer: <span class="spoiler">A would still run from <code>t = 0s</code> to <code>t = 2s</code> because there are no other processes present during that time. However, as soon as B arrives at <code>t = 2s</code>, we have a higher priority queue that must be attended to. Therefore, A's remaining work will be put on hold until B finishes.</span>
    </p>
</blockquote>

### Proportionate Scheduling (P)

As its name suggests, proportionate scheduling aims to ensure a fair allocation of CPU time among processes. There are three types of proportionate scheduling that we can use:

1. **💯 Guaranteed scheduling**: Tries to evenly split CPU time among processes to maximize fairness. If we have `n` processes, then we shouldn't ever allow any process to exceed `1/n` fraction of the total runtime. We do this by repeatedly "inching" each process along and keeping track of how much time they've all used. For example, suppose we have processes A, B, and C that so far have run for `2s`, `3s`, and `1s`. (Assume we haven't yet put our algorithm into practice.) The total CPU time thus far is `6s`. Split among three processes, this means each process should've ideally used `2s` of CPU time. Clearly, that's not the case—B has been given preferential treatment. We'll allow C to run first until it hits `3s` and then run A for an additional `1s` to balance things out.
2. **🎲 Lottery scheduling**: Each process is allocated a certain number of virtual "tickets." At set intervals, the scheduler will draw a ticket at random and allow the winning process to run on the CPU. This solves the problem of starvation: As long as we give at least one ticket to each process, then we're able to guarantee a non-zero probability of selection. The idea here is that a process with a fraction `f` of the total tickets will get to use the CPU for a fraction `f` of the time. Notice that if we assign each process the same number of tickets, then we're using guaranteed scheduling!
3. **🤝 Fair-share scheduling**: So far, we've focused on ensuring fairness among *processes*. In fair-share scheduling, the focus shifts to the *user*. Specifically, on multi-user systems, the idea is to allocate a fair amount of CPU time to each user (and/or user group) to ensure that no user is being "starved" of the opportunity to use the system. The Wikipedia article on [fair-share scheduling](https://en.wikipedia.org/wiki/Fair-share_scheduling) provides excellent examples to make this clearer.

{% include linkedHeading.html heading="3. Real-Time Scheduling Algorithms" level=2 %}

Real-time scheduling algorithms are grouped into two primary categories:

### Static Scheduling

With static scheduling, decisions about what to run next are not made in real time. We can do this by:

1. Feeding the system a pre-made list of processes and the order in which they should run. This can help us save time that would otherwise be lost due to an inefficient scheduling algorithm or real-time decision-making (if there are lots of processes to run).
2. Building scheduling decisions into our code by means of control mechanisms like locks and semaphores to allow [threads](https://docs.microsoft.com/en-us/windows/win32/procthread/processes-and-threads) to take turns and to share resources like the CPU, RAM, buffers, files, and so on. When a thread attempts to claim a lock on a resource that's currently in use, it will simply be blocked until that resource is freed.

### Dynamic Scheduling

Dynamic scheduling is a broad category of scheduling that employs any of the algorithms we've looked at so far. However, in the context of real-time systems, it prioritizes scheduling according to the system's deadlines:

- **⚠️ Hard real-time deadlines** are ones that we simply can't afford to miss; doing so may result in a disaster, such as a jet's flight controls failing to respond to a pilot's input.
- **😕 Soft real-time deadlines** are ones that will produce a minor inconvenience if they aren't met. An example of this is a video whose audio isn't properly synced, causing a noticeable delay between what is shown and what's actually heard.

Thus, while static scheduling is employed before the system ever receives its first process, dynamic scheduling is employed on the fly, making decisions about which processes to schedule as they arrive in real time. Leaving things up to the hardware like this can have its advantages. For one, it guarantees some sort of scheduling optimization among threads regardless of how the code was originally written.

## Wrap-up

That's about it for scheduling algorithms!

The best way to master scheduling algorithms is to work through the examples on your own using pen and paper. This is especially true for problems involving preemptive priority or round robin scheduling.

I hope you found this post helpful. If not, please [let me know how I can improve it](https://github.com/AleksandrHovhannisyan/aleksandrhovhannisyan.github.io/issues/new/choose).

