import { Battler } from "./Battler";
import { PokemonRepository } from "../Repository/PokemonRepository";
import { MoveRepository } from "../Repository/MoveRepository";
import Constants from "../Shared/Constants";

let pokemon_repo = new PokemonRepository()
let move_repo = new MoveRepository();

test('Battler initializes and resets properly', () => {

    let venusaur = pokemon_repo.LoadPokemon("V0003_POKEMON_VENUSAUR");
    let vine_whip = move_repo.LoadMove("COMBAT_V0214_MOVE_VINE_WHIP_FAST");
    let frenzy_plant = move_repo.LoadMove("COMBAT_V0296_MOVE_FRENZY_PLANT");
    
    let venu_battler = new Battler(venusaur, vine_whip, frenzy_plant);

    expect(venu_battler.Shields).toBe(Constants.SHIELD_COUNT);
    expect(venu_battler.Energy).toBe(0);
    expect(venu_battler.CanAct()).toBe(true);

    venu_battler.Energy = 100;
    venu_battler.Shields = 100;
    venu_battler.Reset();
    expect(venu_battler.Shields).toBe(Constants.SHIELD_COUNT);
    expect(venu_battler.CanAct()).toBe(true);
    expect(venu_battler.Energy).toBe(0);
});


test('Battler energy generation and usage works and doesnt break limits', () => {

    let venusaur = pokemon_repo.LoadPokemon("V0003_POKEMON_VENUSAUR");
    let vine_whip = move_repo.LoadMove("COMBAT_V0214_MOVE_VINE_WHIP_FAST");
    let frenzy_plant = move_repo.LoadMove("COMBAT_V0296_MOVE_FRENZY_PLANT");
    
    let venu_battler = new Battler(venusaur, vine_whip, frenzy_plant);

    venu_battler.Energy = 100;
    venu_battler.DeclareAttack(vine_whip);
    expect(venu_battler.Energy).toBe(100 + vine_whip.Energy);

    venu_battler.Reset();

    // Energy spending works

    venu_battler.Energy = 100;
    venu_battler.DeclareAttack(frenzy_plant);
    expect(venu_battler.Energy).toBe(100 + frenzy_plant.Energy);

    venu_battler.Reset();

    venu_battler.DeclareAttack(frenzy_plant);
    expect(venu_battler.Energy).toBe(0 + frenzy_plant.Energy);
});

test('Battler deals damage properly', () => {

    let venusaur = pokemon_repo.LoadPokemon("V0003_POKEMON_VENUSAUR");
    let vine_whip = move_repo.LoadMove("COMBAT_V0214_MOVE_VINE_WHIP_FAST");
    let frenzy_plant = move_repo.LoadMove("COMBAT_V0296_MOVE_FRENZY_PLANT");
    
    let venu_battler = new Battler(venusaur, vine_whip, frenzy_plant);
    let start_health = venu_battler.Health;

    venu_battler.DeclareAttack(vine_whip);
    var damage_done = venu_battler.ExecuteAttack(venu_battler);
    expect(venu_battler.Health).toBe(start_health - damage_done);
});


test('Battler loses HP and faints properly', () => {

    let venusaur = pokemon_repo.LoadPokemon("V0003_POKEMON_VENUSAUR");
    venusaur.ApplyLVL(1);
    let frenzy_plant = move_repo.LoadMove("COMBAT_V0296_MOVE_FRENZY_PLANT");
    
    let charizard = pokemon_repo.LoadPokemon("V0006_POKEMON_CHARIZARD");
    let flamethrower = move_repo.LoadMove("COMBAT_V0024_MOVE_FLAMETHROWER");

    let venu_battler = new Battler(venusaur, frenzy_plant, frenzy_plant);
    let charizard_battler = new Battler(charizard, flamethrower, flamethrower);

    charizard_battler.Energy = 100;
    charizard_battler.DeclareAttack(charizard_battler.ChargeMove);
    charizard_battler.ExecuteAttack(venu_battler);

    expect(venu_battler.IsAlive()).toBe(false);
});

