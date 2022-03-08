import Encounter from "../models/encounter.model"

export const createEncounter = async (encounterDetails: JSON): Promise<void>  => {
    const encounter = new Encounter(encounterDetails);    
    // await encounter.save();
}
