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

            this.dataContext[gm_move.template_id] = this.dataContext[gm_move.combat_move.unique_id] =  new Move(
                gm_move.template_id,
                gm_move.combat_move.power || 0,
                gm_move.combat_move.energy_delta,
                gm_move.combat_move.duration_turns || null,
                Type[type]
            );
        })
    }


    LoadMove(game_master_id: string) {

        return this.dataContext[game_master_id];
    }

    ExtractTypeIdentifier(gm_type: string ) {
        return upperFirst((gm_type as string).replace('POKEMON_TYPE_', '').toLowerCase()) as keyof typeof Type
    }
}