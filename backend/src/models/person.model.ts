/**
 * Model defines a datatype's schema (kinda like class)
 */
import mongoose, { Schema, model } from 'mongoose';

export interface PersonModel {
  full_name: string,
  birthday: Date,
  gender: string,
  location: string,
  first_met: Date,
  how_we_met: string,
  interests: string[],
  organisation: string,
  social_media: Map<string, string>,
  image: Buffer,
  encounters: mongoose.Types.ObjectId[],
  time_updated: Date,
}

const schema = new Schema<PersonModel>({
  full_name: { type: String, required: true },
  birthday: { type: Date, required: false },
  gender: { type: String, required: false },
  location: { type: String, required: false },
  first_met: { type: Date, required: false },
  how_we_met: { type: String, required: false },
  interests: { type: [String], required: false },
  organisation: { type: String, required: false },
  social_media: { type: Map, of: String, required: false },
  image: { type: Buffer, required: false },
  encounters: { type: [mongoose.Types.ObjectId], required: false },
  time_updated: { type: Date, default: Date.now, required: true },
});

export default model<PersonModel>('Person', schema);
