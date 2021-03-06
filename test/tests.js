var path = require("path");

describe("mockuire", function() {
  afterEach(function() {
    delete global.foo;
  });

  it("should allow to mock a simple require", function() {
    var mocker = require("../lib/index")(module),
        foo = mocker("./fixture/foo", {
          "path": {
            "join": function() {
              var parts = 1 <= arguments.length ? [].slice.call(arguments, 0) : [];
              return parts.join("!");
            }
          }
        }),
        result = foo("a", "b");

    result.should.be.eql("a!b!burbujas");
  });

  it("should use caller requires", function() {
    var mocker = require("../lib/index")({
        filename: module.filename,
        require: function(m) {
          return {
            join: function() {
              var parts;
              parts = 1 <= arguments.length ? [].slice.call(arguments, 0) : [];
              return parts.join("!");
            }
          };
        }
      }),
      foo = mocker("./fixture/foo", {}),
      result = foo("a", "b");

    result.should.be.eql("a!b!burbujas");
  });

  it("should allow compilers", function() {
    var mocker = require("../lib/index")(module, {
        "coffee": require("coffee-script")
      }),
      bar = mocker("./fixture/bar", {
        "path": {
          "join": function() {
            var parts;
            parts = 1 <= arguments.length ? [].slice.call(arguments, 0) : [];
            return parts.join("!");
          }
        }
      }),
      result = bar("a", "b");
    result.should.be.eql("a!b!burbujas");
  });

  it("should fail when it doesnt find the file", function() {
    var mocker = require("../lib/index")(module);
    (function() {
      return mocker("./notexist", {});
    }).should["throw"]("Cannot find module './notexist'");
  });

  it("should copy globals to sandbox globals", function() {
    global.foo = 1;
    var mocker = require("../lib/index")(module),
      withGlobals = mocker("./fixture/withGlobals", {}),
      result = withGlobals();

    result.should.be.eql(1);
  });

  it('should be able to use __dirname', function () {
    var mockuire = require("../lib/index")(module);

    var dirname = mockuire("./fixture/dirname_filename", {}).dirname();

    dirname.should.be.eql(__dirname + '/fixture');
  });

  it('should be able to use __filename', function () {
    var mockuire = require("../lib/index")(module);

    var filename = mockuire("./fixture/dirname_filename", {}).filename();

    filename.should.be.eql(__dirname + '/fixture/dirname_filename.js');
  });
});
