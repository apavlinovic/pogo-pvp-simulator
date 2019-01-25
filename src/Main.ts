import { Pokemon } from "./Models/Pokemon";
import { Move } from "./Models/Move";
import { Type } from "./Shared/Types";
import { MoveRepository } from "./Repository/MoveRepository";
import { PokemonRepository } from "./Repository/PokemonRepository";

var pokemon_repo = new PokemonRepository()
var move_repo = new MoveRepository();

var venusaur = pokemon_repo.LoadPokemon("Venusaur", null, 40);
var solar_beam = move_repo.LoadMove("Solar Beam");
var vine_whip = move_repo.LoadMove("Vine Whip");

venusaur.FastMove = vine_whip;
venusaur.ChargeMove = solar_beam;