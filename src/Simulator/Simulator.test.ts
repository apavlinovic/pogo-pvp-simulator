import { Pokemon } from "../Models/Pokemon";
import Constants from "../Shared/Constants";
import { Battler } from "../Models/Battler";
import { Printer } from "../Utility/Printer";
import { Simulator } from "./Simulator";
import { MoveRepository } from "../Repository/MoveRepository";
import { PokemonRepository } from "../Repository/PokemonRepository";

test('RaichuVsAzumarill_GREAT_LEAGUE', () => {
    var repo = new PokemonRepository();
    var move_repo = new MoveRepository();

    var opponent = repo.LoadPokemon("V0184_POKEMON_AZUMARILL");
    var me = repo.LoadPokemon("V0026_POKEMON_RAICHU_NORMAL");
    
    opponent.ScaleToCombatPower(Constants.GREAT_LEAGUE_MAX_CP);
    me.ScaleToCombatPower(Constants.GREAT_LEAGUE_MAX_CP);
    
    var sim = new Simulator();
    
    sim.SetBattlers(
        new Battler(
            opponent,
            move_repo.LoadMove("BUBBLE_FAST"),
            move_repo.LoadMove("HYDRO_PUMP"),
            null,
            2,
            true
        ),
        new Battler(
            me,
            move_repo.LoadMove("VOLT_SWITCH_FAST"),
            move_repo.LoadMove("THUNDER_PUNCH"),
            null,
            2,
            true
        )
    );
            
    var output = sim.Simulate();

    expect(output.Winner.Pokemon.ID).toBe("V0184_POKEMON_AZUMARILL");
    expect(output.Winner.Shields).toBe(0);
    expect(output.Looser.Shields).toBe(0);
    expect(output.Winner.Health / output.Winner.Pokemon.HP).toBe(0.0224215246636771)
    
});