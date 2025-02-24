import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Location {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;
}
export const LocationSchema = SchemaFactory.createForClass(Location);
