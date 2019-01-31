import { MoveRepository } from "../Repository/MoveRepository";
import { PokemonRepository } from "../Repository/PokemonRepository";
import { SimulationResult } from "./SimulationResult";
import { Battler } from "../Models/Battler";

test("SimulationResults", () => {
    var pokemon_repo = new PokemonRepository();
    var move_repo = new MoveRepository();

    // BASE HP = 162
    var venusaur = new Battler(
        pokemon_repo.LoadPokemon("Venusaur"),
        move_repo.LoadMove("Vine Whip"),
        move_repo.LoadMove("Solar Beam")
    );

    // BASE HP = 160
    var blastoise = new Battler(
        pokemon_repo.LoadPokemon("Blastoise"),
        move_repo.LoadMove("Water Gun"),
        move_repo.LoadMove("Hydro Pump")
    );

    var sim_result = new SimulationResult(venusaur, blastoise);

    expect(sim_result.WinnerRemainingHP()).toBe(1);
    expect(sim_result.WinnerDamageDealt()).toBe(0);
    expect(sim_result.WinnerEfficiency()).toBe(0);

    expect(sim_result.LooserDamageDealt()).toBe(0);
    expect(sim_result.LooserEfficiency()).toBe(0);

    blastoise.Health = 120;

    expect(sim_result.WinnerRemainingHP()).toBe(1);
    expect(sim_result.WinnerDamageDealt().toFixed(2)).toBe("0.25");
    expect(sim_result.WinnerEfficiency().toFixed(2)).toBe("0.25");
    expect(sim_result.LooserDamageDealt()).toBe(1 - sim_result.WinnerRemainingHP());

    venusaur.Health = 130;
    expect(sim_result.WinnerEfficiency()).toBeLessThan(0.25);
    expect(sim_result.LooserDamageDealt().toFixed(2)).toBe((1 - sim_result.WinnerRemainingHP()).toFixed(2));

    blastoise.Health = 0;
    expect(sim_result.WinnerEfficiency()).toBeLessThan(1);
    expect(sim_result.WinnerEfficiency()).toBeGreaterThan(0);
    
    expect(sim_result.LooserDamageDealt()).toBeGreaterThan(0);
    expect(sim_result.LooserEfficiency()).toBeGreaterThan(0);

    expect(sim_result.LooserEfficiency()).toBeLessThanOrEqual(sim_result.WinnerEfficiency());
});