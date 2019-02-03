import { PokemonRepository } from "../Repository/PokemonRepository";
import { MoveRepository } from "../Repository/MoveRepository";
import { SimulationResult } from "../Simulator/SimulationResult";
import { Simulator } from "../Simulator/Simulator";
import { Battler } from "../Models/Battler";
import { Type } from "../Shared/Types";

export class SimRunner {

    RunAllVsAllSimulations(MaxCP: number, allowedTypes?: Array<Type>) {

        let pokemon_repo = new PokemonRepository();
        let move_repo = new MoveRepository();

        let pokemons =  pokemon_repo.LoadAllPokemon();

        if(allowedTypes) {
            pokemons = pokemons.filter(pokemon => {
                return allowedTypes.indexOf(pokemon.Type1) != -1 ||
                       (pokemon.Type2 && allowedTypes.indexOf(pokemon.Type2) != -1);
            }).filter(pokemon => {
                return !pokemon.ID.startsWith('V0493_POKEMON_ARCEUS_') && !pokemon.ID.startsWith('V0479_POKEMON_ROTOM')
            });

        }

        let sim_results : Array<SimulationResult>= new Array;
        
        console.log(`Simulating matchups between: ${ pokemons.length } Pokemon.`);
        
        console.time("pvp-sims-all-vs-all");
        let sim = new Simulator();
        
        let shields = [[0,0]];

        shields.forEach(shield => {

            pokemons.forEach(attacker => {
                attacker.ScaleToCombatPower(MaxCP);
            
                pokemons.forEach(defender => {
            
                    defender.ScaleToCombatPower(MaxCP);
            
                    attacker.FastMoves.forEach(attacker_fm => {
                        attacker.ChargeMoves.forEach(attacker_cm => {
                            defender.FastMoves.forEach(defender_fm => {
                                defender.ChargeMoves.forEach(defender_cm => {
                    
                                    sim.SetBattlers(new Battler(
                                        attacker,
                                        move_repo.LoadMove(attacker_fm),
                                        move_repo.LoadMove(attacker_cm),
                                        null,
                                        shield[0]
                                    ),
                
                                    new Battler(
                                        defender,
                                        move_repo.LoadMove(defender_fm),
                                        move_repo.LoadMove(defender_cm),
                                        null,
                                        shield[1]
                                    ));

                                    sim_results.push(sim.Simulate());
                                });    
                            });
                        });    
                    });
                });
            });
        });

        console.timeEnd("pvp-sims-all-vs-all");
        
        return sim_results;
    }
}