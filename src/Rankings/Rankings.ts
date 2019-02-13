import { SimulationResult } from "../Simulator/SimulationResult";
import _ = require("lodash");
import * as Elo from "arpad";
import { Battler } from "../Models/Battler";

export class Rankings {
    CalculateRanking(simResults: Array<SimulationResult>) {

        const output: IRankingResultMap = {}
        const elo_engine = new Elo();

        _(simResults).forEach((simResult: SimulationResult) => {

            output[this.GeneratePokemonWithMovesetIdentifier(simResult.Winner)] = output[this.GeneratePokemonWithMovesetIdentifier(simResult.Winner)] || new RankingResult();
            output[this.GeneratePokemonWithMovesetIdentifier(simResult.Looser)] = output[this.GeneratePokemonWithMovesetIdentifier(simResult.Looser)] || new RankingResult();

            output[this.GeneratePokemonWithMovesetIdentifier(simResult.Winner)].TrackWin();
            output[this.GeneratePokemonWithMovesetIdentifier(simResult.Looser)].TrackLoss();

            let winner_elo = output[this.GeneratePokemonWithMovesetIdentifier(simResult.Winner)].Elo;
            let looser_elo = output[this.GeneratePokemonWithMovesetIdentifier(simResult.Looser)].Elo;

            let winner_odds = elo_engine.expectedScore(winner_elo, looser_elo);
            let looser_odds = elo_engine.expectedScore(looser_elo, winner_elo);

            output[this.GeneratePokemonWithMovesetIdentifier(simResult.Winner)].Elo = elo_engine.newRating(winner_odds, 1.0, winner_elo);
            output[this.GeneratePokemonWithMovesetIdentifier(simResult.Looser)].Elo = elo_engine.newRating(looser_odds, 0.0, looser_elo);
        });

        return output;
    }

    private GeneratePokemonWithMovesetIdentifier(battler: Battler) {
        return `${battler.Pokemon.ID}-${battler.FastMove.ID}-${battler.ChargeMove.ID}`
    }
}

export interface IRankingResultMap {
    [pokemonID: string] : RankingResult;
} 

export interface IAveragedRankingResultMap {
    [pokemonID: string] : {
        elo: number,
        wins: number,
        losses: number
    };
} 

export class RankingResult {

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