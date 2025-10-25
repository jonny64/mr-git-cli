[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/9772/badge)](https://www.bestpractices.dev/projects/9772)

`mr` groups common `git` commands into batches; let's see it in action:
```
$ mr TASK-4242
Create new branch 'TASK-4242' from 'origin/main' [Y/n]? y
 > git fetch
 > git switch --guess --merge --create TASK-4242 origin/main
Switched to a new branch 'TASK-4242'
$ mr main
 > git switch --merge --guess main
$ mr TASK-4242
 > git switch --merge --guess TASK-4242

$ git commit -m "TASK-4242 branch first commit msg"

$ mr TASK-4242 to test
> git push --set-upstream origin TASK-4242:TASK-4242
  -o merge_request.create -o merge_request.target=master
  -o merge_request.title='TASK-4242 branch first commit msg'
remote: View merge request for TASK-4242:
remote:   https://gitlab.local/jonny64/mr-git-cli/-/merge_requests/1
 * [new branch]      TASK-4242 -> TASK-4242
> git switch test
> git merge origin/TASK-4242
> npm test
> git push

$ mr TASK-4242 to main
> git switch main
> git merge origin/TASK-4242
> npm test
> git push
```
See https://github.com/jonny64/mr-git-cli/wiki for details
