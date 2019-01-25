import { Pokemon } from "./Pokemon";
import { Move } from "./Move";
import { TypeEfficiency } from "../Shared/TypeEfficiency";
import Constants from "../Shared/Constants";

export class Battler {
    Pokemon: Pokemon;
    FastMove: Move;
    ChargeMove: Move;
    ChargeMove2: Move | null;

    Energy: number;
    Shields: number;

    constructor(pokemon: Pokemon, fastMove: Move, chargeMove: Move, chargeMove2?: Move | null) {
        this.Pokemon = pokemon;
        this.FastMove = fastMove;
        this.ChargeMove = chargeMove;
        this.ChargeMove2 = chargeMove2 ? chargeMove2 : null;

        this.Energy = 0;
        this.Shields = 2;
    }

    IsAlive() {
        return this.Pokemon.HP >= 0;
    }

    TakeDamage(damage: number) {
        this.Pokemon.HP -= damage;
    }

    CanUseShield() {
        return this.Shields > 0;
    }

    ActivateShield() {
        this.Shields--;
    }

    CanUseChargeMove() {
        return this.Energy + this.ChargeMove.Energy > 0;
    }

    ActivateMove(move: Move) {
        this.Energy += move.Energy;
    }

    CalculateDamage(target: Battler, move: Move) {
        
        let damage = this.CalculateDamageToTargetPokemon(target.Pokemon, move);

        return damage;
    }

    private CalculateDamageToTargetPokemon(target: Pokemon, move: Move) {
        let multi_type = TypeEfficiency.GetMoveEfficiency(move.Type, target.Type1, target.Type2);
        let multi_stab = this.Pokemon.GetStabMultiplier(move);

        let ratio_cpm = Constants.GetCPM(this.Pokemon.LVL) / Constants.GetCPM(target.LVL);
        let ratio_stats = this.Pokemon.ATK / target.DEF;

        let move_damage = 0.5 * (move.Power * ratio_stats * ratio_cpm) * (multi_type * multi_stab);

        return Math.floor(move_damage) + 1;
    }

}