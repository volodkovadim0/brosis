const express = require('express');

const distDir = 'dist/BroSis'

express().use(express.static(`./${distDir}`))
  .get('/*', (req, res) =>
    res.sendFile('index.html', { root: distDir }))
  .listen(process.env.PORT || 8080);
