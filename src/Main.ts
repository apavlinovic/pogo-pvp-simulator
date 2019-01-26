import { MoveRepository } from "./Repository/MoveRepository";
import { PokemonRepository } from "./Repository/PokemonRepository";
import { Simulator } from "./Simulator/Simulator";
import { Battler } from "./Models/Battler";
import { TimelineEventType } from "./Simulator/Timeline";

var pokemon_repo = new PokemonRepository()
var move_repo = new MoveRepository();

var venusaur = pokemon_repo.LoadPokemon("Venusaur", null, 40);
var vine_whip = move_repo.LoadMove("Vine Whip");
var frenzy_plant = move_repo.LoadMove("Frenzy Plant");

var kyogre = pokemon_repo.LoadPokemon("Kyogre", null, 40);
var waterfall = move_repo.LoadMove("Waterfall");
var hydro_pump = move_repo.LoadMove("Hydro Pump");

var simulation = new Simulator(
        new Battler(venusaur, vine_whip, frenzy_plant), 
        new Battler(kyogre, waterfall, hydro_pump)
    );

simulation.Simulate();

let timeline = simulation.Battler1.Timeline.ZipWithAnotherTimeline(simulation.Battler2.Timeline);

let poke1 = Array();
let poke2 = Array();
let turns = Array();

timeline.forEach(ev => {


    turns.push(ev[0].toString().padStart(2, '0'));
    
    if(ev[1]) {
        if(ev[1].Type == TimelineEventType.FastMove)
            poke1.push('FF')
        else if (ev[1].Type == TimelineEventType.ChargeMove)
            poke1.push('CC')
        else if (ev[1].Type == TimelineEventType.Shield)
            poke1.push('SS')
    } else {
        poke1.push('--')
    }

    if(ev[2]) {
        if(ev[2].Type == TimelineEventType.FastMove)
            poke2.push('FF')
        else if (ev[2].Type == TimelineEventType.ChargeMove)
            poke2.push('CC')
        else if (ev[2].Type == TimelineEventType.Shield)
            poke2.push('SS')
    } else {
        poke2.push('--')
    }

});

console.log(poke1.join(' '));
console.log(poke2.join(' '));
console.log(turns.join(' '));
