import { test, mock, afterEach } from "node:test";
import assert from "node:assert/strict";

const isNode19OrLower = process.versions.node.split(".")[0] < "20";

console.log(`is Node 19 or lower ${isNode19OrLower}`)

// calculationService with the original calculate method
const calculationService = {
	calculate: (a: number, b: number): number => a + b,
  };  

afterEach(() => {
	mock.timers.reset();
});

test(
	"mock.timers can mock Date and be reset",
	{ skip: isNode19OrLower },
	(t) => {
		t.mock.timers.enable({
			// @ts-ignore
			apis: ["Date"],
			now: new Date("2023-05-14T11:01:58.135Z"),
		});

		assert.deepEqual(new Date(), new Date("2023-05-14T11:01:58.135Z"));

		t.mock.timers.reset();
		assert(new Date().getFullYear() > 2023);
	},
);

test(
	"mock.timers can mock Date.now() and be ticked forward",
	{ skip: isNode19OrLower },
	(t) => {
		t.mock.timers.enable({
			// @ts-ignore
			apis: ["Date"],
			now: new Date("2023-05-14T11:01:58.135Z"),
		});

		assert.deepEqual(
			Date.now(),
			new Date("2023-05-14T11:01:58.135Z").valueOf(),
		);

		// advance by 24h
		t.mock.timers.tick(1000 * 60 * 60 * 24);

		assert.deepEqual(
			Date.now(),
			new Date("2023-05-15T11:01:58.135Z").valueOf(),
		);

		// @ts-ignore
		t.mock.timers.setTime(20000);
		assert.deepEqual(Date.now(), 20000);
	},
);

test(
	"Simple Math Test",
	{ skip: isNode19OrLower },
	(t) => {
		mock.method(calculationService, "calculate", (a: any, b: any) => a * b);

    	assert.strictEqual(calculationService.calculate(3, 2), 7);
	},
);

