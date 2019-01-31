import * as sqlite3 from 'sqlite3'
import Constants from '../Shared/Constants';
import { SimulationResult } from '../Simulator/SimulationResult';



export class SimulationResultRepository {

    LoadAllSimulationResults() {
        let db = new sqlite3.Database(Constants.SQLITE_DB, sqlite3.OPEN_READWRITE, (err) => {
    
            if (err) {
              return console.error(err.message);
            }
        
            console.log('Connected to the SQlite database.'); 
        });

        db.all(`SELECT * FROM ${ Constants.SQLITE_TABLE_NAME }`, (err, results) => {
            console.log()
        });
    }
}