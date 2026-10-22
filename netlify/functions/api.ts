import { connectDB } from '../../lib/server/db';
import { getSession } from '../../lib/server/session';
import type { ApiResponse } from '../../lib/server/api';
import { RoomModel, TodoModel } from '../../lib/models';
import type { BaseRoom, BaseTodo } from '../../lib/models/types';
import { mergeTodos } from '../../lib/todos';

const API_PREFIX = /^\/(\.netlify\/functions\/api|api)/;

function getPath(request: Request) {
  const url = new URL(request.url);

  return url.pathname.replace(API_PREFIX, '') || '/';
}

function jsonResponse(
  body: ApiResponse<unknown> | null,
  status: number,
  headers: Headers
) {
  if (body === null) {
    return new Response(null, { status, headers });
  }

  const responseHeaders = new Headers(headers);
  responseHeaders.set('Content-Type', 'application/json');

  return new Response(JSON.stringify(body), {
    status,
    headers: responseHeaders
  });
}

function errorResponse(message: string, status: number, headers: Headers) {
  return jsonResponse(
    { errors: [{ code: '10000', message }] },
    status,
    headers
  );
}

export default async function handler(request: Request) {
  const path = getPath(request);
  let headers = new Headers();

  try {
    await connectDB();

    const sessionData = await getSession(request);
    const { session } = sessionData;
    headers = sessionData.headers;

    if (request.method === 'GET' && path === '/current-room') {
      if (!session.roomId) {
        return new Response(null, { status: 401, headers });
      }

      const room = await RoomModel.findById(session.roomId).exec();

      if (!room) {
        return new Response(null, { status: 401, headers });
      }

      return jsonResponse({ data: room }, 200, headers);
    }

    if (request.method === 'POST' && path === '/rooms') {
      const body = (await request.json()) as Pick<
        BaseRoom,
        'name' | 'password'
      >;
      const room = new RoomModel(body);
      const savedRoom = await room.save();

      session.roomId = String(savedRoom._id);
      await session.save();

      return jsonResponse({ data: savedRoom }, 200, headers);
    }

    const roomAction = path.match(/^\/rooms\/([^/]+)\/(access|leave|sync-todos)$/);

    if (request.method === 'POST' && roomAction) {
      const name = decodeURIComponent(roomAction[1]);
      const action = roomAction[2];

      if (action === 'leave') {
        session.destroy();

        return jsonResponse(null, 204, headers);
      }

      if (action === 'access') {
        const body = (await request.json()) as { password: string };
        const room = await RoomModel.findOne({
          name,
          password: body.password
        }).exec();

        if (!room) {
          return errorResponse('Invalid room information.', 400, headers);
        }

        session.roomId = String(room._id);
        await session.save();

        return jsonResponse({ data: room }, 200, headers);
      }

      const roomObject = await RoomModel.findOne({ name }).exec();

      if (!roomObject) {
        return errorResponse('Invalid room information.', 400, headers);
      }

      const { added, modified, removed } = (await request.json()) as {
        added: BaseTodo[];
        modified: BaseTodo[];
        removed: BaseTodo[];
      };
      const removedLocalIds = removed.map((todo) => todo.localId);
      let resolvedTodos = roomObject.todos;

      // Remove deleted todos.
      resolvedTodos = resolvedTodos.filter(
        (todo) => !removedLocalIds.includes(todo.localId)
      );

      // Modify modified todos.
      for (const todo of modified) {
        const serverTodo = resolvedTodos.find(
          (el) => el.localId === todo.localId
        );

        if (serverTodo) {
          const serverUpdatedAt = new Date(serverTodo.updatedAt).getTime();
          const clientUpdatedAt = new Date(todo.updatedAt).getTime();

          if (clientUpdatedAt > serverUpdatedAt) {
            for (const key in todo) {
              serverTodo[key] = todo[key];
            }
          }
        }
      }

      // Add added todos.
      const addedTodoModels = added.map((todo) => new TodoModel(todo));
      roomObject.todos = mergeTodos({
        added: addedTodoModels,
        removed,
        modified,
        base: resolvedTodos
      });
      // Fix the order of the todos.
      for (let i = 0; i < roomObject.todos.length; i++) {
        roomObject.todos[i].indexOrder = i;
      }
      await roomObject.save();

      return jsonResponse({ data: roomObject }, 200, headers);
    }

    return errorResponse('Not found.', 404, headers);
  } catch (err) {
    console.error(err);

    return errorResponse(
      err instanceof Error ? err.message : 'Unexpected error occurred.',
      400,
      headers
    );
  }
}
