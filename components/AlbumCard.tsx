import { useRequest } from "ahooks";
import { Album, getAssetsAsync } from "expo-media-library";
import { useState } from "react";
import { Card, CardProps, H3, Image, Spinner } from "tamagui";

export default function AlbumCard(props: { album: Album } & CardProps) {
  const { album, ...restProps } = props;

  const { data: coverUri = "", loading: coverLoading } = useRequest(() =>
    getAssetsAsync({ album: props.album, mediaType: "photo", first: 1 }).then(
      (resp) => resp.assets.map((asset) => asset.uri)[0]
    )
  );

  const [cardSize, setCardSize] = useState<{ height: number; width: number }>({
    height: 0,
    width: 0,
  });

  const loading = coverLoading || cardSize.height === 0 || cardSize.width === 0;

  const cardContentRender = () => {
    if (loading)
      return (
        <Card.Background>
          <Spinner />
        </Card.Background>
      );
    return (
      <Card.Background>
        <Card.Header padded>
          <H3>{props.album.title}</H3>
        </Card.Header>
        <Image
          resizeMode="cover"
          alignSelf="center"
          opacity={0.4}
          source={{
            uri: coverUri,
            ...cardSize,
          }}
        />
      </Card.Background>
    );
  };

  return (
    <Card
      overflow="hidden"
      onLayout={(e) =>
        setCardSize({
          width: e.nativeEvent.layout.width,
          height: e.nativeEvent.layout.height,
        })
      }
      {...restProps}
    >
      {cardContentRender()}
    </Card>
  );
}
