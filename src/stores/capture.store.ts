import { defineStore } from 'pinia';
import { Frame } from 'src/types';
import * as service from 'src/service/capture';
export type CaptureStoreState = {
  frames: Frame[];
  isStreaming: boolean;
  rightDrawerOpen: boolean;
  leftDrawerOpen: boolean;
  selectedFrameId: number | null;
};

export const useCaptureStore = defineStore('capture', {
  state: (): CaptureStoreState => ({
    frames: [],
    isStreaming: false,
    rightDrawerOpen: false,
    leftDrawerOpen: false,
    selectedFrameId: null,
  }),

  actions: {
    async createImage(frame: Frame, projectName: string): Promise<void> {
      try {
        await service.uploadImage(frame.thumbnail, projectName);
        this.$state.frames.unshift(frame);
      } catch (error) {
        throw new Error('Error uploading image');
      }
    },
    setFrames(frames: Frame[]): void {
      if (!Array.isArray(frames)) {
        throw new Error('Invalid frames');
      }
      this.$state.frames = frames;
    },
    setSelectedFrameById(frameId: number): void {
      if (typeof frameId !== 'number') {
        throw new Error('Invalid frame ID');
      }
      if (!this.$state.frames.some((frame) => frame.id === frameId)) {
        throw new Error('ID does not exist');
      }
      this.$state.selectedFrameId = frameId;

      this.router.push({ name: 'capture-detail', params: { frameId } });
    },
    stopVideoStream(): void {
      this.$state.isStreaming = false;
    },
    startVideoStream(): void {
      this.$state.isStreaming = true;
    },
    addTag(frameId: number, value: string): void {
      const frame = (this.$state.frames as Frame[]).find(
        (frame) => frame.id === frameId
      );
      if (!frame) {
        throw new Error('no image');
      }
      frame.tags.unshift(value);
      service.updateTags(frame.tags, frame.image);
    },
    getTags(frameId: number) {
      const frame = (this.$state.frames as Frame[]).find(
        (frame) => frame.id === frameId
      );
      if (!frame) {
        throw new Error('no image');
      }
      return frame.tags;
    },
    removeTag(frameId: number, index: number): void {
      const frame = (this.$state.frames as Frame[]).find(
        (frame) => frame.id === frameId
      );
      if (!frame) {
        throw new Error('no image');
      }
      frame.tags.splice(index, 1);
      service.updateTags(frame.tags, frame.image);
    },
  },
});
