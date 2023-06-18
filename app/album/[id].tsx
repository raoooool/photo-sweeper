import { Stack, useLocalSearchParams } from "expo-router";
import { Card, CardProps, Image, ImageProps, Text, YStack } from "tamagui";
import useAlbumStore from "../../stores/albumStore";
import { useRequest } from "ahooks";
import { Asset, MediaType, getAssetsAsync } from "expo-media-library";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlatList } from "react-native";
import { useState } from "react";

export default function AlbumPage() {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const currentAlbum = useAlbumStore((s) => s.getCurrentAlbum(id));
  const { bottom } = useSafeAreaInsets();
  const [currentAsset, setCurrentAsset] = useState<Asset>();
  const [previewBoxSize, setPreviewBoxSize] = useState({ height: 0, width: 0 });
  const {
    data: {
      assets = [],
      endCursor = "",
      hasNextPage = false,
      totalCount = 0,
    } = {},
  } = useRequest(
    (after: string) =>
      getAssetsAsync({
        album: currentAlbum,
        after,
        mediaType: [MediaType.photo, MediaType.video],
      }),
    {
      onSuccess({ assets = [] }) {
        if (!currentAsset && assets[0]) {
          setCurrentAsset(assets[0]);
        }
      },
    }
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerLargeTitle: false,
          title: currentAlbum.title,
          headerLargeStyle: { backgroundColor: "black" },
          headerTintColor: "white",
        }}
      />
      <YStack flex={1} backgroundColor="black">
        <YStack flex={1} jc="center" ai="center">
          <Card
            height="80%"
            width="80%"
            onLayout={(e) => setPreviewBoxSize(e.nativeEvent.layout)}
          >
            <Card.Background radiused>
              {currentAsset?.uri && (
                <Image
                  resizeMode="contain"
                  source={{
                    ...previewBoxSize,
                    uri: currentAsset?.uri,
                  }}
                />
              )}
            </Card.Background>
          </Card>
        </YStack>
        <YStack padding={24} paddingBottom={bottom + 24}>
          <FlatList
            data={assets}
            contentContainerStyle={{ gap: 6 }}
            horizontal
            keyExtractor={(item) => item.uri}
            renderItem={({ item }) => (
              <AssetRadio
                key={item.uri}
                isCurrent={currentAsset?.id === item.id}
                asset={item}
                width={88}
                height={88}
                onPress={() => setCurrentAsset(item)}
              />
            )}
          />
        </YStack>
      </YStack>
    </>
  );
}

function AssetRadio(props: {
  asset: Asset;
  width: number;
  height: number;
  isCurrent?: boolean;
  onPress(): void;
}) {
  const { asset, isCurrent = false, ...restProps } = props;
  return (
    <Card
      borderWidth={4}
      borderRadius={14}
      borderColor={isCurrent ? "white" : "black"}
      {...restProps}
    >
      <Card.Background radiused>
        <Image
          source={{
            uri: asset.uri,
            width: restProps.width,
            height: restProps.height,
          }}
        />
      </Card.Background>
    </Card>
  );
}
