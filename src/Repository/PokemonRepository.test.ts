import { PokemonRepository } from "./PokemonRepository";
import { Type } from "../Shared/Types";

test('PokemonRepository:PokemonCreate', () => {
    let repo = new PokemonRepository();

    expect(repo.ExtractTypeIdentifier("POKEMON_TYPE_ELECTRIC")).toBe("Electric");
    expect(repo.ExtractTypeIdentifier("POKEMON_TYPE_DRAGON")).toBe("Dragon");

    let raichu = repo.LoadPokemon("Raichu", null, 40)
    expect(raichu.CP).toBe(2182);
    expect(raichu.Type1).toBe(Type.Electric);

    let alola_raichu = repo.LoadPokemon("Raichu", "Alola", 40)
    expect(alola_raichu.CP).toBe(2286);
    expect(alola_raichu.Type1).toBe(Type.Electric);
    expect(alola_raichu.Type2).toBe(Type.Psychic);

    let arceus = repo.LoadPokemon("Arceus", null, 40)
    expect(arceus.CP).toBe(3989);
    expect(arceus.Type1).toBe(Type.Normal);

    let arceus_dark = repo.LoadPokemon("Arceus", "Dark", 40)
    expect(arceus_dark.CP).toBe(3989);
    expect(arceus_dark.Type1).toBe(Type.Dark);    

    let mr_mime = repo.LoadPokemon("Mr.Mime", null, 40)
    expect(mr_mime.CP).toBe(2228);
    expect(mr_mime.Type1).toBe(Type.Psychic);
    expect(mr_mime.Type2).toBe(Type.Fairy);

    let ho_oh = repo.LoadPokemon("Ho-Oh", null, 40)
    expect(ho_oh.CP).toBe(3863);
    expect(ho_oh.Type1).toBe(Type.Fire);
    expect(ho_oh.Type2).toBe(Type.Flying);    
});