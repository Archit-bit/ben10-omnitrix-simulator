import { renderHook } from "@testing-library/react";
import useOmnitrixStore from "@/lib/store";
import aliensData from "@/data/aliens.json";

describe("Omnitrix Store", () => {
  it("should load aliens correctly", () => {
    const { result } = renderHook(() => useOmnitrixStore());
    result.current.loadAliens();
    expect(result.current.aliens).toEqual(aliensData);
    expect(result.current.aliens.length).toBe(7);
  });

  it("should set current state", () => {
    const { result } = renderHook(() => useOmnitrixStore());
    result.current.setCurrentState("browsing");
    expect(result.current.currentState).toBe("browsing");
  });

  it("should set selected alien", () => {
    const { result } = renderHook(() => useOmnitrixStore());
    result.current.setSelectedAlienId("heatblast");
    expect(result.current.selectedAlienId).toBe("heatblast");
  });

  it("should reset timers", () => {
    const { result } = renderHook(() => useOmnitrixStore());
    result.current.setTransformationTimer(30);
    result.current.setCooldownTimer(10);
    result.current.resetTimers();
    expect(result.current.transformationTimer).toBe(0);
    expect(result.current.cooldownTimer).toBe(0);
  });
});
