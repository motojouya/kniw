import { describe, it, expect } from 'vitest'

import { changeClimate } from "../../src/model/field";

describe("Climate#changeClimate", function () {
  it("5 test", function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.05,
    });
    expect(result, "SUNNY");
  });
  it("15 test", function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.15,
    });
    expect(result, "SUNNY");
  });
  it("25 test", function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.25,
    });
    expect(result, "SUNNY");
  });
  it("35 test", function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.35,
    });
    expect(result, "SUNNY");
  });
  it("45 test", function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.45,
    });
    expect(result, "RAIN");
  });
  it("55 test", function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.55,
    });
    expect(result, "RAIN");
  });
  it("65 test", function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.65,
    });
    expect(result, "RAIN");
  });
  it("75 test", function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.75,
    });
    expect(result, "FOGGY");
  });
  it("85 test", function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.85,
    });
    expect(result, "STORM");
  });
  it("95 test", function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.95,
    });
    expect(result, "SNOW");
  });

  it("0 test", function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0,
    });
    expect(result, "SUNNY");
  });
  it("40 test", function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.4,
    });
    expect(result, "SUNNY");
  });
  it("41 test", function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 0.41,
    });
    expect(result, "RAIN");
  });
  it("100 test", function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.1,
      accuracy: 1,
    });
    expect(result, "SNOW");
  });

  it("times test", function () {
    const result = changeClimate({
      times: 0.95,
      damage: 0.1,
      accuracy: 0.05,
    });
    expect(result, "SUNNY");
  });
  it("damage test", function () {
    const result = changeClimate({
      times: 0.1,
      damage: 0.95,
      accuracy: 0.05,
    });
    expect(result, "SUNNY");
  });

  it("minus test", function () {
    try {
      const _result = changeClimate({
        times: 0.1,
        damage: 0.1,
        accuracy: -0.5,
      });
      assert.fail();
    } catch (e) {
      const error = e as Error;
      expect(error.message, "accuracyの値は0から1です");
    }
  });
  it("over test", function () {
    try {
      const _result = changeClimate({
        times: 0.1,
        damage: 0.1,
        accuracy: 1.5,
      });
      assert.fail();
    } catch (e) {
      const error = e as Error;
      expect(error.message, "accuracyの値は0から1です");
    }
  });
});
