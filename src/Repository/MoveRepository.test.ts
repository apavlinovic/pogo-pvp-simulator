import { Type } from "../Shared/Types";
import { MoveRepository } from "./MoveRepository";
import { MoveCategory } from "../Models/Move";

test('MoveRepository:MoveCreate', () => {
    let repo = new MoveRepository();

    expect(repo.ExtractTypeIdentifier("POKEMON_TYPE_ELECTRIC")).toBe("Electric");
    expect(repo.ExtractTypeIdentifier("POKEMON_TYPE_DRAGON")).toBe("Dragon");
    
    let air_slash = repo.LoadMove("Air Slash");
    expect(air_slash.Energy).toBe(9);
    expect(air_slash.Power).toBe(9);
    expect(air_slash.Turns).toBe(2);
    expect(air_slash.Type).toBe(Type.Flying);
    expect(air_slash.Category).toBe(MoveCategory.Fast);

    let brave_bird = repo.LoadMove("Brave Bird");
    expect(brave_bird.Energy).toBe(-55);
    expect(brave_bird.Turns).toBe(null);
    expect(brave_bird.Power).toBe(90);
    expect(brave_bird.Type).toBe(Type.Flying);
    expect(brave_bird.Category).toBe(MoveCategory.Charge);

});