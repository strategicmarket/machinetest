import assert from "node:assert";
import { test, describe, mock } from "node:test";

const calculationService = {
  calculate: (a, b) => a + b,
};

describe("03 - Mocks", () => {
  test("stub and spies on a function", () => {
    mock.method(calculationService, "calculate", (a, b) => a * b);

    assert.strictEqual(calculationService.calculate(3, 2), 6);
    assert.strictEqual(calculationService.calculate.mock.calls.length, 1);

    const call = calculationService.calculate.mock.calls[0];
    assert.deepStrictEqual(call.arguments, [3, 2]);
    assert.strictEqual(call.result, 6);
    assert.strictEqual(call.error, undefined);

    mock.reset();
  });
});