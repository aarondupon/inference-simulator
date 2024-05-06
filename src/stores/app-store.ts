import { defineStore } from 'pinia';
interface ThumbnailComponentProps {
  uuid: string;
  tags: string[];
  image?: string;
  thumbnail?: string;
  title?: string;
  timecreated?: Date;
  description?: string;
}

export type AppStoreState = {
  thumbnails: ThumbnailComponentProps[];
  isStreaming: boolean;
  rightDrawerOpen: boolean;
  selectedImageId: string | null;
};

export const useAppStore = defineStore('app', {
  state: (): AppStoreState => ({
    thumbnails: [],
    isStreaming: false,
    rightDrawerOpen: true,
    selectedImageId: null,
  }),
  getters: {
    leftDrawerOpen: (state): boolean => {
      return state.thumbnails.length > 0 && !state.isStreaming;
    },
  },
  actions: {
    addImage(thumbnail: ThumbnailComponentProps): void {
      this.$state.thumbnails.unshift(thumbnail);
    },
    setSelectedImageById(uuid: string): void {
      /** do something */
      if (
        !this.$state.thumbnails.some((thumbnail) => thumbnail.uuid === uuid)
      ) {
        throw new Error('UUID does not exist');
      }
      this.$state.selectedImageId = uuid;
      console.log('use router');
      this.router.push({ name: 'inspect', params: { uuid } });
    },
    saveImage(/*thumbnail: ThumbnailComponentProps*/): void {
      /** do something */
    },
    getAllImages(): void {
      /** do something */
    },
    stopVideoStream(): void {
      /** do something */
      this.$state.isStreaming = false;
    },
    startVideoStream(): void {
      /** do something */
      this.$state.isStreaming = true;
    },
    addTag(imageId: string, value: string): void {
      const image = (this.$state.thumbnails as ThumbnailComponentProps[]).find(
        (image) => image.uuid === imageId
      );
      if (!image) {
        throw new Error('no image');
      }
      image.tags.unshift(value);
    },
    getTags(imageId: string) {
      const image = (this.$state.thumbnails as ThumbnailComponentProps[]).find(
        (image) => image.uuid === imageId
      );
      if (!image) {
        throw new Error('no image');
      }
      return image.tags;
    },
    removeTag(imageId: string, index: number): void {
      const image = (this.$state.thumbnails as ThumbnailComponentProps[]).find(
        (image) => image.uuid === imageId
      );
      if (!image) {
        throw new Error('no image');
      }
      console.log('RemoveTag', index);
      image.tags.splice(index, 1);
    },
  },
});
