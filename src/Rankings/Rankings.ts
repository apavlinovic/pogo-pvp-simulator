import { SimulationResult } from "../Simulator/SimulationResult";
import _ = require("lodash");
import * as Elo from "arpad";

export class Rankings {
    CalculateRanking(simResults: Array<SimulationResult>) {

        const output: IRankingResultMap = {}
        const elo_engine = new Elo();

        _(simResults).forEach((simResult: SimulationResult) => {
            output[simResult.Winner.Pokemon.ID] = output[simResult.Winner.Pokemon.ID] || new RankingResult();
            output[simResult.Looser.Pokemon.ID] = output[simResult.Looser.Pokemon.ID] || new RankingResult();

            output[simResult.Winner.Pokemon.ID].TrackWin();
            output[simResult.Looser.Pokemon.ID].TrackLoss();

            let winner_elo = output[simResult.Winner.Pokemon.ID].Elo;
            let looser_elo = output[simResult.Looser.Pokemon.ID].Elo;

            let winner_odds = elo_engine.expectedScore(winner_elo, looser_elo);
            let looser_odds = elo_engine.expectedScore(looser_elo, winner_elo);

            output[simResult.Winner.Pokemon.ID].Elo = elo_engine.newRating(winner_odds, 1.0, winner_elo);
            output[simResult.Looser.Pokemon.ID].Elo = elo_engine.newRating(looser_odds, 0.0, looser_elo);
        });

        return output;
    }
}

export interface IRankingResultMap {
    [pokemonID: string] : RankingResult;
} 

export interface IAveragedRankingResultMap {
    [pokemonID: string] : {
        rankings: Array<RankingResult>,
        overall: number
    };
} 

class RankingResult {

    Elo: number;    
    Wins: number;
    Loss: number;

    constructor() {
        this.Wins = 0;
        this.Loss = 0;
        this.Elo = 1500;    
    }

    TrackWin() {
        this.Wins++;
    }

    TrackLoss() {
        this.Loss++;
    }
}