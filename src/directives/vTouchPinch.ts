import * as Vue from 'vue';

interface HTMLElementWithState extends HTMLElement {
  _touchMove: (e: TouchEvent) => void;
  _touchEnd: (e: TouchEvent) => void;
  _mouseWheel: (e: WheelEvent) => void;
}

export type TouchPinchValue = {
  evt?: Event;
  delta?: {
    x: number;
    y: number;
  };
  zoom: number;
};

export const vTouchPinch = {
  mounted(el, binding) {
    const $el = el as HTMLElementWithState;
    const state = {
      initialDistance: 0,
      cameraZoom: 1,
      MAX_ZOOM: 5,
      MIN_ZOOM: 0.1,
      SCROLL_SENSITIVITY: 0.0005,
      lastDist: null as number | null,
      lastCenter: null as { x: number; y: number } | null,
      dx: 0,
      dy: 0,
      zoom: 1,
    };

    $el._touchMove = function (e) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];

      if (touch1 && touch2) {
        const center = {
          x: (touch1.clientX + touch2.clientX) / 2,
          y: (touch1.clientY + touch2.clientY) / 2,
        };

        const dist = Math.sqrt(
          (touch1.clientX - touch2.clientX) ** 2 +
            (touch1.clientY - touch2.clientY) ** 2
        );

        if (!state.lastCenter) {
          state.lastCenter = center;
          return;
        }

        // calculate new position of the stage
        state.dx = center.x - state.lastCenter.x;
        state.dy = center.y - state.lastCenter.y;

        if (state.lastDist && state.lastDist !== dist) {
          adjustZoom(null, dist / state.lastDist);
        }

        state.lastDist = dist;
        state.lastCenter = center;
      }

      if (typeof binding.value === 'function') {
        const details = {
          evt: e,
          delta: {
            x: state.dx,
            y: state.dy,
          },
          zoom: state.zoom,
        };

        binding.value(details) as TouchPinchValue;
      }
    };

    $el._touchEnd = function () {
      state.lastDist = 0;
      state.lastCenter = null;
    };

    $el._mouseWheel = function (e) {
      if (!binding.modifiers.wheel) return;
      adjustZoom(e.deltaY * state.SCROLL_SENSITIVITY);
      if (typeof binding.value === 'function') {
        const details = {
          evt: e,
          delta: {
            x: state.dx,
            y: state.dy,
          },
          zoom: state.zoom,
        };

        binding.value(details) as TouchPinchValue;
      }
    };

    function adjustZoom(zoomAmount: number | null = null, zoomFactor = 1) {
      if (zoomAmount) {
        state.zoom += zoomAmount;
      } else if (zoomFactor) {
        state.zoom = zoomFactor * state.zoom;
      }

      state.zoom = Math.max(
        Math.min(state.zoom, state.MAX_ZOOM),
        state.MIN_ZOOM
      );
    }

    $el.addEventListener('wheel', $el._mouseWheel, { passive: true });
    $el.addEventListener('touchmove', $el._touchMove, { passive: true });
    $el.addEventListener('touchend', $el._touchEnd, { passive: true });

    return state;
  },
  unmounted(el) {
    const $el = el as HTMLElementWithState;
    $el.removeEventListener('touchmove', $el._touchMove);
    $el.removeEventListener('touchend', $el._touchEnd);
  },
} as Vue.Directive<HTMLElement>;
