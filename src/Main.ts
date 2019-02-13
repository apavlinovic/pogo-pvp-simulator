import _ = require("lodash");
import * as sqlite3 from 'sqlite3'
import { SimRunner } from "./SimRunner/SimRunner";
import Constants from "./Shared/Constants";
import { SQLGenerator } from "./Data/SQLGenerator";
import { PokemonRepository } from "./Repository/PokemonRepository";
import { SimulationResult } from "./Simulator/SimulationResult";
import { SimulationResultRepository } from "./Repository/SimulationResultRepository";
import { Type } from "./Shared/Types";
import { Simulator } from "./Simulator/Simulator";
import { Battler } from "./Models/Battler";
import { MoveRepository } from "./Repository/MoveRepository";
import { Printer } from "./Utility/Printer";
import { Pokemon } from "./Models/Pokemon";
import { Rankings, IAveragedRankingResultMap } from "./Rankings/Rankings";


var repo = new PokemonRepository();
var move_repo = new MoveRepository();

var azumarill : Pokemon = repo.LoadPokemon("V0184_POKEMON_AZUMARILL");
var raichu : Pokemon = repo.LoadPokemon("V0026_POKEMON_RAICHU_NORMAL");

azumarill.ScaleToCombatPower(Constants.GREAT_LEAGUE_MAX_CP);
raichu.ScaleToCombatPower(Constants.GREAT_LEAGUE_MAX_CP);

console.log(raichu)

var sim = new Simulator();

sim.SetBattlers(new Battler(
    azumarill,
    move_repo.LoadMove("BUBBLE_FAST"),
    move_repo.LoadMove("HYDRO_PUMP"),
    null,
    2,
    true
),
new Battler(
    raichu,
    move_repo.LoadMove("VOLT_SWITCH_FAST"),
    move_repo.LoadMove("WILD_CHARGE"),
    null,
    2,
    true
));


var output = sim.Simulate();


var printer = new Printer()

console.log(output.Winner.Pokemon.ID, output.Winner.Health)
printer.PrintBattleTimeline(output)




/*


console.log(results.length);
let db = new sqlite3.Database(Constants.SQLITE_DB, sqlite3.OPEN_READWRITE, (err) => {
    
    if (err) {
      return console.error(err.message);
    }

    console.log('Connected to the SQlite database.'); 
});

let sql = new SQLGenerator();

let step = 0;
let step_size = 200000;

while(step * step_size < results.length) {
    
    db.exec(sql.GenerateSimulationResultInsertCommand(
        results.slice(step * step_size, step * step_size + step_size)
    ))

    console.log(`Processed ${ step * step_size } - ${ step * step_size + step_size }`)
    step++;

}


db.close((err) => {

    if (err) {
        return console.error(err.message);
    }

    console.log('Close the database connection.');
});
*/

/*

let runner = new SimRunner();
let ranker = new Rankings();

let results_0_0_shields = ranker.CalculateRanking(runner.RunAllVsAllSimulations(Constants.GREAT_LEAGUE_MAX_CP, [[0, 0]], [Type.Poison, Type.Fairy, Type.Ghost, Type.Dark]));
let results_0_1_shields = ranker.CalculateRanking(runner.RunAllVsAllSimulations(Constants.GREAT_LEAGUE_MAX_CP, [[0, 1]], [Type.Poison, Type.Fairy, Type.Ghost, Type.Dark]));
let results_1_0_shields = ranker.CalculateRanking(runner.RunAllVsAllSimulations(Constants.GREAT_LEAGUE_MAX_CP, [[1, 0]], [Type.Poison, Type.Fairy, Type.Ghost, Type.Dark]));
let results_1_1_shields = ranker.CalculateRanking(runner.RunAllVsAllSimulations(Constants.GREAT_LEAGUE_MAX_CP, [[1, 1]], [Type.Poison, Type.Fairy, Type.Ghost, Type.Dark]));
let results_2_2_shields = ranker.CalculateRanking(runner.RunAllVsAllSimulations(Constants.GREAT_LEAGUE_MAX_CP, [[2, 2]], [Type.Poison, Type.Fairy, Type.Ghost, Type.Dark]));

let averagedRatings : IAveragedRankingResultMap = {};

for (const pokemonID in results_0_0_shields) {
    if (results_0_0_shields.hasOwnProperty(pokemonID)) {
        
        averagedRatings[pokemonID] = {
            rankings: [],
            overall: 0
        };

        const rating_0_0 = results_0_0_shields[pokemonID];
        const rating_0_1 = results_0_1_shields[pokemonID];
        const rating_1_0 = results_1_0_shields[pokemonID];
        const rating_1_1 = results_1_1_shields[pokemonID];
        const rating_2_2 = results_2_2_shields[pokemonID];
        
        averagedRatings[pokemonID].rankings = [ rating_0_0, rating_0_1, rating_1_0, rating_1_1, rating_2_2];
        averagedRatings[pokemonID].overall = (rating_0_0.Elo + rating_0_1.Elo + rating_1_0.Elo + rating_1_1.Elo + rating_2_2.Elo) / 5;
    }
}

let output = new Array;

for (const pokemonID in averagedRatings) {
    if (averagedRatings.hasOwnProperty(pokemonID)) {
        output.push([pokemonID, averagedRatings[pokemonID].overall])
    }
}

_(output).orderBy(o => {
    return o[1]
}, 'desc').each(o => {
    console.log(o[0], '\t', o[1]);
})*/