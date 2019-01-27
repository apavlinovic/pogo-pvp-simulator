import { MoveRepository } from "./Repository/MoveRepository";
import { PokemonRepository } from "./Repository/PokemonRepository";
import { Simulator, SimulationResult } from "./Simulator/Simulator";
import { Battler } from "./Models/Battler";
import * as colors from 'colors';
import { TimelineEventType } from "./Simulator/Timeline";
import _ = require("lodash");

var pokemon_repo = new PokemonRepository()
var move_repo = new MoveRepository();

var pokemons =  pokemon_repo.LoadAllPokemon();
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


var best_counter = _(results).orderBy((sim:SimulationResult) => {
    return sim.CombatTime();
}, 'asc').value()[0]


let timeline = best_counter.Winner.Timeline.ZipWithAnotherTimeline(best_counter.Looser.Timeline);

let poke1 = Array();
let poke2 = Array();
let turns = Array();

timeline.forEach(ev => {


    turns.push(ev[0].toString().padStart(2, '0'));
    
    if(ev[1]) {
        if(ev[1].Type == TimelineEventType.FastMove)
            poke1.push('FF')
        else if (ev[1].Type == TimelineEventType.ChargeMove)
            poke1.push('CC')
        else if (ev[1].Type == TimelineEventType.Shield)
            poke1.push('SS')
    } else {
        poke1.push('--')
    }

    if(ev[2]) {
        if(ev[2].Type == TimelineEventType.FastMove)
            poke2.push('FF')
        else if (ev[2].Type == TimelineEventType.ChargeMove)
            poke2.push('CC')
        else if (ev[2].Type == TimelineEventType.Shield)
            poke2.push('SS')
    } else {
        poke2.push('--')
    }

});

console.log(best_counter.Winner.Pokemon.ID)
console.log(poke1.join(' '));
console.log(poke2.join(' '));
console.log(turns.join(' '));
