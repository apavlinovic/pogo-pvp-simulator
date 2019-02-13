import { Pokemon } from "../Models/Pokemon";
import { Move, MoveCategory } from "../Models/Move";
import { TypeEfficiency } from "./TypeEfficiency";
import Constants from "./Constants";

export default class Formulas {

    static GetMoveTypeEfficiencyAgainst(move: Move, defender: Pokemon) {
        return TypeEfficiency.GetMoveEfficiency(move.Type, defender.Type1, defender.Type2);
    }

    static GetStabMultiplier(move: Move, attacker: Pokemon) {
        return (move.Type === attacker.Type1 || move.Type === attacker.Type2) ? Constants.STAB_MULTI : 1;
    }

    static GetCPMRatio(LVL_1: number, LVL_2: number) {
        return Constants.GetCPM(LVL_1) / Constants.GetCPM(LVL_2);
    }

    static GetStatsRatio(attacker: Pokemon, defender: Pokemon) {
        return (attacker.ATK + attacker.IV_ATK) / (defender.DEF + defender.IV_DEF);
    }

    static GetMovePVPBonusMultiplier(move: Move) {
        return move.Category === MoveCategory.Fast 
            ? Constants.FAST_ATTACK_BONUS_MULTIPLIER
            : Constants.CHARGE_ATTACK_BONUS_MULTIPLIER;
    }

    static CalculateDamageToTargetPokemon(attacker: Pokemon, defender: Pokemon, move: Move) {
        let multi_type = this.GetMoveTypeEfficiencyAgainst(move, defender);
        let multi_stab = this.GetStabMultiplier(move, attacker);

        let ratio_cpm = this.GetCPMRatio(attacker.LVL, defender.LVL);
        let ratio_stats = this.GetStatsRatio(attacker, defender);

        let pvp_bonus_multiplier = this.GetMovePVPBonusMultiplier(move);

        let move_damage = 0.5 * (move.Power * pvp_bonus_multiplier * ratio_stats * ratio_cpm) * (multi_type * multi_stab);

        return Math.floor(move_damage) + 1;
    }
}