// Fetch the `global` doc object. On success, the callback is invoked
  // with `(null, global)`. If no callback is passed a promise is returned.

  self.findGlobal = function(req, callback) {
    if (callback) {
      return body(callback);
    } else {
      return Promise.promisify(body)();
    }
    function body(callback) {
      var global;
      var cursor;
      return async.series([
        find, after
      ], function(err) {
        if (err) {
          return callback(err);
        }
        return callback(null, global);
      });
      function find(callback) {
        cursor = self.find(req, { slug: self.slug })
          .permission(false)
          .sort(false)
          .joins(false)
          .areas(false);
        return cursor.toObject(function(err, doc) {
          global = doc;
          // Make this available early, sans joins and area loaders,
          // to avoid race conditions for modules like
          // apostrophe-pieces-orderings-bundle if we wait
          // for joins that might also need the global doc to find their
          // default orderings, etc.
          req.aposGlobalCore = global;
          return callback(err);
        });
      }
      function after(callback) {
        if (!global) {
          return callback(null);
        }
        cursor = cursor.clone();
        cursor.joins(true);
        // Can this areas filter be turned off here?
        // This would solve the max recursions warning I am having as the warnings are 
        // triggered by the global doc/piece
        cursor.areas(true);
        return cursor.after([ global ], callback);
      }
    }
  };