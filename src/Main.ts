import { MoveRepository } from "./Repository/MoveRepository";
import { PokemonRepository } from "./Repository/PokemonRepository";
import { Simulator, SimulationResult } from "./Simulator/Simulator";
import { Battler } from "./Models/Battler";
import _ = require("lodash");
import { Printer } from "./Utility/Printer";
import Constants from "./Shared/Constants";

var pokemon_repo = new PokemonRepository()
var move_repo = new MoveRepository();

var pokemons =  pokemon_repo.LoadAllPokemon();

let results : Array<SimulationResult>= new Array;

console.time("pvp-sims-all-vs-all");

[pokemon_repo.LoadPokemon("Venusaur")].forEach(attacker => {
    attacker.ScaleToCombatPower(Constants.GREAT_LEAGUE_MAX_CP);

    pokemons.forEach(defender => {

        defender.ScaleToCombatPower(Constants.GREAT_LEAGUE_MAX_CP);

        attacker.FastMoves.forEach(attacker_fm => {
            attacker.ChargeMoves.forEach(attacker_cm => {
                defender.FastMoves.forEach(defender_fm => {
                    defender.ChargeMoves.forEach(defender_cm => {
        
                        let sim = new Simulator(
                            new Battler(
                                attacker,
                                move_repo.LoadMove(attacker_fm),
                                move_repo.LoadMove(attacker_cm),
                            ),
        
                            new Battler(
                                defender,
                                move_repo.LoadMove(defender_fm),
                                move_repo.LoadMove(defender_cm),
                            )
                        );
        
                        let result = sim.Simulate();

                        if(attacker.ID !== result.Winner.Pokemon.ID) {
                            results.push(result);
                        }
                    });    
                });
            });    
        });
    })
})

console.timeEnd("pvp-sims-all-vs-all");


let printer = new Printer();

_(results)
.groupBy((sim: SimulationResult) => {
    return `${sim.Looser.FastMove.ID}-${sim.Looser.ChargeMove.ID}`
})
.each((result: Array<SimulationResult>, key: string) => {

    console.log(key);
    let already_printed : any = {};
    let already_printed_count = 0;

    _(result)
    .orderBy((sim: SimulationResult) => { return sim.WinnerEfficiency() / sim.CombatTime(); }, 'desc')
    .forEach((sim: SimulationResult) => {

        if(!already_printed[sim.Winner.Pokemon.ID] && already_printed_count < 20) {
            printer.PrintBattleOutcome(sim);

            already_printed_count++;
            already_printed[sim.Winner.Pokemon.ID] = true;
        }
    });
});