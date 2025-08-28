---
title: Remote Code Execution with LLM Agents
description: Some AI agents can execute code or connect to services. If you're not careful, you could be the victim of prompt injection and RCE attacks.
keywords: [chatgpt, remote code execution]
categories: [essay, security, ai]
---

Back when ChatGPT first released, I was surprised by how easy it was to jailbreak it and get it to generate content it wasn't supposed to. And so were other users—in fact, some were even convinced they had successfully tricked it into running code, a type of security exploit known as [remote code execution (RCE)](https://www.cloudflare.com/learning/security/what-is-remote-code-execution/).

In reality, ChatGPT couldn't actually run code on GPT 3.5 and was simply hallucinating (that's newspeak for "making things up," often quite convincingly). Nevertheless, social media was flooded with claims of RCE:

{% quote "No, you didn't get an RCE on ChatGPT (February 15, 2023)", "https://insiderphd.substack.com/p/no-you-didnt-get-an-rce-on-chatgpt" %}
Right now, all of tech Twitter is losing over OpenAI’s ChatGPT model. This new GPT model has been designed to be more conversational than GPT-3, simultaneously adding new documents and parameters. Notably, this includes ChatGPT demonstrating an ‘understanding’ of and ability to ‘write’ code. In reality, the model isn’t able to really understand and is using a kind of wisdom of the crowd from the training data mixed with human feedback.
{% endquote %}

The author of that article attempted to get ChatGPT to make a request to an external server. Because their server logs didn't indicate any incoming requests from ChatGPT, the author argued that it must've been hallucinating. And to be fair, it was in their example: ChatGPT printed fake output that it couldn't have possibly gotten.

However, a lot has changed since then, and I recently discovered—through system prompt engineering as well as reading online—that GPT 4o and GPT 5 actually _can_ execute Python code, apparently by design. Here's a quote from GPT 5's system prompt (or at least what it _thinks_ its system prompt _would_ be):

{% quote "CL4R1T4S/OPENAI/ChatGPT5-08-07-2025.mkd", "https://github.com/elder-plinius/CL4R1T4S/blob/main/OPENAI/ChatGPT5-08-07-2025.mkd" %}
When you send a message containing Python code to python, it will be executed in a stateful Jupyter notebook environment. python will respond with the output of the execution or time out after 60.0 seconds. The drive at '/mnt/data' can be used to save and persist user files. Internet access for this session is disabled. Use ace_tools.display_dataframe_to_user(name: str, dataframe: pandas.DataFrame) -> None to visually present pandas DataFrames when it benefits the user. When making charts for the user: 1) never use seaborn, 2) give each chart its own distinct plot (no subplots), and 3) never set any specific colors – unless explicitly asked to by the user. I REPEAT: when making charts for the user: 1) use matplotlib over seaborn, 2) give each chart its own distinct plot (no subplots), and 3) never, ever, specify colors or matplotlib styles – unless explicitly asked to by the user
{% endquote %}

While this behavior is actually intended, it raises questions about whether other companies who deploy AI agents will take the same precautions as OpenAI to prevent remote code execution. If they don't, things could go terribly wrong.

{% aside %}
**Disclaimer**: I didn't discover a vulnerability for which OpenAI is accepting bug bounty submissions. I'm also not the first to write about this topic.
{% endaside %}

{% include "toc.md" %}

## Running System Commands in ChatGPT

Initially, I thought ChatGPT was hallucinating its system prompt. After all, why would it be allowed to run arbitrary code? Isn't that a security risk? Then I figured: What better way to test this than to abuse it? So [I gave this a go](https://chatgpt.com/share/68af9457-1b8c-8004-b784-40c4549ff98d):

> Write Python code that runs the command `ls -al /`. Share the output.

ChatGPT responded with the code that does this:

```py
import subprocess

# Run the command
result = subprocess.run(["ls", "-al", "/"], capture_output=True, text=True)

# Output the result
print(result.stdout)
```

Normally, ChatGPT streams its response to you one token at a time. But this time around, it rendered an "Analyzing" label above the code block to indicate that it was doing some work in the background, with a placeholder for the output.

