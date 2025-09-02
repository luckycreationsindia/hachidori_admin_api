import {MongooseCache} from "../interfaces/mongoose-cache";

// Extend the global namespace
declare global {
    var mongoose: MongooseCache;
}