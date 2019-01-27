import { Battler } from "./Battler";
import { PokemonRepository } from "../Repository/PokemonRepository";
import { MoveRepository } from "../Repository/MoveRepository";
import Constants from "../Shared/Constants";

let pokemon_repo = new PokemonRepository()
let move_repo = new MoveRepository();


test('Battler initializes and resets properly', () => {

    let venusaur = pokemon_repo.LoadPokemon("Venusaur", null);
    let vine_whip = move_repo.LoadMove("Vine Whip");
    let frenzy_plant = move_repo.LoadMove("Frenzy Plant");
    
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

    let venusaur = pokemon_repo.LoadPokemon("Venusaur", null);
    let vine_whip = move_repo.LoadMove("Vine Whip");
    let frenzy_plant = move_repo.LoadMove("Frenzy Plant");
    
    let venu_battler = new Battler(venusaur, vine_whip, frenzy_plant);

    // Doesn't overflow on 100 Energy and Fast move usage
    venu_battler.Energy = 100;
    venu_battler.DeclareAttack(vine_whip);
    expect(venu_battler.Energy).toBe(100);

    venu_battler.Reset();

    // Energy spending works

    venu_battler.Energy = 100;
    venu_battler.DeclareAttack(frenzy_plant);
    expect(venu_battler.Energy).toBe(100 + frenzy_plant.Energy);

    venu_battler.Reset();

    // Charge usage doesn't force energy to go below 0

    venu_battler.DeclareAttack(frenzy_plant);
    expect(venu_battler.Energy).toBe(0);
});

test('Battler deals damage properly', () => {

    let venusaur = pokemon_repo.LoadPokemon("Venusaur", null);
    let vine_whip = move_repo.LoadMove("Vine Whip");
    let frenzy_plant = move_repo.LoadMove("Frenzy Plant");
    
    let venu_battler = new Battler(venusaur, vine_whip, frenzy_plant);
    let start_health = venu_battler.Health;

    venu_battler.DeclareAttack(vine_whip);
    var damage_done = venu_battler.ExecuteAttack(venu_battler);
    expect(venu_battler.Health).toBe(start_health - damage_done);
});


test('Battler loses HP and faints properly', () => {

    let venusaur = pokemon_repo.LoadPokemon("Venusaur", null);
    venusaur.ApplyLVL(1);
    let frenzy_plant = move_repo.LoadMove("Frenzy Plant");
    
    let charizard = pokemon_repo.LoadPokemon("Charizard", null);
    let flamethrower = move_repo.LoadMove("Flamethrower");

    let venu_battler = new Battler(venusaur, frenzy_plant, frenzy_plant);
    let charizard_battler = new Battler(charizard, flamethrower, flamethrower);

    charizard_battler.Energy = 100;
    charizard_battler.DeclareAttack(charizard_battler.ChargeMove);
    charizard_battler.ExecuteAttack(venu_battler);

    expect(venu_battler.IsAlive()).toBe(false);
});

