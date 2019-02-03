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
let pokemons = (new PokemonRepository()).LoadAllPokemon()

_(pokemons).each(poke => {
    output[poke.ID] = {
        id: poke.ID,
        wins: 0,
        win_moves: [],
        losses: 0,
        total_score: 0
    };
})


_(results)
.groupBy((sim: SimulationResult) => {
    return `${sim.Winner.Pokemon.ID}`
})
.each((result_by_pokemon: Array<SimulationResult>, pokemon_id: string) => {

     _(result_by_pokemon).groupBy((sim: SimulationResult) => {
        return `${sim.Winner.FastMove.ID}/${sim.Winner.ChargeMove.ID}`
    }).each((result_by_moveset: Array<SimulationResult>, move_set: string) => {
        output[pokemon_id].win_moves.push([move_set, result_by_moveset.length / result_by_pokemon.length]);

        output[pokemon_id].win_moves = _(output[pokemon_id].win_moves).orderBy(wm => wm[1], 'desc').value();
    })

    output[pokemon_id].wins = result_by_pokemon.length;
})

_(results)
.groupBy((sim: SimulationResult) => {
    return `${sim.Looser.Pokemon.ID}`
})
.each((result: Array<SimulationResult>, key: string) => {

    output[key].losses = result.length;
})

_(output)
.values()
.filter(row => {
    return row.wins > 0 /*&& row.wins > row.losses */;
})
.orderBy(row => { return row.wins / row.losses }, 'desc').each(row => {
    console.log(row.id, row.wins / row.losses)
    console.log(row.win_moves[0])
})
