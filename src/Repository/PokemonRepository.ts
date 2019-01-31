import * as fs from 'fs';
import { upperFirst } from 'lodash'
import { Pokemon } from '../Models/Pokemon';
import { Type } from '../Shared/Types';
import { startCase } from 'lodash';

export class PokemonRepository {
    dataContext: any;
    bannedPokemon = [  'V0292_POKEMON_SHEDINJA', 'V0132_POKEMON_DITTO' ];

    constructor() {
        this.dataContext = {};

        let pokemon = JSON.parse(fs.readFileSync('./src/Data/GameMaster.js', 'utf8'));

        pokemon = pokemon.filter((item: any) => {
            return (item.template_id as string).startsWith("V0")
                && (item.template_id as string).indexOf(`_POKEMON_`) != -1
                && item.pokemon_settings != null
                && !item.pokemon_settings.evolution_ids;
        });        

        pokemon.forEach((gm_pokemon : any) => {
            this.dataContext[gm_pokemon.template_id] = this.CreatePokemonModelFromDataContextPokemon(gm_pokemon);
        });
    }

    LoadAllPokemon() {
        
        return Object.values(this.dataContext) as Array<Pokemon>;
    }

    LoadPokemon(game_master_id: any) {
        
        return this.dataContext[game_master_id]
    }

    private CreatePokemonModelFromDataContextPokemon(_pokemon: any) {
        let type = this.ExtractTypeIdentifier(_pokemon.pokemon_settings.type);
        let type2 = _pokemon.pokemon_settings.type_2 ? this.ExtractTypeIdentifier(_pokemon.pokemon_settings.type_2) : null;

        let fastMoves = _pokemon.pokemon_settings.quick_moves;
        let chargeMoves = _pokemon.pokemon_settings.cinematic_moves;

        return new Pokemon(
            _pokemon.template_id,
            
            _pokemon.pokemon_settings.stats.base_stamina,
            _pokemon.pokemon_settings.stats.base_attack,
            _pokemon.pokemon_settings.stats.base_defense,

            Type[type],
            type2 ? Type[type2] : null,
            40,
            
            fastMoves,            
            chargeMoves,

            15,
            15,
            15
        )
    }

    ExtractTypeIdentifier(gm_type: string ) {
        return upperFirst((gm_type as string).replace('POKEMON_TYPE_', '').toLowerCase()) as keyof typeof Type
    }
}