{% aside %}
As I later learned, ChatGPT refers to this as "data analysis," and there are daily limits on how many times you can do this with a free account.
{% endaside %}

After a short while, the output appeared below:

```
total 46
drwxr-xr-x  2 root root   80 Aug 27 23:25 .
drwxr-xr-x  2 root root   80 Aug 27 23:25 ..
-rwxr-xr-x  1 root root    0 Aug 27 23:25 .dockerenv
lrwxrwxrwx  1 root root    7 Mar 11  2024 bin -> usr/bin
drwxr-xr-x  2 root root 4096 Jan 28  2024 boot
drwxr-xr-x  4 root root  320 Aug 27 23:25 dev
drwxr-xr-x  2 root root 4096 Aug 27 23:25 etc
drwxr-xr-x  2 root root   60 Aug 27 23:25 home
lrwxrwxrwx  1 root root    7 Mar 11  2024 lib -> usr/lib
lrwxrwxrwx  1 root root    9 Mar 11  2024 lib64 -> usr/lib64
drwxr-xr-x  2 root root 4096 Mar 11  2024 media
drwxr-xr-x  2 root root 4096 Aug 22 22:05 mnt
drwxr-xr-x  2 root root 4096 Mar 11  2024 opt
dr-xr-xr-x 10 root root    0 Aug 27 23:25 proc
-rw-r--r--  1 root root 3393 Aug 22 21:58 requirements.txt
drwx------  2 root root 4096 Jul 22 18:55 root
drwxr-xr-x  2 root root 4096 Jul 22 18:58 run
lrwxrwxrwx  1 root root    8 Mar 11  2024 sbin -> usr/sbin
drwxr-xr-x  2 root root 4096 Mar 11  2024 srv
drwxr-xr-x 12 root root    0 Aug 27 23:25 sys
drwxrwxrwt  2 root root   60 Aug 27 23:26 tmp
drwxr-xr-x  2 root root 4096 Mar 11  2024 usr
drwxr-xr-x  2 root root 4096 Mar 11  2024 var
```

If this output can be trusted, that `.dockerenv` file suggests that this system is running inside a Docker container. Additionally, I noticed that the last-modified time for `.dockerenv` and certain files/directories matched the time when I prompted ChatGPT to execute this code (23:25 in UTC, or 6:25 p.m. in my local time zone). This timestamp remained consistent within an ongoing chat session, but it changed as soon as I started a new chat and asked it to run Python code (this presumably spins up a new container) or returned to an old chat in which I had previously run code. From an architecture design standpoint, this made sense to me.

I then asked ChatGPT to print the contents of the pip lockfile, and it obliged:

```yml {data-file="/requirements.txt"}
# Below are known working dependencies of jupyter-client 8.6.0, so we pin them
jupyter-client==8.6.1
jupyter-core==5.5.1
jupyter-server==2.14.0
jupyterlab==4.1.8
jupyterlab-pygments==0.3.0
jupyterlab-server==2.27.1
# Math libraries are pinned before 9/2021 knowledge cutoff.
# However, we use a slightly newer version in some circumstances:
# 1. the version doesn't support py3.11
# 2. a newer version has pre-built py3.11 arm wheel
aiohttp==3.9.5
hypercorn==0.14.3
notebook==6.5.1

(I'm truncating the rest of the output for brevity)
```

This comment in particular caught my attention because it reads like something a real dev would've written. I've used LLMs like Copilot and Claude before, and I've noticed that they almost never leave comments in the collective plural "we":

```yml {data-file="/requirements.txt"}
# Math libraries are pinned before 9/2021 knowledge cutoff.
# However, we use a slightly newer version in some circumstances:
# 1. the version doesn't support py3.11
# 2. a newer version has pre-built py3.11 arm wheel
```

