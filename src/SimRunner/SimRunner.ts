import { PokemonRepository } from "../Repository/PokemonRepository";
import { MoveRepository } from "../Repository/MoveRepository";
import { SimulationResult } from "../Simulator/SimulationResult";
import { Simulator } from "../Simulator/Simulator";
import { Battler } from "../Models/Battler";

export class SimRunner {

    RunAllVsAllSimulations(MaxCP: number) {

        let pokemon_repo = new PokemonRepository();
        let move_repo = new MoveRepository();

        let pokemons =  pokemon_repo.LoadAllPokemon().slice(0, 150);
        
        let sim_results : Array<SimulationResult>= new Array;
        
        console.log(`Simulating matchups between: ${ pokemons.length } Pokemon.`);
        
        console.time("pvp-sims-all-vs-all");
        let sim = new Simulator();
        
        let shields = [[0,0], [0, 1], [1, 0], [1, 1], [2, 2]];

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