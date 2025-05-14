---
title: Useful Bash Aliases
description: Bash aliases I use to speed up my workflows.
categories: [note, linux]
---

I'm lazy, so I prefer to type as fewer characters as possible to run a command.

Here's my `~/.bash_aliases` file:

```bash {data-file="~/.bash_aliases" data-copyable="true"}
# General
alias cls='clear'
alias l='ls -lahF'
alias ..='cd ..'
alias src='source ~/.bashrc'

# Git aliases
alias ga='git add'
alias gs='git status'
alias gl="git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
alias gi='git init'
alias gb='git branch'
alias gd='git diff'
alias gc='git checkout'
alias gpl='git pull'
alias gf='git fetch'
alias gps='git push'
alias gpsnew='git push -u origin HEAD'
alias gcm='git commit -S'
alias rebase='git fetch && git rebase'
alias gsh='git stash'
alias gshm='git stash push -m'
```

I load this file in `.bashrc` to keep things modular:

```bash {data-file="~/.bashrc" data-copyable="true"}
if [ -f ~/.bash_aliases ]; then
    . ~/.bash_aliases
fi
```

## Remarks

- `ls -lahF` is superior to `ls` in almost every way. It shows output in a tabular format (`-l`) with dot files visible (`-a`), human-readable file sizes (`-h`), and file type markers (`-F`, e.g., trailing slashes for directories, asterisks for executables).
- `..` allows me to jump to the parent directory very quickly.
-  `src` is a fun shorthand for re-sourcing my Bash config. You can only use this after manually sourcing once after you add this alias the very first time. From that point onward, you only need to run `src`.
- I know that Git has its own aliasing system, but I prefer to use Bash aliases for Git commands so that I don't have to prefix every command with `git`. That's too much work!
- Credit for the `git log` pretty format: ["A better git log"](https://coderwall.com/p/euwpig/a-better-git-log). You could also configure this at the Git level and then just do `alias gl=git log`. But I prefer to have it inline so I don't have to remember to reconfigure `git log` on a new machine.