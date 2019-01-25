import { Pokemon } from "./Pokemon";
import { Type } from "../Shared/Types";

test('Pokemon:StatGeneration', () => {
    let Venusaur_40_100 = new Pokemon(190, 198, 189, Type.Grass, Type.Poison, 40, 15, 15, 15);
    let Venusaur_40_0 = new Pokemon(190, 198, 189, Type.Grass, Type.Poison, 40, 0, 0, 0);
    let Venusaur_1_0 = new Pokemon(190, 198, 189, Type.Grass, Type.Poison, 1, 0, 0, 0);

    expect(Venusaur_40_100.CP).toBe(2720);
    expect(Venusaur_40_0.CP).toBe(2343);
    expect(Venusaur_1_0.CP).toBe(33);

    let Regigigas_20_100 = new Pokemon(221, 287, 210, Type.Normal, null, 20, 15, 15, 15);
    let Regigigas_25_100 = new Pokemon(221, 287, 210, Type.Normal, null, 25, 15, 15, 15);

    expect(Regigigas_20_100.CP).toBe(2483);
    expect(Regigigas_25_100.CP).toBe(3104);

})