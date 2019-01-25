import { Pokemon } from "./Models/Pokemon";
import { Move } from "./Models/Move";
import { Type } from "./Shared/Types";
import { MoveRepository } from "./Repository/MoveRepository";
import { PokemonRepository } from "./Repository/PokemonRepository";
import { Simulator } from "./Simulator/Simulator";
import { Battler } from "./Models/Battler";

var pokemon_repo = new PokemonRepository()
var move_repo = new MoveRepository();

var venusaur = pokemon_repo.LoadPokemon("Venusaur", null, 10);
var vine_whip = move_repo.LoadMove("Vine Whip");
var frenzy_plant = move_repo.LoadMove("Frenzy Plant");

var kyogre = pokemon_repo.LoadPokemon("Kyogre", null, 40);
var waterfall = move_repo.LoadMove("Waterfall");
var hydro_pump = move_repo.LoadMove("Hydro Pump");

var x = new Simulator(
        new Battler(venusaur, vine_whip, frenzy_plant), 
        new Battler(kyogre, waterfall, hydro_pump)
    );

x.Simulate();

console.log(x.Battler1, x.Timeline_Battler1.Events[x.Timeline_Battler1.Events.length - 1], 
    x.Battler2, x.Timeline_Battler2.Events[x.Timeline_Battler2.Events.length - 1]);
