import { Document } from 'mongoose';

export interface IMovie extends Document {
  readonly title: string;
  readonly genre: string;
  readonly rating: number;
  readonly streamingLink: string;
  readonly releaseDate: Date;
  readonly director: string;
  readonly description: string;
  readonly isDeleted: boolean;
}
