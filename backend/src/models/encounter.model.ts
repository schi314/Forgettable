import mongoose, { Schema, model } from 'mongoose';

export interface EncounterModel {
  date: Date,
  location: string,
  description: string,
  persons: mongoose.Types.ObjectId[]
}

const schema = new Schema<EncounterModel>({
  date: { type: Date, default: Date.now },
  location: { type: String, required: false },
  description: { type: String, required: true },
  persons: { type: [mongoose.Types.ObjectId], required: true },
});

export default model<EncounterModel>('Encounter', schema);
