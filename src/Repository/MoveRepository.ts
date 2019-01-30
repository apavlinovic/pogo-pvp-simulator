import * as fs from 'fs';
import { upperFirst } from 'lodash'
import { Type } from '../Shared/Types';
import { Move } from '../Models/Move';


export class MoveRepository {
    dataContext: any;

    constructor() {
        this.dataContext = { };

        let pvp_id =  `COMBAT_`;
        let pvp_move_key =  `_MOVE_`;
        let moves : Array<any> = JSON.parse(fs.readFileSync('./src/Data/GameMaster.js', 'utf8'));

        moves = moves.filter(item => {
            return (item.template_id as string).startsWith(pvp_id) 
                && (item.template_id as string).indexOf(pvp_move_key) !- -1 
        });

        moves.forEach((gm_move: any) => {
            var type = this.ExtractTypeIdentifier(gm_move.combat_move.type);

            this.dataContext[gm_move.combat_move.unique_id] =  new Move(
                gm_move.template_id,
                gm_move.combat_move.power || 0,
                gm_move.combat_move.energy_delta,
                gm_move.combat_move.duration_turns || null,
                Type[type]
            );
        })
    }

    LoadMove(name: string) {

        return this.FindPVPMove(name);
    }

    private FindPVPMove(name: string) {
        let move_id =  `${ name.toUpperCase().replace(' ', '_')}`;
        let move_id_fast =  `${ name.toUpperCase().replace(' ', '_')}_FAST`;
        
        return this.dataContext[move_id_fast] || this.dataContext[move_id];
    }

    ExtractTypeIdentifier(gm_type: string ) {
        return upperFirst((gm_type as string).replace('POKEMON_TYPE_', '').toLowerCase()) as keyof typeof Type
    }
}