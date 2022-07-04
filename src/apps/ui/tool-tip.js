import { Tooltip } from 'bootstrap';

export const tooltip = {
  mounted(el) {
    const tooltip = new Tooltip(el);
  },
};

// https://stackoverflow.com/questions/69053972/adding-bootstrap-5-tooltip-to-vue-3
