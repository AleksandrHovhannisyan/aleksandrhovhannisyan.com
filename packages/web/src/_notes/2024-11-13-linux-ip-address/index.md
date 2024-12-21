---
title: Get the IP Address of a Linux Machine
description: Programmatically read your machine's IPv4 address on Linux.
---

```bash {data-copyable="true"}
hostname -I | awk '{print $1}'
```

## Explanation

- `hostname -I` gets all IP addresses of the machine, separated by a space.
- We pipe that result to `awk`, a built-in pattern scanning and processing language.
- Get the first field of input with `print $1`. This should be the IPv4 address.

## Alternatives

Another popular technique is to do a remote query against [ifconfig.me](ifconfig.me):

```bash {data-copyable="true"}
curl -s4 ifconfig.me
```

However, I wouldn't recommend this unless you trust the owners of the website.
