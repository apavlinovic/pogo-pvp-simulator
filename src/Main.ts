import { MoveRepository } from "./Repository/MoveRepository";
import { PokemonRepository } from "./Repository/PokemonRepository";
import { Simulator, SimulationResult } from "./Simulator/Simulator";
import { Battler } from "./Models/Battler";
import _ = require("lodash");
import { Printer } from "./Utility/Printer";

var pokemon_repo = new PokemonRepository()
var move_repo = new MoveRepository();

var pokemons =  pokemon_repo.LoadAllPokemon().slice(0, 200);
let results : Array<SimulationResult>= new Array;

console.time("pvp-sims-all-vs-all");

[pokemon_repo.LoadPokemon("Venusaur")].forEach(attacker => {
    pokemons.forEach(defender => {
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

                        if(attacker.ID !== result.Winner.Pokemon.ID)
                            results.push(result);
                    });    
                });
            });    
        });
    })
})

console.timeEnd("pvp-sims-all-vs-all");


let printer = new Printer();

_(results).orderBy((sim:SimulationResult) => {

    return sim.CombatTime();

}, 'asc')
.take(40)
.each((result: SimulationResult) => {

    printer.PrintBattleOutcome(result);

});