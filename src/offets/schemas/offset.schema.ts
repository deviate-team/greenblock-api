import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';


export type OffsetDocument = Offset & HydratedDocument<Offset>;

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
export class Offset extends Document {
    @Prop({ required: true })
    project_name:string;

    @Prop({ required: true })
    description:string;

    @Prop({ required: true })
    owner:string;

    @Prop({ required: true,
        type: Object 
    })
    time_period:TimePeriod;

    @Prop({ required: true })
    price_by_unit:number;

    @Prop({ required: true ,
        type: Object
    })
    contract:Contract;

    @Prop({ required: true })
    image:string;

    @Prop({ required: true })
    maximun:5;
}

export const OffsetSchema = SchemaFactory.createForClass(Offset);
