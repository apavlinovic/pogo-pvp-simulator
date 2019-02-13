import { PokemonRepository } from "../Repository/PokemonRepository";
import { MoveRepository } from "../Repository/MoveRepository";
import Formulas from "./Formulas";
import Constants from "./Constants";


let pokemon_repo = new PokemonRepository()
let move_repo = new MoveRepository();

test('DamageFormula:CPM', () => {
    expect(Formulas.GetCPMRatio(1, 1)).toBe(1);
    expect(Formulas.GetCPMRatio(15, 15)).toBe(1);
    expect(Formulas.GetCPMRatio(40, 15)).toBeGreaterThan(1);
    expect(Formulas.GetCPMRatio(15, 40)).toBeLessThan(1);
    expect(Formulas.GetCPMRatio(40, 40)).toBe(1);
})

test('DamageFormula:STABMultiplier', () => {
    let venusaur = pokemon_repo.LoadPokemon("V0003_POKEMON_VENUSAUR");
    let vine_whip = move_repo.LoadMove("COMBAT_V0214_MOVE_VINE_WHIP_FAST");
    let flamethrower = move_repo.LoadMove("COMBAT_V0024_MOVE_FLAMETHROWER");

    expect(Formulas.GetStabMultiplier(vine_whip, venusaur)).toBe(Constants.STAB_MULTI);
    expect(Formulas.GetStabMultiplier(flamethrower, venusaur)).toBe(1);
})

test('DamageFormula:StatRatio', () => {
    let venusaur = pokemon_repo.LoadPokemon("V0003_POKEMON_VENUSAUR");

    expect(Formulas.GetStatsRatio(venusaur, venusaur)).toBe((198 + 15) / (189 + 15));
})

test('DamageFormula:PVPMUltiplier', () => {
    let volt_switch = move_repo.LoadMove("VOLT_SWITCH_FAST");
    let meteor_mash = move_repo.LoadMove("METEOR_MASH");

    expect(Formulas.GetMovePVPBonusMultiplier(volt_switch)).toBe(Constants.FAST_ATTACK_BONUS_MULTIPLIER);
    expect(Formulas.GetMovePVPBonusMultiplier(meteor_mash)).toBe(Constants.CHARGE_ATTACK_BONUS_MULTIPLIER);
})

test('DamageFormula:TypeEfficiencyMultiplier', () => {
    let venusaur = pokemon_repo.LoadPokemon("V0003_POKEMON_VENUSAUR");
    let vine_whip = move_repo.LoadMove("COMBAT_V0214_MOVE_VINE_WHIP_FAST");
    let flamethrower = move_repo.LoadMove("COMBAT_V0024_MOVE_FLAMETHROWER");
    let volt_switch = move_repo.LoadMove("VOLT_SWITCH_FAST");
    let meteor_mash = move_repo.LoadMove("METEOR_MASH");

    expect(Formulas.GetMoveTypeEfficiencyAgainst(vine_whip, venusaur)).toBe(Constants.NE_MULTI * Constants.NE_MULTI);
    expect(Formulas.GetMoveTypeEfficiencyAgainst(volt_switch, venusaur)).toBe(Constants.NE_MULTI);
    expect(Formulas.GetMoveTypeEfficiencyAgainst(flamethrower, venusaur)).toBe(Constants.SE_MULTI);
    expect(Formulas.GetMoveTypeEfficiencyAgainst(meteor_mash, venusaur)).toBe(1);
})

test('DamageFormula:NotNaN', () => {
    let venusaur = pokemon_repo.LoadPokemon("V0003_POKEMON_VENUSAUR");
    let frenzy_plant = move_repo.LoadMove("FRENZY_PLANT");

    expect(Formulas.CalculateDamageToTargetPokemon(venusaur, venusaur, frenzy_plant)).not.toBeNaN();
})


test('DamageFormula:AccurateNumber', () => {
    let venusaur = pokemon_repo.LoadPokemon("V0003_POKEMON_VENUSAUR");
    let frenzy_plant = move_repo.LoadMove("FRENZY_PLANT");

    expect(Formulas.CalculateDamageToTargetPokemon(venusaur, venusaur, frenzy_plant)).toBe(32);
})

test('DamageFormula:Splash', () => {
    let venusaur = pokemon_repo.LoadPokemon("V0003_POKEMON_VENUSAUR");
    let splash = move_repo.LoadMove("COMBAT_V0231_MOVE_SPLASH_FAST");

    expect(Formulas.CalculateDamageToTargetPokemon(venusaur, venusaur, splash)).toBe(1);
})


