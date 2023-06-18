import { ScrollView, XStack } from "tamagui";
import {
  PermissionStatus,
  getAlbumsAsync,
  usePermissions,
} from "expo-media-library";
import { useRequest } from "ahooks";
import { useEffect, useMemo, useState } from "react";
import { Stack, useRouter } from "expo-router";
import AlbumCard from "../components/AlbumCard";
import useAlbumStore from "../stores/albumStore";

const SCROLL_VIEW_PADDING = 24;
const CARDS_GAP = 12;

export default function HomePage() {
  const [permissionResponse, requestPermission] = usePermissions();
  const setAlbums = useAlbumStore((s) => s.setAlbums);

  const router = useRouter();

  const { data: albums = [] } = useRequest(
    () =>
      getAlbumsAsync({ includeSmartAlbums: true }).then((albums) =>
        albums.filter((album) => !!album.assetCount)
      ),
    {
      ready: permissionResponse?.status === PermissionStatus.GRANTED,
      onSuccess: (albums) => setAlbums(albums),
    }
  );

  const [scrollViewWidth, setScrollViewWidth] = useState(0);

  const cardWidth = useMemo(
    () => (scrollViewWidth - SCROLL_VIEW_PADDING * 2 - CARDS_GAP) >> 1,
    [scrollViewWidth]
  );

  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: "相册清道夫 🧹" }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        onLayout={(e) => setScrollViewWidth(e.nativeEvent.layout.width)}
      >
        <XStack padding={SCROLL_VIEW_PADDING} flexWrap="wrap" gap={CARDS_GAP}>
          {albums.map((album) => (
            <AlbumCard
              width={cardWidth}
              height={cardWidth}
              key={album.title}
              album={album}
              onPress={() => router.push(`/album/${album.id}`)}
            />
          ))}
        </XStack>
      </ScrollView>
    </>
  );
}
