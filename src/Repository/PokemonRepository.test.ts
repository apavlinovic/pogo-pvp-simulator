import { PokemonRepository } from "./PokemonRepository";
import { Type } from "../Shared/Types";

test('PokemonRepository:LoadAll', () => {
    let repo = new PokemonRepository();

    var pokemons = repo.LoadAllPokemon();

    expect(pokemons).not.toBeNull();
    expect(pokemons).not.toBeUndefined();

    expect(pokemons[2]).toMatchObject(repo.LoadPokemon("V0009_POKEMON_BLASTOISE"));
    expect(pokemons[pokemons.length - 1]).toMatchObject(repo.LoadPokemon("V0809_POKEMON_MELMETAL"));
})

test('PokemonRepository:PokemonCreate', () => {
    let repo = new PokemonRepository();

    expect(repo.ExtractTypeIdentifier("POKEMON_TYPE_ELECTRIC")).toBe("Electric");
    expect(repo.ExtractTypeIdentifier("POKEMON_TYPE_DRAGON")).toBe("Dragon");

    let raichu = repo.LoadPokemon("V0026_POKEMON_RAICHU_NORMAL")
    expect(raichu.CP).toBe(2182);
    expect(raichu.Type1).toBe(Type.Electric);

    let alola_raichu = repo.LoadPokemon("V0026_POKEMON_RAICHU_ALOLA");


    expect(alola_raichu.CP).toBe(2286);
    expect(alola_raichu.Type1).toBe(Type.Electric);
    expect(alola_raichu.Type2).toBe(Type.Psychic);

    let arceus = repo.LoadPokemon("V0493_POKEMON_ARCEUS")
    expect(arceus.CP).toBe(3989);
    expect(arceus.Type1).toBe(Type.Normal);

    let arceus_dark = repo.LoadPokemon("V0493_POKEMON_ARCEUS_DARK")
    expect(arceus_dark).toBeUndefined();
});

test('PokemonRepository:TypeFilter', () => {
    let repo = new PokemonRepository([ Type.Dragon ]);

    let allDragons = repo.LoadAllPokemon();

    expect(allDragons.length).toBeGreaterThan(0);
   
});