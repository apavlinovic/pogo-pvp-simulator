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

console.log(pokemons.length);

console.time("pvp-sims-all-vs-all");
let sim = new Simulator();

pokemons.forEach(attacker => {
    attacker.ScaleToCombatPower(Constants.GREAT_LEAGUE_MAX_CP);

    pokemons.forEach(defender => {

        defender.ScaleToCombatPower(Constants.GREAT_LEAGUE_MAX_CP);

        attacker.FastMoves.forEach(attacker_fm => {
            attacker.ChargeMoves.forEach(attacker_cm => {
                defender.FastMoves.forEach(defender_fm => {
                    defender.ChargeMoves.forEach(defender_cm => {
        
                        sim.SetBattlers(new Battler(
                            attacker,
                            move_repo.LoadMove(attacker_fm),
                            move_repo.LoadMove(attacker_cm),
                        ),
    
                        new Battler(
                            defender,
                            move_repo.LoadMove(defender_fm),
                            move_repo.LoadMove(defender_cm),
                        ));
        
                        let result = sim.Simulate();

                        results.push(result);
                    });    
                });
            });    
        });
    })
})

console.timeEnd("pvp-sims-all-vs-all");


let output : any = { };

_(results)
.groupBy((sim: SimulationResult) => {
    return `${sim.Winner.Pokemon.ID}`
})
.each((result: Array<SimulationResult>, key: string) => {

    output[key] = [ key, result.length, null ];

})

_(results)
.groupBy((sim: SimulationResult) => {
    return `${sim.Looser.Pokemon.ID}`
})
.each((result: Array<SimulationResult>, key: string) => {

    output[key][2] = result.length;
    output[key][3] = output[key][1] / (output[key][1] + output[key][2]);
})

_(output).values().orderBy(row => { return row[3] }).each(row => {
    console.log(row)
})
