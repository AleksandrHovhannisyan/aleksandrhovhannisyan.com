---
title: Are Password Composition Rules Counter&shy;productive?
description: Registration systems often ask users to create a password containing certain characters. Unfortunately, in doing so, these systems encourage bad habits that can weaken a user's password.
keywords: [password composition rules, password complexity rules, password]
categories: [security, math, forms]
lastUpdated: 2022-09-01
isFeatured: true
---

In [Special Publication 800-63B](https://pages.nist.gov/800-63-3/sp800-63b.html) on user authentication and lifecycle management, the National Institute of Standards and Technology (NIST) documents best practices that password verification systems should follow to secure user accounts. In addition to recommending that verifiers check the length of a user's password to measure its strength—and that verifiers rate-limit log-in attempts—the guidelines also note the following about password composition rules:

{% quote "5.1.1.2 Memorized Secret Verifiers", "https://pages.nist.gov/800-63-3/sp800-63b.html#memsecretver" %}
Verifiers SHOULD NOT impose other composition rules (e.g., requiring mixtures of different character types or prohibiting consecutively repeated characters) for memorized secrets.
{% endquote %}

As the name suggests, a **password composition rule** (also known as a password *complexity* rule) specifies which characters may or may not be used when creating a password or how those characters may be arranged within a password. For example, many registration forms require that a password contain at least one lowercase letter, uppercase letter, number, and symbol.

While this guideline advocates against the use of password composition rules, they are still common on the web. Their goal is to strengthen a password's security by forcing users to pick characters that they would not have otherwise chosen. In theory, this practice should encourage the use of stronger passwords. In reality, password composition rules can frustrate users into choosing weak, predictable passwords.

{% include "toc.md" %}

## How Do Attackers Crack Passwords?

Before we discuss why password composition rules are ineffective, let's take a step back and understand how attackers figure out what a user's password is in the first place.

It used to be the case that older systems didn't rate-limit log-in attempts, meaning attackers could try to log into user accounts any number of times directly. This could've been automated with a script, making HTTP requests to the login form's endpoint and trying out different passwords until one of them worked. Alternatively, an attacker could've chosen a single weak password (like `password` or `qwerty`) and tried to log in to multiple user accounts with it, hoping that the password would eventually work for one of the accounts.

However, nowadays, most login systems employ rate limiting to deter these types of hands-on attacks (and to protect their website's servers from denial-of-service attacks). Rate-limiting log-in attempts is recommended by the same NIST publication:

{% quote "5.1.1.2 Memorized Secret Verifiers", "https://pages.nist.gov/800-63-3/sp800-63b.html#memsecretver" %}
Verifiers SHALL implement a rate-limiting mechanism that effectively limits the number of failed authentication attempts that can be made on the subscriber’s account as described in [Section 5.2.2](https://pages.nist.gov/800-63-3/sp800-63b.html#throttle).
{% endquote %}

{% aside %}
You can learn more about this in OWASP's article on [blocking brute-force attacks](https://owasp.org/www-community/controls/Blocking_Brute_Force_Attacks).
{% endaside %}

For this reason, hackers typically carry out *offline* attacks, where they first obtain a list of leaked password hashes (assuming a system isn't naively storing passwords as plaintext). These hashes may have been leaked from a company database, or they may be hashes for system passwords (like those in `/etc/shadow` on a Linux machine, which are viewable with root access). Either way, an attacker could use one of three approaches to crack those passwords:

1. [**Brute-force attack**](https://en.wikipedia.org/wiki/Brute-force_attack): an attacker searches the entire password space manually until they find a password that generates a particular hash. This is simply not feasible in practice due to the sheer number of passwords that most systems are capable of generating. For example, a password system with no constraints and a known password length of 8 can generate more than 6 quadrillion passwords.
2. [**Dictionary attack**](https://en.m.wikipedia.org/wiki/Dictionary_attack): in a variation of the brute-force attack, a hacker uses a pre-compiled dictionary of known words and phrases and hashes each one until a collision is found. This can be automated with a tool like [John the Ripper](https://www.openwall.com/john/), brute-forcing the hashes with a custom wordlist and mangling rules. While a dictionary attack is more efficient than brute force, it is unable to crack all passwords since it only searches a subset of the password space.
3. [**Rainbow table attack**](https://en.wikipedia.org/wiki/Rainbow_table#Precomputed_key_chains): while dictionary attacks are more efficient than pure brute force, they still require significant time and computing power if you want to crack most or all passwords in a leak. In a more intelligent approach, an attacker computes the hashes for all possible passwords ahead of time and stores them in a lookup table mapping hashes to their corresponding passwords. Then, given a list of leaked hashes, all you need to do is find a matching hash in your table to get a list of candidate passwords.

For a more in-depth discussion of these techniques, see the following resources:

- [Crack a password: techniques and hands-on exercise](https://thehackerish.com/crack-a-password-techniques-and-hands-on-exercise/).
- [What are the differences between dictionary attack and brute force attack?](https://security.stackexchange.com/a/67768/219732)

## Measuring a Password's Strength

In the previous section, I mentioned the need to search the "password space" for a system when trying to crack passwords. More generally, the **search space** for any problem is the total number of possibilities that would need to be checked in an exhaustive search. If someone is trying to crack a login system's passwords, then the search space is the total number of passwords that can be generated under certain constraints. The larger the search space, the more time and computational power that is needed to check it exhaustively. This assumes a worst-case outcome: that the item you're searching for is the very last one that has yet to be checked.

An equivalent measure of a password's strength is its [**entropy**](https://generatepasswords.org/how-to-calculate-entropy/), or the number of bits needed to represent that password in [the binary number system](/blog/binary-for-beginners/). This is essentially just the password space but represented as a base of two for convenience in computing. If our search space consists of `n` passwords, then we can equivalently represent all of those passwords using <code>log<sub>2</sub>(n)</code> bits. The greater a password's entropy, the stronger and more resistant to brute force that password is considered to be. For example, if a system can generate 26<sup>8</sup> passwords, then its entropy is 37.6 bits (since 2<sup>37.6</sup> = 26<sup>8</sup>).

Using combinatorics and set theory, we can work out how many passwords can be generated under different constraints and the corresponding password entropies. To simplify the math, we'll assume that the password is known to be eight characters long (the minimum length recommended by the NIST). Some common scenarios are summarized in Table 1.

<div class="scroll-x">
    <table id="table-1">
    <caption>Table 1: Search space and entropy for an eight-character password.</caption>
        <thead>
            <tr>
                <th scope="col">Constraints</th>
                <th scope="col" class="numeric">Characters</th>
                <th scope="col" class="numeric">Search space</th>
                <th scope="col" class="numeric">Entropy (rounded)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Only lowercase letters</td>
                <td class="numeric">26</td>
                <td class="numeric">2.1 &times; 10<sup>11</sup></td>
                <td class="numeric">38</td>
            </tr>
            <tr>
                <td>At least 1 lowercase and uppercase letter</td>
                <td class="numeric">52</td>
                <td class="numeric">5.3 &times; 10<sup>13</sup></td>
                <td class="numeric">46</td>
            </tr>
            <tr>
                <td>At least 1 lowercase letter, uppercase letter, and number</td>
                <td class="numeric">62</td>
                <td class="numeric">1.6 &times; 10<sup>14</sup></td>
                <td class="numeric">48</td>
            </tr>
            <tr>
                <td>At least 1 lowercase letter, uppercase letter, number, and symbol</td>
                <td class="numeric">94</td>
                <td class="numeric">2.8 &times; 10<sup>15</sup></td>
                <td class="numeric">52</td>
            </tr>
            <tr>
                <td>None</td>
                <td class="numeric">94</td>
                <td class="numeric">6.1 &times; 10<sup>15</sup></td>
                <td class="numeric">53</sup></td>
            </tr>
        </tbody>
    </table>
</div>

{% aside %}
For a breakdown of the math, see this StackExchange answer: [Counting for possibilities of passwords containing at least one uppercase letter, one lowercase letter, and one digit](https://math.stackexchange.com/q/3493738).
{% endaside %}

{% aside %}
The last two rows of Table 1 assume that a QWERTY keyboard is used, which offers 32 ASCII symbols that password systems normally accept (i.e., we're ignoring spaces, control characters, and esoteric Unicode keyboard shortcuts).
{% endaside %}

The main takeaway from this table is that the search space (and therefore the password entropy) is always reduced when we enforce some sort of password composition requirement. Once we begin to restrict the types of passwords that a user may choose, the search space and entropy are guaranteed to be smaller than if we didn't enforce any rules.

### Prefer Length Over Password Complexity 

At first glance, Table 1 also seems to suggest that if we *do* decide to enforce password requirements, we should at last favor more complex rules because they yield a bigger search space compared to simpler rules. For example, the rule requiring at least one of each character set yields an entropy of 53, whereas a password consisting only of lowercase letters has an entropy of 38. But this doesn't tell the whole story.

In reality, increasing the number of candidate characters does not substantially increase the strength of a password beyond a certain point. Notice how the password entropy increases rapidly at first but then plateaus as we introduce more character classes. Realistically, our gains taper off because a standard keyboard only supports a finite number of ASCII characters (and because increasing the base of an exponent does not have as much of an impact as increasing the power).

To drive home this point, consider Table 2, which computes the password space and entropy for a system that only allows lowercase letters but allows the password length to be arbitrarily large.

<div class="scroll-x">
    <table id="table-2">
    <caption>Table 2: Search space and entropy for passwords of varying length (only lowercase letters).</caption>
        <thead>
            <tr>
                <th scope="col" class="numeric">Length</th>
                <th scope="col" class="numeric">Search space</th>
                <th scope="col" class="numeric">Entropy (rounded)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="numeric">8</td>
                <td class="numeric">2.1 &times; 10<sup>11</sup></td>
                <td class="numeric">38</td>
            </tr>
            <tr>
                <td class="numeric">10</td>
                <td class="numeric">1.4 &times; 10<sup>14</sup></td>
                <td class="numeric">47</td>
            </tr>
            <tr>
                <td class="numeric">12</td>
                <td class="numeric">9.5 &times 10<sup>16</sup></td>
                <td class="numeric">57</td>
            </tr>
            <tr>
                <td class="numeric">14</td>
                <td class="numeric">6.5 &times; 10<sup>19</sup></td>
                <td class="numeric">66</td>
            </tr>
        </tbody>
    </table>
</div>

Observe that increasing the password's length from 8 to 12 already gives us a greater entropy (57 bits) with just lowercase letters. By comparison, we get only 53 bits of entropy for an 8-character password with no restrictions. It's for this reason that the NIST encourages enforcing a minimum length requirement. In general, *longer* passwords are stronger (and may be easier to remember) than *complex* passwords.

### Password Space Isn't Everything

With all of this in mind, it's worth emphasizing that a larger password space doesn't necessarily mean that our system's passwords are going to be harder to crack. Remember: All of this math is theoretical and assumes that users are generating perfectly random passwords. In reality, humans can only realistically generate and memorize a subset of this search space. Users are biased toward selecting words and phrases, not a random string of characters, so it's likely that their hand-chosen password (or some variation of it) will appear in a dictionary.

Thus, an attacker won't need to cover the entire password space (and doing so can be prohibitively costly anyway). Moreover, in some cases, cracking a user password may grant an attacker access to multiple accounts. In short, the problem with password composition rules isn't that they reduce the search space.

{% quote "An Introduction to Analytical Cryptography (2014), page 5", "https://link.springer.com/book/10.1007/978-1-4939-1711-2" %}
The assertion that a large number of possible keys, in and of itself, makes a cryptosystem secure, has appeared many times in history and has equally often been shown to be fallacious.
{% endquote %}

For example, in a theoretical brute-force attack, the attacker does not care about the size of the search space since they already intend to search all of it, as fruitless as that may be. And in a dictionary attack, the attacker has already chosen a predictable subset of the password space to search, so a reduction of the overall password space may or may not hinder their efforts. Finally, in a rainbow table attack, an attacker has already precompiled a table of hashes for quick lookups, so a reduction of the password space doesn't slow them down.

{% aside %}
For this reason, we typically assume that an attacker will only need to crack 50% of our passwords, which essentially halves the search space. So whereas before a hacker may have needed 2<sup>Entropy</sup> guesses to crack all passwords, they now only need 2<sup>Entropy - 1</sup> guesses. See this article for more information: [How to Calculate Password Entropy](https://generatepasswords.org/how-to-calculate-entropy/).
{% endaside %}

The bigger problem is that these rules annoy users into choosing predictable, memorable patterns for their passwords, which in turn makes them easier to crack with simpler methods (like dictionary attacks or even social engineering).

## Password Rules Compel Users to Choose Memorable, Predictable Passwords

Users are lazy when it comes to online security, especially with a task as tedious as password management. A password with just lowercase letters may be simple to generate and memorize, but when users are asked to pick additional characters, the task of selecting a strong yet memorable password becomes harder. A user may grow frustrated and try to find shortcuts to make their life easier, choosing a password that minimally satisfies the given requirements. So rather than sprinkling multiple uppercase and lowercase letters, numbers, and symbols throughout their password, a user might pick just one uppercase letter, number, and symbol to create a more memorable password.

### At Least 1 Lowercase and Uppercase Letter

For example, to make their life easier, a user might capitalize just the first letter of their chosen password rather than some arbitrary character (or multiple characters) elsewhere in the string. A weak password such as `password` might become an equally weak password, `Password`. Previously, our math assumed that we could generate 5.3 &times; 10<sup>13</sup> (53 trillion) passwords by requiring at least one lowercase and uppercase letter. But now, if we assume that a frustrated user is going to take the easy way out and only capitalize the first letter, we'll find that the complexity of this new password is actually no better than if it were entirely lowercased. The first character can be one of 26 uppercase letters, and the rest are lowercase (still 26 options per character). This can generate only 2 &times; 10<sup>11</sup> (200 billion) passwords, or roughly 265 times fewer passwords than our math previously suggested.

### At Least 1 Lowercase, Uppercase, and Numeric

We could add more requirements, but this won't help all that much. If a password must contain at least one digit (in addition to the previous requirements), a user will likely do one of three things:

1. Append numbers to their password (`Password1`),
2. Shorten the plaintext portion of the password to accommodate numbers (`Passwrd1`), or
3. Use [leet speak](https://en.wikipedia.org/wiki/Leet): `P455w0rd`.

We can narrow down the possibilities even further. Knowing that users are predictable, we can guess that they might choose one of the following patterns to keep their password memorable:

- A single digit at the end of the password.
- A four-digit PIN.

But an attacker wouldn't just stop here. For example, if a user chooses a four-digit number, it's unlikely to be just any random PIN. Rather, a user is more likely to pick a meaningful year, like a family member's birth year or an anniversary. Not only does this reduce the number of possibilities, but it also makes it easier to find that information through social media since people are so willing to share their personal information online.

### At Least 1 of Everything

What if we also require symbols? There are 32 symbols on a standard QWERTY keyboard, and that's greater than even the number of lowercase Latin letters. However, this runs into a similar problem: Users are unlikely to reach for obscure symbols like `*`, `(`, or `\` and are more likely to pick from a handful of characters that they regularly use, such as `!`, `?`, or `$`. So `Password1` might become `Password1!`. Once again, the user's password follows a predictable pattern.

## Eliminating Password Rules Is Not Enough to Secure User Passwords

So far, our discussion focused on the fact that password composition rules can frustrate users and force them to choose more predictable password patterns that minimally satisfy the requirements. For this reason, the NIST discourages verifiers from using these rules. However, the problem of securing user accounts is more nuanced, and eliminating password complexity rules does not solve all of our problems.

### Old Habits Die Hard

The first problem is our assumption that *not* enforcing password composition rules will change the outcome. We began with the following hypothesis and looked at some examples:

> If we enforce password complexity rules, then users will pick predictable passwords.

However, it would be misleading to conclude the following:

> If we don't enforce password complexity rules, then users will pick strong passwords.

This would be the logical fallacy of [denying the antecedent](https://en.wikipedia.org/wiki/Denying_the_antecedent). The reality is that users have been conditioned to expect password rules even if they aren't explicitly stated, so they'll still employ these familiar shortcuts: capitalization at the start, a bit of leet speak here and there, and numbers and punctuation at the end. Not only are these passwords easy to crack, but they can also be confusing to remember. *Does the number come before the punctuation or after? Which symbol did I use? Did I make any leet substitutions? Wait, what was the word, again?*

{% quote "xkcd: Password Strength (#936)", "https://xkcd.com/936/" %}
Through 20 years of effort, we've successfully trained everyone to use passwords that are hard for humans to remember, but easy for computers to guess.
{% endquote %}

Moreover, people tend to reuse weak passwords to minimize the number of unique passwords they have to remember. In fact, [a 2019 security survey by Google](https://services.google.com/fh/files/blogs/google_security_infographic.pdf) found that 52% of the people surveyed reuse their passwords across multiple accounts, and 13% reuse their passwords across *all* accounts. So even if we don't enforce password requirements, some other password system might, and a large number of our users may still practice poor password hygiene.

While we can do our best to educate users about good password habits and discourage them from choosing unsafe passwords, we can't guarantee that all of our users will put these tips into practice. Some browsers, like Chrome and Firefox, are making it easier for user to generate safe passwords by giving users the option of auto-generating strong passwords in registration forms and saving these to their account. But there will always be some users who won't take advantage of these measures and will fall back to their old habits.

### Hackers Are Not Naive

It's tempting to hope that an attacker will give up trying to access user accounts once we remove password composition rules since this increases the search space. However, as mentioned earlier, an attacker need not cover the entire search space for a password system in order to crack a handful of weak passwords.

We have to assume that a hacker will always use the most optimal and intelligent angle of attack. Why target the strongest links in the chain when you can break the weakest ones instead? Even if our password system doesn't enforce any complexity rules, a hacker can still use mangling rules for common patterns: capitalization at the start, numbers and punctuation at the end, and leet speak variations. Furthermore, we have to assume that a hacker will use the best possible hardware and software available to them.

{% quote "An Introduction to Analytical Cryptography (2014), page 5", "https://link.springer.com/book/10.1007/978-1-4939-1711-2" %}
Your opponent always uses her best strategy to defeat you, not the strategy that you want her to use. Thus the security of an encryption system depends on the best known method to break it. As new and improved methods are developed, the level of security can only get worse, never better.
{% endquote %}

### Some Password Complexity Rules Are Useful

So far, we've also only considered password rules that specify an inclusion requirement for character classes, like "at least one lowercase, uppercase, and numeric character." In reality, certain kinds of composition rules can be beneficial. For example, some systems might check if a user's password contains their birthday or their name (if the form collected that information) and encourage them to pick a different password. Eliminating these possibilities does reduce the search space, but again, that does not necessarily make their password easier to crack. In this case, it may actually make it harder for attackers to target specific users through social engineering or research. So unless a hacker can get their hands on a database dump of your passwords, they're going to have a much harder time guessing a specific user's password.

Moreover, the NIST guidelines encourage verifiers to require a minimum password length and to use this as the primary measure of a password's strength. Longer passwords are much harder to crack because the search space grows exponentially—by roughly an order of 100 for each additional character—to the point that it actually *does* make it more difficult to crack.

### Salt User Passwords Before Hashing Them

Additionally, the NIST publication does not *merely* state that verifiers shouldn't use password complexity rules since that alone does not guarantee the security of a system's passwords. Rather, it also recommends some additional precautions for protecting user accounts. For example, as we discussed earlier, the document recommends that verifiers rate-limit log-in attempts to deter online brute-force attacks. But more importantly, it also encourages the use of *salting* to introduce more entropy into the password space:

{% quote "5.1.1.2 Memorized Secret Verifiers", "https://pages.nist.gov/800-63-3/sp800-63b.html#memsecretver" %}
Verifiers SHALL store memorized secrets in a form that is resistant to offline attacks. Memorized secrets SHALL be salted and hashed using a suitable one-way key derivation function. Key derivation functions take a password, a salt, and a cost factor as inputs then generate a password hash. Their purpose is to make each password guessing trial by an attacker who has obtained a password hash file expensive and therefore the cost of a guessing attack high or prohibitive.
{% endquote %}

That way, even if an attacker gets their hands on a database dump of password hashes, they won't be able to just brute-force it with a dictionary or rainbow table attack without also having to compute the salt that was used, which significantly increases the time and computing power required. Salting also makes it difficult for attackers to crack multiple user passwords in one go. Without salting, two users may share the same password, and their hashes will be identical, so cracking one would give an attacker access to both accounts. With salting, two users may share the same password, but the computed hash will be different for each one.

## Summary

There are two key takeaways from all of this.

First, certain types of password composition rules can be counterproductive because they encourage users to take shortcuts in an attempt to minimally satisfy the requirements, which may weaken their password. But even in the absence of password composition rules, users tend to still practice poor password hygiene, so simply eliminating these rules is not enough. If you're designing a password verification system, you should take some additional precautions:

- Only require a minimum length, encouraging users to pick long passwords.
- Check if a user's password was previously leaked (e.g., with the [havibeenpwned API](https://haveibeenpwned.com/API/v2)).
- [Salt user passwords](https://auth0.com/blog/adding-salt-to-hashing-a-better-way-to-store-passwords/) before storing their hashes to make brute-force attacks more difficult.
- Offer multi-factor authentication to secure a user's account even if their password is stolen.

Second, if you're a user, you're better off relying on a password manager to generate a password for you. Humans aren't good at generating random values, so your seemingly unpredictable password may actually be betrayed by certain patterns that you're unable to spot yourself. A good password manager will use a healthy balance of lowercase, uppercase, numeric, and other characters throughout a password, making it significantly more difficult to crack by brute force.

## Sources and Further Reading

- [NIST Special Publication 800-63B](https://pages.nist.gov/800-63-3/sp800-63b.html)
- [auth0: NIST Password Guidelines and Best Practices for 2020](https://auth0.com/blog/dont-pass-on-the-new-nist-password-guidelines/)
- [Security StackExchange: Are password complexity rules counterproductive?](https://security.stackexchange.com/questions/32222/are-password-complexity-rules-counterproductive)
- [Security StackExchange: Why are salted hashes more secure for password storage?](https://security.stackexchange.com/questions/51959/why-are-salted-hashes-more-secure-for-password-storage/51983#51983)
- [A Somewhat Brief Explanation of Password Entropy](https://www.itdojo.com/a-somewhat-brief-explanation-of-password-entropy/)
- [Calculating password entropy](https://www.pleacher.com/mp/mlessons/algebra/entropy.html)

