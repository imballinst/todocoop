import axios from 'axios';

import { ApiResponse } from '../../types';
import { Room } from '../../models';

interface AccessRoomParams {
  name: string;
  password: string;
}

export async function accessRoom({
  name,
  password
}: AccessRoomParams): Promise<ApiResponse<Room>> {
  return axios.post(`/api/rooms/${name}/access`, {
    json: {
      password: password
    }
  });
}
