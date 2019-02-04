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
import * as EloRank from "elo-rank";


// var repo = new PokemonRepository();
// var move_repo = new MoveRepository();

// var azumarill : Pokemon = repo.LoadPokemon("V0184_POKEMON_AZUMARILL");
// var raichu : Pokemon = repo.LoadPokemon("V0026_POKEMON_RAICHU_NORMAL");

// azumarill.ScaleToCombatPower(Constants.GREAT_LEAGUE_MAX_CP);
// raichu.ScaleToCombatPower(Constants.GREAT_LEAGUE_MAX_CP);

// var sim = new Simulator();

// sim.SetBattlers(new Battler(
//     azumarill,
//     move_repo.LoadMove("BUBBLE_FAST"),
//     move_repo.LoadMove("HYDRO_PUMP"),
//     null,
//     2,
//     true
// ),
// new Battler(
//     raichu,
//     move_repo.LoadMove("VOLT_SWITCH_FAST"),
//     move_repo.LoadMove("WILD_CHARGE"),
//     null,
//     2,
//     true
// ));


// var output = sim.Simulate();


// var printer = new Printer()

// console.log(output.Winner.Pokemon.ID, output.Winner.Health)
// printer.PrintBattleTimeline(output)


let runner = new SimRunner();
let results = runner.RunAllVsAllSimulations(Constants.GREAT_LEAGUE_MAX_CP, [Type.Poison, Type.Fairy, Type.Ghost, Type.Dark]);

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



let output : any = { };
let pokemons = (new PokemonRepository([Type.Poison, Type.Fairy, Type.Ghost, Type.Dark])).LoadAllPokemon()
let elo = new EloRank();


_(pokemons).each(poke => {
    output[poke.ID] = {
        id: poke.ID,
        elo: 1200
    };
})

_(results).forEach((simResult: SimulationResult) => {
    let currentEloWinner = output[simResult.Winner.Pokemon.ID].elo;
    let currentEloLooser = output[simResult.Looser.Pokemon.ID].elo;

    let expectedEloWinner = elo.getExpected(currentEloWinner, currentEloLooser);
    let expectedEloLooser = elo.getExpected(currentEloLooser, currentEloWinner);

    output[simResult.Winner.Pokemon.ID].elo = elo.updateRating(expectedEloWinner, 1, currentEloWinner);
    output[simResult.Looser.Pokemon.ID].elo = elo.updateRating(expectedEloLooser, 0, currentEloLooser);
});

_(output).orderBy('elo', 'desc').each(res => {
    console.log(res);
})