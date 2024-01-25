import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Movies extends Document {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  genre: string;

  @Prop({ required: true, min: 0, max: 10 })
  rating: number;

  @Prop({ required: true })
  streamingLink: string;

  @Prop({ required: true })
  releaseDate: Date;

  @Prop({ required: true })
  director: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const MoviesSchema = SchemaFactory.createForClass(Movies);
