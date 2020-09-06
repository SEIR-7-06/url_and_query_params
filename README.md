# URL and Query Parameters

## Lesson Objectives

1. Read URL parameters
1. Place routes in correct order


## Fruits app

Over the next few lessons, we're going to be building an app together. We will all be using the same repo so that we can remain in sync. Let's get it set up:

1. `cd ~/sei`
2. `git clone https://git.generalassemb.ly/WC-SEI-817/express-fruits`
3. `cd express-fruits`

Your instructor will regularly pushing to this repo, so you can sync up by running the following commands:

1. `git fetch --all`
    - This will retrieve the changes from our `express-fruits` repo, but doesn't merge them into your code.
2. `git reset --hard origin/master`
    - This will throw away all your staged and unstaged changes, forget everything on your current local branch, and then merge all the fetched changes, making it exactly the same as `origin/master`.
3. Optional: If your instructor has installed npm packages that you have not, run `npm install`.
    - This will read the `package.json` and install any packages that are listed there, which are not currently in your `node_modules`.


## Setup

1. Open `express-fruits` in your editor.
2. Open the terminal in your editor (in VS Code, use ctrl + `).
3. In the terminal, run `npm init`.
    - When prompted with `entry point: (index.js)`, type in `server.js`. For all other prompts, just hit Enter. This creates our `package.json`, which will keep track of our installed npm packages, as well as other configurations for our app.
4. `touch server.js`
5. Install express: `npm install express`
    - `npm i` can also be used instead of `npm install`
6. `touch .gitignore`
7. In `.gitignore`, type `node_modules`.
    - You won't be pushing your changes, but this is good practice when setting up a new project so that you don't accidentally push your installed packages to GitHub.
8. In `server.js`, we'll enter the following code:

```js
const express = require('express');
const app = express();

app.listen(3000, () => {
    console.log('Listening for client requests');
})
```

9. In your terminal, run `nodemon` to confirm that your server is running.

Note: Don't ever close your terminal without stopping your server. You can do this using `ctrl + c`. If you do accidentally close it, your server will keep running and you won't be able to re-start it on the port that it's currently running on (in this case, 3000). If this happens, follow the steps outlined in this [document](https://gist.github.com/micahwierenga/7cafb291e1ea1794dc1472a619725dc1).


## Temporary database

Because we don't have a database yet, we will use an array to simulate the database. This means that, if we make changes to our array, those changes will be lost every time the server is stopped and/or restarted. 

```js
const express = require('express');
const app = express();

// temporary, simulated database
const fruits = ['apple', 'banana', 'pear'];

app.listen(3000, () => {
    console.log('Listening for client requests');
});
```


## Using routes to retrieve data

Earlier, the two parameters of our controller callback function were `request` and `response`, but let's shorten those to `req` and `res`. They still have the same meaning, just less to type.

```js
const express = require('express');
const app = express();

// temporary, simulated database
const fruits = ['apple', 'banana', 'pear'];

// routes/controllers
app.get('/fruits/0', (req, res) => {
    res.send(fruits[0]);
});

app.get('/fruits/1', (req, res) => {
    res.send(fruits[1]);
});

app.get('/fruits/2', (req, res) => {
    res.send(fruits[2]);
});

app.listen(3000, () => {
    console.log('Listening for client requests');
});
```

Now visit http://localhost:3000/fruits/0


## Read URL parameters

Our routes aren't DRY, and certainly not scalable. Similarly to the way that we pass parameters into functions, we can also pass parameters into URLs. We can use these parameters to modify which data is sent back to the client.

When defining parameters, we use the `:` so that express knows to capture whatever value is in that part of the URL path. Express then takes that parameter name and the value from the path and adds them as a key/value pair to an object called `params`, which is located in the `request` object (i.e., `req`).

That means that if we have a route/controller that looks like this:

```js
app.get('/users/:firstName', (req, res) => {
    res.send(`Hello, ${req.params.firstName}`);
})
```

And the client/browser sends a request like this:

```
http://localhost:3000/users/Dalton
```

Then Express will add "Dalton" to the `req` object like this:

```js
req: {
    params: {
        firstName: 'Dalton'
    }
}
```

And that's why we can reference "Dalton" by using `req.params.firstName`.

Let's refactor our controllers to just one controller:

```js
const express = require('express');
const app = express();

// temporary, simulated database
const fruits = ['apple', 'banana', 'pear'];

// routes/controllers
app.get('/fruits/:fruitIndex', (req, res) => {
    res.send(fruits[req.params.fruitIndex]);
});

app.listen(3000, () => {
    console.log('Listening for client requests');
});
```

Now try out the same URLs in the client.


## Place routes in correct order

Express starts at the top of your `server.js` file and attempts to match the request URL in the order in which the routes are defined.

URL params (e.g., `:foo`, `:example`, `:fruitIndex`) can be any value, whether it's a number or a string. Because params can be a wild card in this way, it makes their routes less specific. In other words, if a route is defined as `/recipes/italian`, it can only match requests that are exactly `/recipes/italian`. If the request is `/recipes/mexican`, this route will ignore it.

If, however, a route is defined as `/recipes/:type`, this will match requests like `/recipes/italian` or `/recipes/mexican`, or even `/recipes/hello` or `/recipes/22`. The controller may not find anything matching that parameter, but it will try.

Occasionally, a less specific route with a URL param will catch something that is supposed to go to something more specific route.

```js
const express = require('express');
const app = express();

// temporary, simulated database
const fruits = ['apple', 'banana', 'pear'];

// routes/controllers
// :fruitIndex can be any value, even "awesome"
app.get('/fruits/:fruitIndex', (req, res) => {
    res.send(fruits[req.params.fruitIndex]);
});

// This route will never be reached
app.get('/fruits/awesome', (req, res) => {
    res.send('Fruits are awesome!');
});

app.listen(3000, () => {
    console.log('Listening for client requests');
});
```

If this happens, we just need to reorder them so that more specific routes are evaluated before less specific routes (those with params in them).

```js
const express = require('express');
const app = express();

// temporary, simulated database
const fruits = ['apple', 'banana', 'pear'];

// routes/controllers
// Now this route will catch requests from /fruits/awesome
app.get('/fruits/awesome', (req, res) => {
    res.send('Fruits are awesome!');
});

// And this route will catch anything other than /fruits/awesome
app.get('/fruits/:fruitIndex', (req, res) => {
    res.send(fruits[req.params.fruitIndex]);
});


app.listen(3000, () => {
    console.log('Listening for client requests');
});
```

Acvitity (8 min)

Write new routes that have one or more parameters. (One idea might be `/dogs/:name/` or even `/dogs/:name/:breed`.) Take the parameter(s) and `res.send` them back to the browser either raw or interpolated into a string. Now, test them out by using http://localhost:3000 plus your route(s) in the browser.


## Creating Query Parameters

Like URL parameters, query parameters are data sent through the URL.

When defining query parameters, we use a `?` to indicate the beginning of a query parameter string, and we use `&` to separate key/value pairs.

This example has two query parameters, `firstName` and `secondName`:

```js
http://localhost:3000/users?firstName=Dalton&lastName=Hart
```

Just like `req.params`, Express will retrieves these query parameters through another object called `query`.

```js
const express = require('express');
const app = express();

// temporary, simulated database
const fruits = ['apple', 'banana', 'pear'];

// routes/controllers
app.get('/greetings', (req, res) => {
    res.send(`Hello, ${req.query.firstName} ${req.query.lastName}`)
})


app.listen(3000, () => {
    console.log('Listening for client requests');
});
```

Try it out: http://localhost:3000/greetings?firstName=Grace&lastName=Hopper

Let's add another controller for practice:

```js
app.get('/add', (req, res) => {
    const sum = req.query.x + req.query.y;
    res.send(`${req.query.x} + ${req.query.y} = ${sum}`);
})
```

Try it out: http://localhost:3000/add?x=5&y=4

<details>
  <summary>That didn't work as expected! Why is this?</summary>
  Parameters, whether URL or query, are passed in as strings. This means that sometimes we'll need to convert strings to another data type in order for them to perform as expected.
</details>

Let's convert our parameters to numbers:

```js
app.get('/add', (req, res) => {
    const sum = parseInt(req.query.x) + parseInt(req.query.y);
    res.send(`${req.query.x} + ${req.query.y} = ${sum}`);
})
```

Acvitity (8 min)

Write new routes that have one or more query parameters. (One idea might be a `/restaurants` route that expects parameters that look like `?cuisine=mexican` or even `?cuisine=mexican&price=medium`.) Take the parameter(s) and `res.send` them back to the browser either raw or interpolated into a string. Now, test them out by using http://localhost:3000 plus your route(s) in the browser.


Reminder: Let's stop our server (`ctrl + c`).