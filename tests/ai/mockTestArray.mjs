import { test } from "node:test";
import assert from "node:assert/strict";

const users = [
	{ id: 1, name: "Strategic" },
	{ id: 2, name: "Machines" },
];

test("we should have ids 1 and 2", () => {
	assert.deepEqual(
		users.map((u) => u.id),
		[1, 2],
	);
});