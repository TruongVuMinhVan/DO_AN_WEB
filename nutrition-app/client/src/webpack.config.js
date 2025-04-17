module.exports = {
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "url": require.resolve("url/"),
      "querystring": require.resolve("querystring-es3"),
      "zlib": require.resolve("browserify-zlib"),
      "fs": false,  // Tránh polyfill cho fs vì không cần thiết trong trình duyệt
      "http": require.resolve("stream-http"),
      "net": false  // Tránh polyfill cho net
    }
  }
};
