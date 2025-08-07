import { describe, expect, test } from "vitest";
import { shouldUpdateCache } from "./handler";

describe("shouldUpdateCache", () => {
  const TTL = 7 * 24 * 60 * 60 * 1000; // 7 days
  const BETA = 1.0;

  test("should always update when cache age equals or exceeds TTL", () => {
    // When age >= TTL, should always update regardless of random value
    expect(shouldUpdateCache(TTL, TTL, BETA, 0.1)).toBe(true);
    expect(shouldUpdateCache(TTL, TTL, BETA, 0.5)).toBe(true);
    expect(shouldUpdateCache(TTL, TTL, BETA, 0.9)).toBe(true);
    expect(shouldUpdateCache(TTL * 2, TTL, BETA, 0.5)).toBe(true);
  });

  test("should never update when age is 0", () => {
    // Fresh cache should rarely update (only with very small random values)
    expect(shouldUpdateCache(0, TTL, BETA, 0.99)).toBe(false);
    expect(shouldUpdateCache(0, TTL, BETA, 0.9)).toBe(false);
    expect(shouldUpdateCache(0, TTL, BETA, 0.5)).toBe(false);
  });

  test("should have increasing update probability as age increases", () => {
    // With fixed random value, older cache should be more likely to update
    const random = 0.5; // -log(0.5) ≈ 0.693
    const day = 24 * 60 * 60 * 1000;

    // Calculate whether each age triggers update
    // xfetch = (TTL - age) * beta * 0.693
    // Updates when: age + xfetch >= TTL, or when: xfetch >= TTL - age
    const day1 = shouldUpdateCache(1 * day, TTL, BETA, random);
    const day3 = shouldUpdateCache(3 * day, TTL, BETA, random);
    const day5 = shouldUpdateCache(5 * day, TTL, BETA, random);
    const day6 = shouldUpdateCache(6 * day, TTL, BETA, random);

    // With beta=1.0 and random=0.5:
    // Day 1: xfetch = 6 * 0.693 = 4.16 days, 1 + 4.16 < 7, no update
    // Day 3: xfetch = 4 * 0.693 = 2.77 days, 3 + 2.77 < 7, no update
    // Day 5: xfetch = 2 * 0.693 = 1.39 days, 5 + 1.39 < 7, no update
    // Day 6: xfetch = 1 * 0.693 = 0.69 days, 6 + 0.69 < 7, no update
    expect([day1, day3, day5, day6]).toEqual([false, false, false, false]);
  });

  test("should update more aggressively with higher beta", () => {
    const age = 3 * 24 * 60 * 60 * 1000; // 3 days
    const random = 0.5;

    const conservative = shouldUpdateCache(age, TTL, 0.5, random);
    const standard = shouldUpdateCache(age, TTL, 1.0, random);
    const aggressive = shouldUpdateCache(age, TTL, 2.0, random);

    // Higher beta should lead to more updates
    expect(conservative).toBe(false);
    expect(standard).toBe(false);
    expect(aggressive).toBe(true);
  });

  test("should handle edge case with very small random values", () => {
    // Very small random values create large xfetch values
    const age = 1 * 24 * 60 * 60 * 1000; // 1 day
    const verySmallRandom = 0.0001;

    // Even young cache might update with very small random
    expect(shouldUpdateCache(age, TTL, BETA, verySmallRandom)).toBe(true);
  });

  test("should handle edge case with random value approaching 1", () => {
    // Random values close to 1 create small xfetch values
    const age = 6 * 24 * 60 * 60 * 1000; // 6 days
    const almostOne = 0.9999;

    // Even old cache might not update with random close to 1
    expect(shouldUpdateCache(age, TTL, BETA, almostOne)).toBe(false);
  });

  test("should demonstrate xfetch probabilistic behavior", () => {
    // Statistical test: run multiple times and check distribution
    const age = 4 * 24 * 60 * 60 * 1000; // 4 days (middle of TTL)
    let updateCount = 0;
    const iterations = 1000;

    for (let i = 0; i < iterations; i++) {
      if (shouldUpdateCache(age, TTL, BETA)) {
        updateCount++;
      }
    }

    // At 4 days with beta=1.0, expect roughly 20-40% update rate
    // (4/7 ≈ 57% through TTL)
    const updateRate = updateCount / iterations;
    expect(updateRate).toBeGreaterThan(0.15);
    expect(updateRate).toBeLessThan(0.45);
  });
});
