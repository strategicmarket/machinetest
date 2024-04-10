import test, { describe, it } from "node:test";
import assert from "node:assert";

test("it is a very basic test", () => {
  assert.strictEqual(1, 1);
});

// you can also define a test suite using "describe"
describe("01 - Basics", () => {
  // "it" is a shorthand for test()
  it("callback passing test", (_, done) => {
    // done() is the callback function.
    setImmediate(done);
  });

  // nesting test suites is allowed
  describe("a nested suite", () => {
    it("should work also", () => {
      assert.strictEqual(3, 3);
    });
  });
});