import { model, Schema, Document } from 'mongoose';

// List.
interface List extends Document {
  text: string;
  is_checked: boolean;
}

const ListSchema = new Schema<List>({
  text: {
    type: String,
    required: true
  },
  is_checked: {
    type: Boolean,
    default: false
  }
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
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  created_at: Date,
  updated_at: Date,
  list: [ListSchema]
});

export const ListModel = model<List>('List', ListSchema);
export const ListRoomModel = model<ListRoom>('ListRoom', ListRoomSchema);
