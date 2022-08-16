---
title: Are Password Composition Rules Counter&shy;productive?
description: Registration systems often ask users to create a password containing certain characters. Unfortunately, in doing so, these systems encourage bad habits that can weaken a user's password.
keywords: [password composition rules, password complexity rules, password]
categories: [math, security, forms]
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

The simplest approach is to use brute force. One way to do this is the old-fashioned way: If a login system doesn't rate-limit log-in attempts, then an attacker can attempt to log in to a user's account directly any number of times. This can be automated with a script that makes HTTP requests to the login form's endpoint and tries out different passwords from a custom wordlist. Alternatively, an attacker can choose a single weak password and try to log in to multiple user accounts with it, hoping that the password eventually works for one of the accounts.

However, more commonly, login systems employ rate limiting to deter brute-force attacks, especially since they can overload a website's servers with requests if precautions aren't taken. Rate-limiting log-in attempts is recommended by the same NIST publication:

{% quote "5.1.1.2 Memorized Secret Verifiers", "https://pages.nist.gov/800-63-3/sp800-63b.html#memsecretver" %}
Verifiers SHALL implement a rate-limiting mechanism that effectively limits the number of failed authentication attempts that can be made on the subscriber’s account as described in [Section 5.2.2](https://pages.nist.gov/800-63-3/sp800-63b.html#throttle).
{% endquote %}

{% aside %}
You can learn more about this in OWASP's article on [blocking brute-force attacks](https://owasp.org/www-community/controls/Blocking_Brute_Force_Attacks).
{% endaside %}

For this reason, attackers typically carry out an *offline* brute-force attack. First, they obtain a dump file containing a list of password hashes. These hashes may have been leaked from a company database, or they may be hashes for system passwords (like those in `/etc/shadow` on a Linux machine, which are viewable with root access). In either case, a tool like [John the Ripper](https://www.openwall.com/john/) can be used to brute-force the hashes using a wordlist and some mangling rules. With an insight into user behaviors and the password complexity rules enforced by a particular system, an attacker can build a dictionary attack that exposes at least some of the weaker passwords.

For a more in-depth discussion of these techniques, see this article by thehackerish: [crack a password: techniques and hands-on exercise](https://thehackerish.com/crack-a-password-techniques-and-hands-on-exercise/).

## The Math: Search Space for Passwords

The **search space** for any problem is the set of all scenarios that need to be considered for an exhaustive search. If someone is trying to crack a login system's passwords, then the search space for this problem is the total number of possible passwords that can be generated within certain parameters. The larger the search space, the more time and computational power that is needed to check it *exhaustively*. This assumes a worst-case outcome: that the item you're searching for is the very last one that has yet to be checked.

Using combinatorics and set theory, we can work out how many passwords can be generated under different constraints. To simplify the math, we'll assume that the password is known to be eight characters long (the minimum length recommended by the NIST). Some common scenarios are summarized in Table 1.

<div class="scroll-x">
    <table>
    <caption>Table 1: Search space for an eight-character password.</caption>
        <thead>
            <tr>
                <th scope="col">Constraints</th>
                <th scope="col">Characters</th>
                <th scope="col">Search space</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Only lowercase letters</td>
                <td class="numeric">26</td>
                <td class="numeric">2.1 &times; 10<sup>11</sup></td>
            </tr>
            <tr>
                <td>At least 1 lowercase and uppercase letter</td>
                <td class="numeric">52</td>
                <td class="numeric">5.3 &times; 10<sup>13</sup></td>
            </tr>
            <tr>
                <td>At least 1 lowercase, uppercase, and number</td>
                <td class="numeric">62</td>
                <td class="numeric">1.6 &times; 10<sup>14</sup></td>
            </tr>
            <tr>
                <td>At least 1 lowercase, uppercase, number, and symbol</td>
                <td class="numeric">94</td>
                <td class="numeric">2.8 &times; 10<sup>15</sup></td>
            </tr>
            <tr>
                <td>None</td>
                <td class="numeric">94</td>
                <td class="numeric">6.1 &times; 10<sup>15</sup></td>
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

The main takeaway from this table is that the search space is always reduced when we enforce some sort of password composition requirement. Once we begin to restrict the types of passwords that a user may choose, the search space is guaranteed to be smaller than if we didn't enforce any rules. However, our math also suggests that if we *do* decide to enforce password requirements, we should favor more complex rules because they yield a bigger search space compared to simpler rules.

While that seems true at first glance, it's misleading because the size of the search space does not actually tell us anything about the difficulty of cracking user passwords. In practice, an attacker won't need to cover the entire search space for a password system (and doing so would be unrealistic anyway). Rather, cracking a handful of weak passwords is sufficient. Moreover, in some cases, cracking a user password may grant an attacker access to multiple accounts.

{% quote "An Introduction to Analytical Cryptography (2014), page 5", "https://link.springer.com/book/10.1007/978-1-4939-1711-2" %}
The assertion that a large number of possible keys, in and of itself, makes a cryptosystem secure, has appeared many times in history and has equally often been shown to be fallacious.
{% endquote %}

The problem with password composition rules isn't that they reduce the search space—it's that they encourage users to choose predictable, memorable patterns for their passwords, which in turn makes it more likely that the passwords they pick can be cracked by brute force.

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

Earlier, we also noted that the search space in the absence of complexity rules is 6.1 &times; 10<sup>15</sup> for an eight-character password. That may be the case when using a pseudorandom password generator, but humans can only realistically generate and memorize a subset of this search space. Users are biased toward selecting words and phrases, not a random string of characters, so it's likely that their hand-chosen password (or some variation of it) will appear in a dictionary.

While we can do our best to educate users about good password habits and discourage them from choosing unsafe passwords, we can't guarantee that all of our users will put these tips into practice. Some browsers, like Chrome and Firefox, are making it easier for user to generate safe passwords by giving users the option of auto-generating strong passwords in registration forms and saving these to their account. But there will always be some users who won't take advantage of these measures and will fall back to their old habits.

### Hackers Are Not Naive

It's tempting to hope that an attacker will give up trying to access user accounts once we remove password composition rules since this increases the search space. However, as mentioned earlier, an attacker need not cover the entire search space for a password system in order to crack a handful of weak passwords.

We have to assume that a hacker will always use the most optimal and intelligent angle of attack. Why target the strongest links in the chain when you can break the weakest ones instead? Even if our password system doesn't enforce any complexity rules, a hacker can still use mangling rules for common patterns: capitalization at the start, numbers and punctuation at the end, and leet speak variations. Furthermore, we have to assume that a hacker will use the best possible hardware and software available to them.

{% quote "An Introduction to Analytical Cryptography (2014), page 5", "https://link.springer.com/book/10.1007/978-1-4939-1711-2" %}
Your opponent always uses her best strategy to defeat you, not the strategy that you want her to use. Thus the security of an encryption system depends on the best known method to break it. As new and improved methods are developed, the level of security can only get worse, never better.
{% endquote %}

### Some Password Complexity Rules Are Useful

So far, we've also only considered password rules that specify an inclusion requirement for character classes, like "at least one lowercase, uppercase, and numeric character." In reality, certain kinds of composition rules can be beneficial. For example, some systems might check if a user's password contains their birthday or their name (if the form collected that information) and encourage them to pick a different password. Eliminating these possibilities does reduce the search space, but again, that does not necessarily make their password easier to crack. In this case, it may actually make it harder for attackers to target individual users. This means that unless a hacker can get their hands on a database dump of your passwords, they're going to have a much harder time guessing a specific user's password.

Moreover, the NIST guidelines encourage verifiers to require a minimum password length and to use this as the primary measure of a password's strength. Longer passwords are much harder to crack because the search space grows exponentially—by roughly an order of 100 for each additional character—to the point that it actually *does* make it more difficult to crack.

### Salt User Passwords to Deter Brute-Force Attacks

Additionally, the NIST publication does not *merely* state that verifiers shouldn't use password complexity rules since that alone does not guarantee the security of a system's passwords. Rather, it also recommends some additional precautions for protecting user accounts. For example, as we discussed earlier, the document recommends that verifiers rate-limit log-in attempts to deter online brute-force attacks. But it also encourages the use of *salting* to defend against offline brute-force attacks:

{% quote "5.1.1.2 Memorized Secret Verifiers", "https://pages.nist.gov/800-63-3/sp800-63b.html#memsecretver" %}
Verifiers SHALL store memorized secrets in a form that is resistant to offline attacks. Memorized secrets SHALL be salted and hashed using a suitable one-way key derivation function. Key derivation functions take a password, a salt, and a cost factor as inputs then generate a password hash. Their purpose is to make each password guessing trial by an attacker who has obtained a password hash file expensive and therefore the cost of a guessing attack high or prohibitive.
{% endquote %}

That way, even if an attacker gets their hands on a database dump of password hashes, they won't be able to just brute-force it directly without also having to compute the salt that was used, which adds entropy to the search space and significantly increases the time and computing power required. Salting also makes it difficult for attackers to crack multiple user passwords in one go. Without salting, two users may share the same password, and their hashes will be identical, so cracking one would give an attacker access to both accounts. With salting, two users may share the same password, but the computed hash will be different for each one.

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
