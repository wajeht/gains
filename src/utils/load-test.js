// k6 run src/utils/load-test.js

import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 20,
  duration: '30s',
};

export default function () {
  let res = http.get('https://gains.jaw.dev/health');
  check(res, {
    success: (r) => r.status == 200,
  });
}
