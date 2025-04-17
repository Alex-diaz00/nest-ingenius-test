import { check, fail, group } from 'k6';
import http from 'k6/http';
import { Rate } from 'k6/metrics';
import formUrlencoded from 'https://jslib.k6.io/form-urlencoded/3.0.0/index.js';
import faker from 'https://unpkg.com/faker@5.1.0/dist/faker.js';
import Ajv from 'https://jslib.k6.io/ajv/6.12.5/index.js';

const paginationSchema = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
    },
    meta: {
      type: 'object',
      properties: {
        itemCount: {
          type: 'number',
        },
        totalItems: {
          type: 'number',
        },
        itemsPerPage: {
          type: 'number',
        },
        totalPages: {
          type: 'number',
        },
        currentPage: {
          type: 'number',
        },
      },
      required: [
        'itemCount',
        'totalItems',
        'itemsPerPage',
        'totalPages',
        'currentPage',
      ],
    },
    links: {
      type: 'object',
      properties: {
        first: {
          type: 'string',
        },
        previous: {
          type: 'string',
        },
        next: {
          type: 'string',
        },
        last: {
          type: 'string',
        },
      },
    },
  },
};
const ajv = new Ajv({ allErrors: true });
const validatePagination = ajv.compile(paginationSchema);

const createTaskFailedRate = new Rate('failed create task request');
const updateTaskFailedRate = new Rate('failed update task request');
const doneTaskFailedRate = new Rate('failed mark task as done request');
const pendingTaskFailedRate = new Rate('failed mark task as pending request');
const deleteTaskFailedRate = new Rate('failed delete task request');

export function requestTaskWorkflow(baseUrl, token) {
  group('Create a new task', () => {
    const payload = formUrlencoded({ text: faker.lorem.sentence() });
    const params = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
    };

    const res = http.post(
      `${baseUrl}/task`,
      payload,
      Object.assign({ responseType: 'text' }, params),
    );

    const result = check(res, {
      'Task created successfully': res => res.status === 201,
      'JSON response': res => /json/.test(res.headers['Content-Type']),
    });

    if (!result) {
      createTaskFailedRate.add(1);
      fail('failed to create one task');
    }

    const task = res.json();

    group('Get one task', () => {
      const res = http.get(`${baseUrl}/task/${task.id}`, params);

      check(res, {
        'Task retrieved successfully': res => res.status === 200,
        'JSON response': res => /json/.test(res.headers['Content-Type']),
      });
    });

    group('Update one task', () => {
      const payload = formUrlencoded({ text: faker.lorem.sentence() });
      const res = http.put(`${baseUrl}/task/${task.id}`, payload, params);

      const result = check(res, {
        'Task updated successfully': res => res.status === 200,
        'JSON response': res => /json/.test(res.headers['Content-Type']),
      });
      updateTaskFailedRate.add(!result);
    });

    group('Mark one task as done', () => {
      const res = http.patch(`${baseUrl}/task/${task.id}/done`, null, params);

      const result = check(res, {
        'Task marked as done successfully': res => res.status === 200,
        'JSON response': res => /json/.test(res.headers['Content-Type']),
      });
      doneTaskFailedRate.add(!result);

      group('Mark one task as pending', () => {
        const res = http.patch(
          `${baseUrl}/task/${task.id}/pending`,
          null,
          params,
        );

        const result = check(res, {
          'Task marked as pending successfully': res => res.status === 200,
          'JSON response': res => /json/.test(res.headers['Content-Type']),
        });
        pendingTaskFailedRate.add(!result);

        group('Remove one task', () => {
          const res = http.del(`${baseUrl}/task/${task.id}`, null, params);

          const result = check(res, {
            'Task removed successfully': res => res.status === 204,
          });

          deleteTaskFailedRate.add(!result);
        });
      });
    });
  });
}

export function requestUnauthorizedTask(baseUrl) {
  group('Require authentication', () => {
    const responses = http.batch([
      {
        url: `${baseUrl}/task`,
        method: 'POST',
        body: {
          text: 'Hack the server',
        },
        params: {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      },
      {
        url: `${baseUrl}/task`,
        method: 'GET',
      },
      {
        url: `${baseUrl}/task/2`,
        method: 'GET',
      },
      {
        url: `${baseUrl}/task/2`,
        method: 'PUT',
        body: {
          text: 'You have been hacked',
        },
        params: {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      },
      {
        url: `${baseUrl}/task/2/done`,
        method: 'PATCH',
      },
      {
        url: `${baseUrl}/task/2/pending`,
        method: 'PATCH',
      },
      {
        url: `${baseUrl}/task/2`,
        method: 'DELETE',
      },
    ]);

    check(responses, {
      'status is UNAUTHORIZED': responses =>
        responses.every(({ status }) => status === 401),
    });
  });
}

export function requestListTask(baseUrl, token) {
  const params = {
    responseType: 'text',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  group('List all tasks', () => {
    const res = http.get(`${baseUrl}/task`, params);

    const result = check(res, {
      'Task listed successfully': res => res.status === 200,
      'JSON response': res => /json/.test(res.headers['Content-Type']),
      'Task list is paginated': res => {
        const valid = validatePagination(res.json());

        return !!valid;
      },
    });
    createTaskFailedRate.add(!result);
  });
}
