import _ = require("lodash");
import * as sqlite3 from 'sqlite3'
import { SimRunner } from "./SimRunner/SimRunner";
import Constants from "./Shared/Constants";
import { SQLGenerator } from "./Data/SQLGenerator";

let runner = new SimRunner();
let results = runner.RunAllVsAllSimulations(Constants.GREAT_LEAGUE_MAX_CP);

console.log(results.length);

let db = new sqlite3.Database("result-db.db", sqlite3.OPEN_READWRITE, (err) => {
    
    if (err) {
      return console.error(err.message);
    }

    console.log('Connected to the SQlite database.'); 
});

let sql = new SQLGenerator();

db.exec(sql.GenerateSimulationResultInsertCommand(results))

db.close((err) => {

    if (err) {
        return console.error(err.message);
    }

    console.log('Close the database connection.');
});

/*
let output : any = { };

_(pokemons).each(poke => {
    output[poke.ID] = {
        id: poke.ID,
        wins: 0,
        losses: 0,
        win_score: 0,
        loss_Score: 0
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

    output[key].loss_Score = score / result.length;
    output[key].total_score = output[key].wins / output[key].losses * output[key].win_score / output[key].losse_score; 
})

_(output).values().orderBy(row => { return row.total_score }).each(row => {
    console.log(row)
})
*/


