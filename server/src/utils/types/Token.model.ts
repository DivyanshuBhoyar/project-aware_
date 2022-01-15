import { Schema, model } from 'mongoose';


// 1. Create an interface representing a document in MongoDB.
interface VToken {
    userid: number;
    createdAt: any;
}

// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<VToken>({
    userid: { type: Number, required: true },
    createdAt: { type: Date, required: true, expires: '10m', default: Date.now }
});

// 3. Create a Model.
export const VToken = model<VToken>('VerificationToken', schema);