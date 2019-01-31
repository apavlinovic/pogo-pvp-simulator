import { SimulationResult } from "../Simulator/SimulationResult";
import Constants from "../Shared/Constants";

export class SQLGenerator {
    GenerateSimulationResultInsertCommand(sims: Array<SimulationResult>) {
        let sql = `INSERT INTO ${ Constants.SQLITE_TABLE_NAME } VALUES `;
        let inserts : Array<string> = [];

        sims.forEach(sim => {
            inserts.push(
            sql 
            
            +

            "(" 

            +

            [
                `"${ sim.Winner.Pokemon.ID }"`,
                `"${ sim.Winner.FastMove.ID }"`,
                `"${ sim.Winner.ChargeMove.ID }"`,
                sim.Winner.ChargeMove2 ? `"${ sim.Winner.ChargeMove2.ID }"` : "null",
                `${ sim.WinnerRemainingHP() }`,
                `${ sim.WinnerDamageDealt() }`,

                `"${ sim.Looser.Pokemon.ID }"`,
                `"${ sim.Looser.FastMove.ID }"`,
                `"${ sim.Looser.ChargeMove.ID }"`,
                sim.Looser.ChargeMove2 ? `"${ sim.Looser.ChargeMove2.ID }"` : "null",
                `${ sim.LooserRemainingHP() }`,
                `${ sim.LooserDamageDealt() }`,

                `${ sim.CombatTime() }`,
                `${ sim.Overkill() }`,
            ].join(",")

            + 

            ");"

            );
        });

        return "BEGIN TRANSACTION; " + inserts.join("") + " COMMIT;";
    }
}