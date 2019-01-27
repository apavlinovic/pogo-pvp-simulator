import * as fs from 'fs';
import { upperFirst } from 'lodash'
import { Pokemon } from '../Models/Pokemon';
import { Type } from '../Shared/Types';
import { startCase } from 'lodash';

export class PokemonRepository {
    dataContext: Array<any>;

    constructor() {
        this.dataContext = JSON.parse(fs.readFileSync('./src/Data/GameMaster.js', 'utf8'));
    }

    LoadAllPokemon() {
        let _pokemons : Array<any> = this.FindAllPokemon();
        
        return _pokemons.map((pokemon) => {
            return this.CreatePokemonModelFromDataContextPokemon(pokemon);
        });
    }

    LoadPokemon(name: string, form: string | null = null) {
        let _pokemon : any = this.FindPokemon(name, form);
        
        return this.CreatePokemonModelFromDataContextPokemon(_pokemon);
    }

    private CreatePokemonModelFromDataContextPokemon(_pokemon: any) {
        let type = this.ExtractTypeIdentifier(_pokemon.pokemon_settings.type);
        let type2 = _pokemon.pokemon_settings.type_2 ? this.ExtractTypeIdentifier(_pokemon.pokemon_settings.type_2) : null;

        let fastMoves = this.FormatAsHumanFriendlyStrings(_pokemon.pokemon_settings.quick_moves);
        let chargeMoves = this.FormatAsHumanFriendlyStrings(_pokemon.pokemon_settings.cinematic_moves);

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

    private FindAllPokemon() {
        return this.dataContext.filter(gm_entry => {
            return !!gm_entry.pokemon_settings;
        });
    };

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

    private FormatAsHumanFriendlyStrings(gm_string_array: Array<string>) {
        return gm_string_array.map(move => {
            return startCase(move.replace('_FAST', '').toLowerCase());
        })
    }

    ExtractTypeIdentifier(gm_type: string ) {
        return upperFirst((gm_type as string).replace('POKEMON_TYPE_', '').toLowerCase()) as keyof typeof Type
    }
}