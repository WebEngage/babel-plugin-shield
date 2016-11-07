# babel-plugin-shield
A babel plugin to shield your code against annoying undefined property errors (```Uncaught TypeError: Cannot read property 'xyz' of undefined"```).

Let's say you have a deep nested object something like this:
```javascript
var testObj = {
    func1: function () {
        return { b : 2 };
    },
    testFunc:function(){
        var value = this.func2().b; // undefined property func2
    }
}
```

So as you would have guessed correctly this would through our not so favourite undefined error.

till now most of you would have been solving this problem using ```&&``` something like,
```javascript 
var value = this && this.func2 && this.func2() && this.func2().b;
```
Well, not anymore this plugin is here to **shield** you against all such troubles.
### Getting Started
```javascript
$ npm install --save babel-plugin-shield
//add shield as plugin in your babelrc
{
    plugins: ['shield']
}
```
### Usage
```javascript
var value = shield_(this.func2().b);
```
That's pretty much it.

### License
babel-plugin-shield is released under the [MIT License](http://www.opensource.org/licenses/MIT)

### Thanks