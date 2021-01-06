const express = require('express');
const app = express();
const PORT = 4000;

app.get('/about', (request, response) => {
  // console.log(request);

  response.send('This page is all about me!');
});

app.get('/projects', (request, response) => {
  response.send('Here are all of my projects!');
});

app.get('/products', (request, response) => {
  response.send('These are all my products!');
});

// ROUTE PARAMS
app.get('/products/:productName/', (request, response) => {
  const productName = request.params.productName;

  response.send(`Buy this ${productName}!`);
});

// We can even pass in multiple route params
app.get('/products/:productName/:color', (request, response) => {
  const productName = request.params.productName;
  const color = request.params.color;

  if (productName === 'sticky-notes') {
    return response.send('Sorry. We are out of that product!');
  }

  response.send(`Buy this ${color} ${productName}`);
});

// Route params are accessible inside the callback function as
// regular variables. We can do any sort of logic on these
// variables and even do math with them.
app.get('/addition/:firstNum/:secondNum', (request, response) => {
  const firstNumConverted = parseInt(request.params.firstNum);
  const secondNumConverted = parseInt(request.params.secondNum);

  const sum = (firstNumConverted + secondNumConverted).toString();

  response.send(sum);
})

// START UP A SERVER
app.listen(PORT, () => {
  console.log(`Your server is running on port ${PORT}!`);
});
