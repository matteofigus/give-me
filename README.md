give-me
=============
[![Build Status](https://secure.travis-ci.org/matteofigus/give-me.png?branch=master)](http://travis-ci.org/matteofigus/give-me)

# About promises with js and node.js

I've nothing against promises in js, but for me node is about semplicity, and promises are something that in my opinion should be managed in a very easy way with Javascript. All the libraries I've found use the "then" syntax to manage chaining, and require to wrap deferred functions inside a promise init/return.

Another problem is that this libraries usually need you to make your deferred functions work as they want. Usually, just one argument is accepted, and its callback needs to have one or two arguments.

Give-me does all the dirty work, and allow you to use your functions exactly as they are.

# License

MIT