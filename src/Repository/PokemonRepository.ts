import * as fs from 'fs';
import { upperFirst } from 'lodash'
import { Pokemon } from '../Models/Pokemon';
import { Type } from '../Shared/Types';


export class PokemonRepository {
    dataContext: Array<any>;

    constructor() {
        this.dataContext = JSON.parse(fs.readFileSync('./src/Data/GameMaster.js', 'utf8'));
    }

    LoadPokemon(name: string, form: string | null = null, level: number) {
        let _pokemon : any = this.FindPokemon(name, form);
        let type = this.ExtractTypeIdentifier(_pokemon.pokemon_settings.type);
        let type2 = _pokemon.pokemon_settings.type_2 ? this.ExtractTypeIdentifier(_pokemon.pokemon_settings.type_2) : null;

        return new Pokemon(
            _pokemon.pokemon_settings.stats.base_stamina,
            _pokemon.pokemon_settings.stats.base_attack,
            _pokemon.pokemon_settings.stats.base_defense,
            Type[type],
            type2 ? Type[type2] : null,
            level
        )
    }

    private FindPokemon(name: string, form?: string | null) {
        let template_id =  `V0`;
        let pokemon_id = name.toUpperCase().replace(/[\W_]+/g,"_");

        if(form) {
            pokemon_id += `_${ form.toUpperCase() }`;
        }

        let potential_results = this.dataContext.filter(item => {
            return (item.template_id as string).startsWith(template_id)
                && (item.template_id as string).indexOf(`_POKEMON_`) != -1
                && (item.template_id as string).endsWith(`_POKEMON_${ pokemon_id}`)
                && item.pokemon_settings != null;
        });


        return potential_results[0];
    }

    ExtractTypeIdentifier(gm_type: string ) {
        return upperFirst((gm_type as string).replace('POKEMON_TYPE_', '').toLowerCase()) as keyof typeof Type
    }
}