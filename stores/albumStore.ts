import { create } from "zustand";
import { combine } from "zustand/middleware";
import { IAlbum } from "../types";

const useAlbumStore = create(
  combine(
    {
      albums: [] as IAlbum[],
    },
    (set, get) => ({
      setAlbums: (albums: IAlbum[]) => set({ albums }),
      getCurrentAlbum: (id: string) =>
        get().albums.find((album) => album.id === id)!,
    })
  )
);

export default useAlbumStore;
