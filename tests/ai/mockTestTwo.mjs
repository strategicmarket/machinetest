import test, {
    describe,
    before,
    beforeEach,
    after,
    afterEach,
  } from "node:test";
  import assert from "node:assert";
  
  const hooksPassed = [];
  
  describe("02 - Hooks", () => {
    before(() => {
      hooksPassed.push(`I'm running once before all tests in this suite`);
    });
  
    beforeEach(() => {
      hooksPassed.push(`I'm running before each tests`);
    });
  
    after(() => {
      hooksPassed.push(`I'm running once after all tests in this suite`);
    });
  
    afterEach(() => {
      hooksPassed.push(`I'm running after each tests`);
    });
  
    test("a test", () => {
      assert.strictEqual(1, 1);
    });
  
    test("another test", () => {
      assert.strictEqual(1, 1);
    });
  });
  
  test("check hooks passed", () => {
    assert.deepEqual(hooksPassed, [
      "I'm running once before all tests in this suite",
      "I'm running before each tests",
      "I'm running after each tests",
      "I'm running before each tests",
      "I'm running after each tests",
      "I'm running once after all tests in this suite",
    ]);
  });