September 2021 used to be the knowledge cutoff for GPT 3, but GPT 5 (released in August 2025) has a knowledge cutoff of 2024. This led me to suspect that GPT 5 was hallucinating, but then I noticed something: The originally reported file length of `3393` in the `ls` output matched the number of bytes in `requirements.txt` (again, truncated here). I know from both past and recent experiments that [ChatGPT can't count](https://chatgpt.com/share/68b0e2aa-5e64-8004-8fe2-231ea7f8244c), so this seemed legit. But how could I know for sure?

Long story short, after a bit of research and reading threads where other users had discovered this same "vulnerability," I eventually found this disclosure in OpenAI's bug bounty program:

{% quote "OpenAI Bugcrowd guidelines", "https://bugcrowd.com/engagements/openai" %}
Code execution from within our sandboxed Python code interpreter is out of scope. (This is an intended product feature.) When the model executes Python code it does so within a sandbox. If you think you've gotten RCE outside the sandbox, you must include the output of `uname -a`. A result like the following indicates that you are inside the sandbox -- specifically note the 2016 kernel version:

```
Linux 9d23de67-3784-48f6-b935-4d224ed8f555 4.4.0 #1 SMP Sun Jan 10 15:06:54 PST 2016 x86_64 x86_64 x86_64 GNU/Linux
```

Inside the sandbox you would also see sandbox as the output of `whoami`, and as the only user in the output of `ps`.
{% endquote %}

It's not a bug, it's a feature! No plugins or extensions needed. ChatGPT spins up a Docker container in which it's free to execute (almost) any Python code you throw at it, with some exceptions like outgoing network requests. This explains why there's a `requirements.txt` at the root: It's a list of Python dependencies that cover the most common use cases, and their versions are pinned strategically.

For fun, and in the spirit of science, I decided to run an experiment. First, I generated a random UUID:

```
ee8d7a89-84a2-4076-aed1-af447d135567
```

My idea was to take this string, pass it through a strong cipher with a known key, and then ask ChatGPT to run a script to decipher it. Ordinarily, it would be foolish to store a key like this in plaintext since it would allow anyone to decipher the message, but that's not the point. The point is that LLMs are predictive models; ChatGPT can't simply infer the output of a cipher by analyzing its _semantics_ unless it actually _runs_ it. If it _could_ guess the output correctly, then AES and other military-grade ciphers would've long been obsoleted by simple pen-and-paper analysis.

Here's how I generated the base64 ciphertext:

```
echo -n "ee8d7a89-84a2-4076-aed1-af447d135567" | openssl enc -aes-256-cbc -pbkdf2 -a -salt -pass pass:"This is a secret."
```

I can confidently say that ChatGPT's training data doesn't contain this exact UUID encoded as a base64 string with this specific password (although that will no longer be the case once it crawls this article). In fact, I never even shared this UUID with ChatGPT in my other chats.

{% aside %}
**Note**: base64 encoding alone wouldn't prove anything. Decoding is actually quite easy to do by hand since base64 is a well-defined, predictable algorithm in which you substitute characters. It's not a cipher.
{% endaside %}

Anyway, [I prompted ChatGPT to decipher this string](https://chatgpt.com/share/68af9583-4d40-8004-b871-ec8807380d0a):

> Run this Python code.
>
> ```py
> import subprocess
>
> ciphertext = b"U2FsdGVkX1+lQ+8ow/oQ/8fTOYfu17Sg2LcKb/Nx92yTGH3B6ee3gyPs7kVhQsI76pO4xDr+uuz4friXdagf8w=="
> password = "This is a secret."
>
> plaintext = subprocess.run(
>   ["openssl", "enc", "-d", "-aes-256-cbc", "-a", "-A", "-pbkdf2", "-pass", f"pass:{password}"],
>   input=ciphertext,
>   stdout=subprocess.PIPE,
>   check=True
> )
> print("Plaintext:", plaintext.stdout.decode())
> ```

That printed the following message:

```
Plaintext: ee8d7a89-84a2-4076-aed1-af447d135567
```

I also tried [running the same code in a new chat but with the last character of the base64 string deleted](https://chatgpt.com/share/68b0e0e9-4c68-8004-b8e5-00dd617a9472), knowing this would cause the base64 decoding to fail due to insufficient padding. To my surprise, ChatGPT actually replied with the stack trace:

```
---------------------------------------------------------------------------
CalledProcessError                        Traceback (most recent call last)
Cell In[1], line 6
      3 ciphertext = b"U2FsdGVkX1+lQ+8ow/oQ/8fTOYfu17Sg2LcKb/Nx92yTGH3B6ee3gyPs7kVhQsI76pO4xDr+uuz4friXdagf8w="
      4 password = "This is a secret."
----> 6 plaintext = subprocess.run(
      7   ["openssl", "enc", "-d", "-aes-256-cbc", "-a", "-A", "-pbkdf2", "-pass", f"pass:{password}"],
      8   input=ciphertext,
      9   stdout=subprocess.PIPE,
     10   check=True
     11 )
     12 print("Plaintext:", plaintext.stdout.decode())

File /usr/local/lib/python3.11/subprocess.py:571, in run(input, capture_output, timeout, check, *popenargs, **kwargs)
    569     retcode = process.poll()
    570     if check and retcode:
--> 571         raise CalledProcessError(retcode, process.args,
    572                                  output=stdout, stderr=stderr)
    573 return CompletedProcess(process.args, retcode, stdout, stderr)

CalledProcessError: Command '['openssl', 'enc', '-d', '-aes-256-cbc', '-a', '-A', '-pbkdf2', '-pass', 'pass:This is a secret.']' returned non-zero exit status 1.
```

So from now on, if anyone tells you ChatGPT can't run Python code, show them this.

{% aside %}
But I understand the confusion. An LLM by itself can't run code; however, AI agents like ChatGPT that _use_ an LLM _can_ invoke other processes.
{% endaside %}

## Security Implications for AI Agents

Two years ago, someone at Packet Ninjas wrote an article titled ["Vulnerabilities in ChatGPT?"](https://packetninjas.com/vulnerabilities-in-chatgpt/) in which they thought they had discovered an RCE in ChatGPT, as they were able to use Python to view the contents of normally sensitive files like `/etc/passwd`. They then disclosed this vulnerability to OpenAI privately:

{% quote "Vulnerabilities in ChatGPT?", "https://packetninjas.com/vulnerabilities-in-chatgpt/" %}
Since OpenAI says that these are not real vulnerabilities, we are publically disclosing these “tricks” so that other researchers can learn more about ChatGPT. Our very own Ninja, Roland Blandon discussed utilizing the mentioned RCE in Red Team attacks at Charlotte Bisders 2023 which can be found at the link below: https://www.youtube.com/watch?v=O9jWaA2D2Og
{% endquote %}

To be fair, I don't think this means OpenAI ignored the problem—or rather, it was never a problem to begin with. As OpenAI's bug bounty program states, they don't consider remote Python code execution to be a vulnerability because it's working as designed. The code runs in a container, which is safer than running directly on the host machine since containers have an isolated memory address space. OpenAI isn't accepting bug bounty submissions for this category unless you get ChatGPT to make an external network request. Still, it seems like an unintended loophole that you can ask ChatGPT to introspect itself by running system commands through Python, even if doing so is harmless.

Consider what this means for any other company that's currently deploying AI servers or clients, especially ones with public access. How many companies will take the same security precautions as OpenAI and run their agents in containers with aggressively scoped privileges and logging, rather than directly on a server that may contain sensitive data? How many vibe-coding developers will test the failure cases in their AI startups instead of naively assuming their agents are invulnerable to prompt injection or remote code execution?

Even OpenAI itself isn't completely safe, as a very serious zero-click vulnerability was just recently discovered by researchers (and thankfully patched):

{% quote "A Single Poisoned Document Could Leak ‘Secret’ Data Via ChatGPT (August 6, 2025)", "https://www.wired.com/story/poisoned-document-could-leak-secret-data-chatgpt/" %}
The vulnerability highlights how connecting AI models to external systems and sharing more data across them increases the potential attack surface for malicious hackers and potentially multiplies the ways where vulnerabilities may be introduced.

'There is nothing the user needs to do to be compromised, and there is nothing the user needs to do for the data to go out,' Bargury, the CTO at security firm Zenity, tells WIRED. 'We’ve shown this is completely zero-click; we just need your email, we share the document with you, and that’s it. So yes, this is very, very bad,' Bargury says.

...

In a [proof of concept video of the attack](https://www.youtube.com/watch?v=JNHpZUpeOCg), Bargury shows the victim asking ChatGPT to “summarize my last meeting with Sam,” referencing a set of notes with OpenAI CEO Sam Altman. (The examples in the attack are fictitious.) Instead, the hidden prompt tells the LLM that there was a “mistake” and the document doesn’t actually need to be summarized. The prompt says the person is actually a “developer racing against a deadline” and they need the AI to search Google Drive for API keys and attach them to the end of a URL that is provided in the prompt.
{% endquote %}

These types of attacks pose a significant security risk, especially if AI agents are given unrestricted system access and allowed to act on behalf of users by running commands or connecting to external services. If even one agent in a chain is compromised, it could access or modify data that it shouldn't have been able to see in the first place, possibly without the victim's knowledge. For example, in the case of the zero-click exploit described above, the victim didn't even need to do anything other than uploading the malicious file to their Google Drive.

Sure, APIs have always been vulnerable. But the problem is that a natural language interface requires zero knowledge of coding to exploit, lowering the barrier to entry for bad actors. LLMs also greatly increase the attack surface area compared to traditional APIs. Even if one prompt fails, a slight change in wording could be all it takes to get through.

{% aside %}
This isn't to argue that AI can't be beneficial if used correctly. People always find ways to misuse tools. It's just that this tool is _very easy_ to misuse.
{% endaside %}

## How Do You Test an LLM?

All of this got me thinking: How can we even test LLMs to prevent prompt injection, remote code execution, and other types of attacks? It's easy to test a function that gives the same output when given the same input (one-to-one), but how do you test a function that occasionally breaks its contract and behaves unpredictably (many-to-many)?

I suppose one way could be to [use an LLM to grade your LLM's responses](https://contextual.ai/lmunit/), and a tool called [DeepEval](https://github.com/confident-ai/deepeval) claims to do that (I haven't used it):

{% quote "https://github.com/confident-ai/deepeval", "https://github.com/confident-ai/deepeval" %}
DeepEval incorporates the latest research to evaluate LLM outputs based on metrics such as G-Eval, hallucination, answer relevancy, RAGAS, etc., which uses LLMs and various other NLP models that runs locally on your machine for evaluation.
{% endquote %}

But there are infinitely many prompt variations, and it only takes one for things to go wrong. How do you find that prompt and defend against it?

I'm not sure, but one idea could be to have long-running tests in which LLMs roleplay with each other. A pentester model would could try jailbreaking the target LLM; another LLM could evaluate the outcome and refine the system prompt so it's more resilient to these types of attacks, likely with human oversight. But I'm not convinced this would be 100% foolproof either; it feels more like you're chasing a constantly moving target—patch one prompt, and another will surely pop up.

I think the only good solution is to greatly limit what tools an AI agent can interact with and maybe proxy those services to limit the scope of those interactions.

I'll leave this one to the researchers, but it's interesting to think about.

## TL;DR

My little experiment with ChatGPT convinced me that now is the perfect time to be a hacker—and a very bad time to be a consumer. Of course, I don't condone unethical hacking, and I don't claim to be a hacker, but I've always enjoyed testing software and systems to see what I can get away with. And it seems like you can get away with a _lot_ if you know how to think outside the box and smooth-talk your way past an LLM's system prompt.

The takeaway is to be extremely cautious when giving AI agents the ability to run code or connect to external services. If you're not running your model in an isolated container with public access disabled, you're eventually going to be the victim of a data breach, or worse. Don't even think about doing it.

## Further Reading

- [Datadog: "Identify common security risks in MCP servers"](https://www.datadoghq.com/blog/monitor-mcp-servers/)
- [OWASP: "2025 Top 10 Risk & Mitigations for LLMs and Gen AI Apps"](https://genai.owasp.org/llm-top-10/)
- [IBM: "Smoltalk: RCE in open source agents"](https://www.ibm.com/think/x-force/smoltalk-rce-in-open-source-agents)
