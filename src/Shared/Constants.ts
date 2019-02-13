export default class Constants {
	static SE_MULTI = 1.600000023841858;
	static NE_MULTI = 0.625;
	static MAX_ENG = 100;
	
	static STAB_MULTI = 1.2000000476837158;
	static WEATHER_MULTI = 1.2000000476837158;

	static FAST_ATTACK_BONUS_MULTIPLIER = 1.2999999523162842;
	static CHARGE_ATTACK_BONUS_MULTIPLIER = 1.2999999523162842;

	static SIM_TURN_DELTA = 0.15;
	static HALF_TURN_DURATION = 0.5;
    static TURN_DURATION_MS = 500;
	
    static CHARGE_MOVE_TURN_DURATION = 8;
    static SHIELD_TURN_DURATION = 8;
	static SHIELD_COUNT = 2;
	
	static GREAT_LEAGUE_MAX_CP = 1500;
	static ULTRA_LEAGUE_MAX_CP = 2500;
	static MASTER_LEAGUE_MAX_CP = 15000;

	static SQLITE_DB = "result-db.db";
	static SQLITE_TABLE_NAME = "SimulationResult";

	static CPM = [
		0.0940000, 0.1351374, 0.1663979, 0.1926509, 0.2157325,0.2365727,0.2557201,0.2735304,0.2902499,0.3060574,0.3210876,0.3354450,0.3492127,0.3624578,0.3752356,0.3875924,0.3995673,0.4111936,0.4225000,0.4335117,0.4431076,0.4530600,0.4627984,0.4723361,0.4816850,0.4908558,0.4998584,0.5087018,0.5173940,0.5259425,0.5343543,0.5426358,0.5507927,0.5588306,0.5667545,0.5745692,0.5822789,0.5898879,0.5974000,0.6048188,0.6121573,0.6194041,0.6265671,0.6336492,0.6406530,0.6475810,0.6544356,0.6612193,0.6679340,0.6745819,0.6811649,0.6876849,0.6941437,0.7005429,0.7068842,0.7131691,0.7193991,0.7255756,0.7317000,0.7347410,0.7377695,0.7407856,0.7437894,0.7467812,0.7497610,0.7527291,0.7556855,0.7586304,0.7615638,0.7644861,0.7673972,0.7702973,0.7731865,0.7760650,0.7789328,0.7817901,0.7846370,0.7874736,0.79030001
	]	

	static GetCPM(level: number) {
		return this.CPM[level * 2 - 2];
	}
};