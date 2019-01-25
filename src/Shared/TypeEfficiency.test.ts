import { TypeEfficiency } from "./TypeEfficiency";
import { Type } from "./Types";
import Constants from "./Constants";

test('TypeEfficiency:GetMoveEfficiency', () => {
    expect(TypeEfficiency.GetMoveEfficiency(Type.Water, Type.Fire)).toBe(Constants.SE_MULTI);
    expect(TypeEfficiency.GetMoveEfficiency(Type.Electric, Type.Water)).toBe(Constants.SE_MULTI);
    expect(TypeEfficiency.GetMoveEfficiency(Type.Fire, Type.Grass)).toBe(Constants.SE_MULTI);
    expect(TypeEfficiency.GetMoveEfficiency(Type.Grass, Type.Water)).toBe(Constants.SE_MULTI);
    expect(TypeEfficiency.GetMoveEfficiency(Type.Ice, Type.Dragon)).toBe(Constants.SE_MULTI);

    expect(TypeEfficiency.GetMoveEfficiency(Type.Fire, Type.Water)).toBe(Constants.NE_MULTI);

    expect(TypeEfficiency.GetMoveEfficiency(Type.Grass, Type.Grass)).toBe(Constants.NE_MULTI);
    expect(TypeEfficiency.GetMoveEfficiency(Type.Grass, Type.Poison)).toBe(Constants.NE_MULTI);

    expect(TypeEfficiency.GetMoveEfficiency(Type.Grass, Type.Water)).toBe(Constants.SE_MULTI);
    expect(TypeEfficiency.GetMoveEfficiency(Type.Normal, Type.Ghost)).toBe(Constants.NE_MULTI * Constants.NE_MULTI);
    expect(TypeEfficiency.GetMoveEfficiency(Type.Ghost, Type.Normal)).toBe(Constants.NE_MULTI * Constants.NE_MULTI);

    expect(TypeEfficiency.GetMoveEfficiency(Type.Rock, Type.Ice, Type.Flying)).toBe(Constants.SE_MULTI * Constants.SE_MULTI);
});