import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';


export type OfferDocument = Offer & HydratedDocument<Offer>;

export interface TimePeriod {
    start: Date;
    end: Date;
}

export interface Contract {
    name:string;
    email:string;
    tel:number;
}

@Schema()
export class Offer extends Document {
    @Prop({ required: true })
    type:string;

    @Prop({ required: true })
    owner:string;

    @Prop({ required: true })
    _id :string;
}

export const OfferSchema = SchemaFactory.createForClass(Offer);
