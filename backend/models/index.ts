import { model, Schema, Document } from 'mongoose';

// List.
interface List extends Document {
  text: string;
  is_checked: boolean;
}

const ListSchema = new Schema<List>({
  text: String,
  is_checked: Boolean
});

// ListRoom.
interface ListRoom extends Document {
  name: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  list: List[];
}

const ListRoomSchema = new Schema<ListRoom>({
  name: String,
  password: String,
  created_at: Date,
  updated_at: Date,
  list: [ListSchema]
});

export const ListModel = model<List>('List', ListSchema);
export const ListRoomModel = model('ListRoom', ListRoomSchema);
