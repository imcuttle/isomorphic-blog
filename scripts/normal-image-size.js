#!/usr/bin/env node
const sizeOf = require('image-size');
var url = require('url');
var http = require('http');

var imgUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAoCAYAAAAIeF9DAAADrElEQVRoQ+2Ze0yOURzHP7klicUkc8k1ajIm9/tyGZoxlzGGuWW14Q+XsWlIy22YjLlUQy5zG+kyEwpRWojM+6ZSaoaQaVksy06/NTOvsNmeY8756333e55zfs/383y/57x7naqXUI0Z2ijgZIBow6KmEQNELx4GiGY8DBADRDcFNOvH7CEGiGYKaNaOcYgBopkCmrVjHGKAaKaAZu0YhxggmimgWTvGIQaIAwVC4qD7KHCqD7FBELAcPLvDpwrYPhx8RsPUbeDsClWfIPsSHJwuE3n1g6DT0LIjVFfD8yzYNwXel4CbB6xMBc8eUrNfh10Bcl9dNQshWe+QLkNEtIp38MoOL20wdBG8eQZvCyEtBuZFw5fP8DBe4Li2gHNrIHU/hOdB01bwKB48vAVkThJEToCNNvluT4HmngLmwQXYP6Xu2n8LZHI4ePmDzxgofgD5aaAAdegDjxKgrERE7DYMtg6BZ+nQaSDMPSyiV5bDpI2QFAEX1omMq25B5Qe4cxQWxkJJNoT3BWc3CLNDYzeBOXOP41qoj7jLomGtQ1beELF/NlRkVVVCQxd4WwRtfODzR7h5CE6vgNVp0HmQCNvWT2LJlgx7xsOcAzBsCWSdgYMzZIU1t6HTAMhNlYh0VIuZDxnHLMKhwx9UfhNB7SGZpyBqNsyMhJEhcGQB3DsHW4qgiTt8LIP8O9B1KLg0E1eo+OrYD75UwZMr0MYXWnqJ4C9yZJ6L6yFxswi89q44Mu8mdBvuuHZqGaTsNUBqxFdv8qy9MCIYToZAeixsLYZGTWRzV5GlAAZfhFe5ssG37w1xoZAQJrGkrq/XQCLPfwZkHIfoOd8DUdGowDqqqXXV3mTRsDay1EPXOsQRkJpNuwDc28GGnvA6V/YYdQhQQErzwC8Qji2GtCgBElEoEXd5GwSGgu0q7B4j8m6yg3v7umthvWUdi4b+QJRjVPQUZUFGrHz26Aop+yAnUdxSXgrJO8F3rMRYYSbsDPh2AkveBa29oVfgr2sR/S1CIcvqAUSJev/8j5FVGx3LL4vYtcN27dvviWk7IGAF1Ksv1ddPITJQ3nLfcbD0LDg3lVppAewYIaeoumoWIrEeyO8+vPdIOUkVpENR5vd3qagaNA9K8+Fx0o8zDl4gp7W7J/6s9ru9/cXr/h0gf/GhdZ7KANGMjgFigGimgGbtGIcYIJopoFk7xiEGiGYKaNaOcYgBopkCmrVjHGKAaKaAZu0YhxggmimgWTvGIZoB+QrxWqvY4GbvQAAAAABJRU5ErkJggg==';
var options = url.parse(imgUrl);

http.get(options, function (response) {
    var chunks = [];
    response.on('data', function (chunk) {
        chunks.push(chunk);
    }).on('end', function() {
        var buffer = Buffer.concat(chunks);
        console.log(sizeOf(buffer));
    });
});
