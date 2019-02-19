import _ = require("lodash");
import * as sqlite3 from 'sqlite3'
import { SimRunner } from "./SimRunner/SimRunner";
import Constants from "./Shared/Constants";
import { PokemonRepository } from "./Repository/PokemonRepository";
import { SimulationResult } from "./Simulator/SimulationResult";
import { SimulationResultRepository } from "./Repository/SimulationResultRepository";
import { Type } from "./Shared/Types";
import { Simulator } from "./Simulator/Simulator";
import { Battler } from "./Models/Battler";
import { MoveRepository } from "./Repository/MoveRepository";
import { Printer } from "./Utility/Printer";
import { Pokemon } from "./Models/Pokemon";
import { Rankings, IAveragedRankingResultMap, RankingResult } from "./Rankings/Rankings";


var repo = new PokemonRepository();
var move_repo = new MoveRepository();
/*
// var opponent : Pokemon = repo.LoadPokemon("V0184_POKEMON_AZUMARILL");
// var opponent : Pokemon = repo.LoadPokemon("V0131_POKEMON_LAPRAS");
var opponent : Pokemon = repo.LoadPokemon("V0277_POKEMON_SWELLOW");
// var me : Pokemon = repo.LoadPokemon("V0026_POKEMON_RAICHU_NORMAL");
var me : Pokemon = repo.LoadPokemon("V0260_POKEMON_SWAMPERT");

opponent.ScaleToCombatPower(Constants.GREAT_LEAGUE_MAX_CP);
me.ScaleToCombatPower(Constants.GREAT_LEAGUE_MAX_CP);


var sim = new Simulator();

sim.SetBattlers(new Battler(
    opponent,
    move_repo.LoadMove("WING_ATTACK_FAST"),
    move_repo.LoadMove("BRAVE_BIRD"),
    null,
    2,
    true
),
new Battler(
    me,
    move_repo.LoadMove("WATER_GUN_FAST"),
    move_repo.LoadMove("SLUDGE_WAVE"),
    null,
    2,
    true
));


var output = sim.Simulate();


var printer = new Printer()

console.log(output.Winner.Pokemon.ID, output.Winner.Health)
printer.PrintBattleTimeline(output)


*/



let runner = new SimRunner();
let ranker = new Rankings();
let averagedRatings : IAveragedRankingResultMap = {};

let tempest_league = [Type.Electric, Type.Ice, Type.Flying, Type.Ground];
let twilight_league = [Type.Poison, Type.Fairy, Type.Ghost, Type.Dark];

for(let aShield = 0; aShield <= 1; aShield++) {
    for(let bShield = 0; bShield <= 1; bShield++) {

        let result = ranker.CalculateRanking(
            runner.RunAllVsAllSimulations(
                Constants.GREAT_LEAGUE_MAX_CP, [[aShield, bShield]],
                twilight_league)
            );

        for (const pokemonID in result) {
            if (result.hasOwnProperty(pokemonID)) {
                averagedRatings[pokemonID] = averagedRatings[pokemonID] || {
                    elo: 0,
                    wins: 0,
                    losses: 0,
                };  
            }

            averagedRatings[pokemonID].elo += result[pokemonID].Elo;
            averagedRatings[pokemonID].wins += result[pokemonID].Wins;
            averagedRatings[pokemonID].losses += result[pokemonID].Loss;
        }
    }
}

let output : any = {};

for (const pokemonMovesetID in averagedRatings) {
    if (averagedRatings.hasOwnProperty(pokemonMovesetID)) {
        let [ pokemon, fastMove, chargeMove ] = pokemonMovesetID.split('-');

        output[pokemon] = output[pokemon] || {};
        output[pokemon][fastMove] = output[pokemon][fastMove] || {};

        output[pokemon][fastMove][chargeMove] = { 
            elo: averagedRatings[pokemonMovesetID].elo / 8, 
            wins: averagedRatings[pokemonMovesetID].wins / 8, 
            losses: averagedRatings[pokemonMovesetID].losses / 8 
        }
    }
}

let printable_output = new Array;

for (const pokemon in output) {
    let total_elo = 0;
    let total_wins = 0;
    let total_losses = 0;
    let total_moves = 0;

    for (const fast_move in output[pokemon]) {
        for (const charge_move in output[pokemon][fast_move]) {
            total_moves++;

            total_wins += output[pokemon][fast_move][charge_move].wins;
            total_losses += output[pokemon][fast_move][charge_move].losses;
            total_elo += output[pokemon][fast_move][charge_move].elo;
        }
    }

    output[pokemon].total_elo = total_elo;
    output[pokemon].total_wins = total_wins;
    output[pokemon].total_losses = total_losses;
    output[pokemon].total_moves = total_moves;

    output[pokemon].name = pokemon;

    printable_output.push(output[pokemon]);
}

_(printable_output).orderBy(o => {
    return o.total_elo;
}, 'desc').each((o, i) => {
    console.log(i, o.name);
})
