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

_(pokemons).each(poke => {
    output[poke.ID] = {
        id: poke.ID,
        wins: 0,
        losses: 0,
        win_score: 0,
        losse_score: 0
    };
})


_(results)
.groupBy((sim: SimulationResult) => {
    return `${sim.Winner.Pokemon.ID}`
})
.each((result: Array<SimulationResult>, key: string) => {

    
    let score = _.reduce(result, (memo, sim) => {
        return memo + sim.WinnerEfficiency();
    }, 0)

    output[key].wins = result.length;
    output[key].win_score = score / result.length;
})

_(results)
.groupBy((sim: SimulationResult) => {
    return `${sim.Looser.Pokemon.ID}`
})
.each((result: Array<SimulationResult>, key: string) => {

    output[key].losses = result.length;

    
    
    let score = _.reduce(result, (memo, sim) => {
        return memo + sim.LooserEfficiency();
    }, 0)

    output[key].losse_score = score / result.length;
    output[key].total_score = output[key].wins / output[key].losses * output[key].win_score / output[key].losse_score; 
})

_(output).values().orderBy(row => { return row.total_score }).each(row => {
    console.log(row)
})
