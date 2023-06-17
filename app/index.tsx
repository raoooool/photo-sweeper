import { ScrollView } from "tamagui";
import {
  PermissionStatus,
  getAlbumsAsync,
  usePermissions,
} from "expo-media-library";
import { useRequest } from "ahooks";
import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import AlbumCard from "../components/AlbumCard";

export default function HomePage() {
  const [permissionResponse, requestPermission] = usePermissions();

  const { data: albums = [] } = useRequest(
    () =>
      getAlbumsAsync({ includeSmartAlbums: true }).then((albums) =>
        albums.filter((album) => !!album.assetCount)
      ),
    {
      ready: permissionResponse?.status === PermissionStatus.GRANTED,
      onSuccess(albums) {
        console.log("albums :>> ", albums);
      },
    }
  );

  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: "相册清道夫 🧹" }} />
      <ScrollView contentInsetAdjustmentBehavior="automatic" padding="$4">
        {albums.map((album) => (
          <AlbumCard
            width="50%"
            height={0}
            paddingBottom="50%"
            key={album.title}
            album={album}
          />
        ))}
      </ScrollView>
    </>
  );
}
