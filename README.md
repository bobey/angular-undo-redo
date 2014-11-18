# Angular Undo Redo

This repository shows how to implement an undo/redo functionality in an AngularJS frontend using the [Command Pattern](http://en.wikipedia.org/wiki/Command_pattern):

> If all user actions in a program are implemented as command objects, the program can keep a stack of the most recently executed commands. When the user wants to undo a command, the program simply pops the most recent command object and executes its undo() method.

This is code support for an article on my blog: [http://blog.overnetcity.com](http://blog.overnetcity.com/2014/11/20/undo-redo-angularjs-command-pattern/)

## Try it online!

[Angular Undo / redo demo](http://bobey.github.io/angular-undo-redo)

## Fork it!

```
git clone https://github.com/bobey/angular-undo-redo.git && cd angular-undo-redo
npm install
bower install
grunt
```

And open `public/index.html`. That's it!
