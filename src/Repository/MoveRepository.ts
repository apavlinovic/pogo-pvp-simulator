import * as fs from 'fs';
import { upperFirst } from 'lodash'
import { Type } from '../Shared/Types';
import { Move } from '../Models/Move';


export class MoveRepository {
    dataContext: Array<any>;

    constructor() {
        this.dataContext = JSON.parse(fs.readFileSync('./src/Data/GameMaster.js', 'utf8'));
    }

    LoadMove(name: string) {
        var gm_move = this.FindPVPMove(name);
        var type = this.ExtractTypeIdentifier(gm_move.combat_move.type);

        return new Move(
            gm_move.combat_move.power,
            gm_move.combat_move.energy_delta,
            gm_move.combat_move.duration_turns || null,
            Type[type]
        )
    }

    private FindPVPMove(name: string) {
        let pvp_id =  `COMBAT_`;
        let pvp_move_key =  `_MOVE_`;
        let move_id =  `${ name.toUpperCase().replace(' ', '_')}`;
        let move_id_fast =  `${ name.toUpperCase().replace(' ', '_')}_FAST`;

        let potential_results = this.dataContext.filter(item => {
            return (item.template_id as string).startsWith(pvp_id) 
                && (item.template_id as string).indexOf(pvp_move_key) !- -1 
                && (
                    (item.combat_move.unique_id as string) === move_id ||
                    (item.combat_move.unique_id as string) === move_id_fast
                );
        });

        return potential_results[0];
    }

    ExtractTypeIdentifier(gm_type: string ) {
        return upperFirst((gm_type as string).replace('POKEMON_TYPE_', '').toLowerCase()) as keyof typeof Type
    }
}